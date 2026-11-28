"""One router factory for the managed content types (conferences, history), so both follow the same rules.

Rules: anyone signed in can read everything. Editors and super admins create, edit, delete and publish.
Contributors can only create drafts and edit or delete drafts; an editor publishes.
"""

from collections.abc import Callable
from typing import Any

from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import InstrumentedAttribute

from ..deps import DB, CurrentUser
from ..models import Role, Status, User
from ..services import publish_snapshot, record


def _forbid(detail: str) -> HTTPException:
    return HTTPException(status.HTTP_403_FORBIDDEN, detail)


def make_content_router(
    *,
    entity: str,
    model: type,
    create_schema: type[BaseModel],
    update_schema: type[BaseModel],
    out_schema: type[BaseModel],
    order_by: list[InstrumentedAttribute],
    describe: Callable[[Any], str],
) -> APIRouter:
    router = APIRouter()

    def is_contributor(user: User) -> bool:
        return user.role == Role.contributor.value

    @router.get("", response_model=list[out_schema])
    def list_items(db: DB, user: CurrentUser, status_filter: Status | None = Query(default=None, alias="status")):
        query = select(model).order_by(*order_by)
        if status_filter:
            query = query.where(model.status == status_filter.value)
        return db.scalars(query).all()

    @router.get("/{item_id}", response_model=out_schema)
    def get_item(item_id: int, db: DB, user: CurrentUser):
        item = db.get(model, item_id)
        if item is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found.")
        return item

    @router.post("", response_model=out_schema, status_code=status.HTTP_201_CREATED)
    def create_item(payload: create_schema, db: DB, user: CurrentUser):  # type: ignore[valid-type]
        if is_contributor(user) and payload.status == Status.published:
            raise _forbid("Contributors save drafts; an editor publishes.")
        item = model(**{**payload.model_dump(mode="json"), "created_by": user.id, "updated_by": user.id})
        db.add(item)
        db.flush()
        record(db, user, "create", entity, item.id, f"Created {describe(item)} ({item.status})")
        db.commit()
        publish_snapshot(db)
        return item

    @router.patch("/{item_id}", response_model=out_schema)
    def update_item(item_id: int, payload: update_schema, db: DB, user: CurrentUser):  # type: ignore[valid-type]
        item = db.get(model, item_id)
        if item is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found.")
        changes = payload.model_dump(mode="json", exclude_unset=True)
        if is_contributor(user):
            if item.status == Status.published.value:
                raise _forbid("This item is published. Ask an editor to change it.")
            if changes.get("status") == Status.published.value:
                raise _forbid("Contributors save drafts; an editor publishes.")
        previous_status = item.status
        for key, value in changes.items():
            setattr(item, key, value)
        item.updated_by = user.id
        action = "update"
        if "status" in changes and changes["status"] != previous_status:
            action = "publish" if changes["status"] == Status.published.value else "unpublish"
        verb = {"update": "Updated", "publish": "Published", "unpublish": "Unpublished"}[action]
        record(db, user, action, entity, item.id, f"{verb} {describe(item)}")
        db.commit()
        publish_snapshot(db)
        return item

    @router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
    def delete_item(item_id: int, db: DB, user: CurrentUser):
        item = db.get(model, item_id)
        if item is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found.")
        if is_contributor(user) and item.status == Status.published.value:
            raise _forbid("This item is published. Ask an editor to remove it.")
        label = describe(item)
        db.delete(item)
        record(db, user, "delete", entity, item_id, f"Deleted {label}")
        db.commit()
        publish_snapshot(db)

    return router

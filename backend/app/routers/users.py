from fastapi import APIRouter, HTTPException, status
from sqlalchemy import func, select

from ..deps import DB, SuperAdmin
from ..models import AuditLog, Role, User
from ..schemas import AuditOut, UserCreate, UserOut, UserUpdate
from ..security import hash_password, password_problem
from ..services import record

router = APIRouter()


def _active_super_admins(db: DB) -> int:
    return db.scalar(select(func.count()).select_from(User).where(User.role == Role.super_admin.value, User.is_active.is_(True))) or 0


def _check_password(password: str) -> None:
    problem = password_problem(password)
    if problem:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, problem)


@router.get("", response_model=list[UserOut])
def list_users(db: DB, admin: SuperAdmin):
    return db.scalars(select(User).order_by(User.name)).all()


@router.post("", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, db: DB, admin: SuperAdmin):
    email = payload.email.lower()
    if db.scalar(select(User).where(User.email == email)):
        raise HTTPException(status.HTTP_409_CONFLICT, "A user with this email already exists.")
    _check_password(payload.password)
    user = User(email=email, name=payload.name, password_hash=hash_password(payload.password), role=payload.role.value)
    db.add(user)
    db.flush()
    record(db, admin, "create", "user", user.id, f"Created user {email} as {user.role}")
    db.commit()
    return user


@router.patch("/{user_id}", response_model=UserOut)
def update_user(user_id: int, payload: UserUpdate, db: DB, admin: SuperAdmin):
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found.")
    changes = payload.model_dump(exclude_unset=True)
    demoting = ("role" in changes and changes["role"] != Role.super_admin) or changes.get("is_active") is False
    if demoting and user.role == Role.super_admin.value and user.is_active and _active_super_admins(db) <= 1:
        raise HTTPException(status.HTTP_409_CONFLICT, "There must always be at least one active super admin.")
    if "password" in changes:
        if changes["password"]:
            _check_password(changes["password"])
            user.password_hash = hash_password(changes["password"])
        changes.pop("password")
    for key, value in changes.items():
        setattr(user, key, value.value if isinstance(value, Role) else value)
    record(db, admin, "update", "user", user.id, f"Updated user {user.email}")
    db.commit()
    return user


@router.get("/audit/log", response_model=list[AuditOut])
def audit_log(db: DB, admin: SuperAdmin, limit: int = 200):
    return db.scalars(select(AuditLog).order_by(AuditLog.id.desc()).limit(min(limit, 1000))).all()

from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Request, status
from sqlalchemy import select

from ..deps import DB, CurrentUser
from ..models import User
from ..schemas import LoginIn, PasswordChange, TokenOut, UserOut
from ..security import create_token, hash_password, login_throttle, password_problem, verify_password

router = APIRouter()

# Checked even when the email is unknown, so response time does not reveal which emails have accounts.
_DUMMY_HASH = hash_password("not-a-real-password-A1")


@router.post("/login", response_model=TokenOut)
def login(payload: LoginIn, db: DB, request: Request):
    email = payload.email.lower()
    key = email
    if login_throttle.blocked(key):
        raise HTTPException(status.HTTP_429_TOO_MANY_REQUESTS, "Too many failed attempts. Try again in 15 minutes.")
    user = db.scalar(select(User).where(User.email == email))
    ok = verify_password(payload.password, user.password_hash if user else _DUMMY_HASH)
    if not (user and ok and user.is_active):
        login_throttle.fail(key)
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Incorrect email or password.")
    login_throttle.clear(key)
    user.last_login = datetime.now(timezone.utc)
    db.commit()
    return TokenOut(access_token=create_token(user.id), user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
def me(user: CurrentUser):
    return user


@router.post("/me/password", status_code=status.HTTP_204_NO_CONTENT)
def change_password(payload: PasswordChange, db: DB, user: CurrentUser):
    if not verify_password(payload.current_password, user.password_hash):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Your current password is incorrect.")
    problem = password_problem(payload.new_password)
    if problem:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, problem)
    user.password_hash = hash_password(payload.new_password)
    db.commit()

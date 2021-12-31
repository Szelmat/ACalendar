from datetime import datetime, timedelta
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional

from sqlalchemy.sql.expression import distinct
from connect import conn
from models import users, User, events, Event, notifications, Notification, habits, Habit
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
import re

# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "3aad780b630cb7a2d1ffc7d5628c708e580570eae88ae488232650da0e8c447e"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 200

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class UserInDB(User):
    password: str


app = FastAPI()

origins = [
    # the fronted is running on this URI
    # the port 3500 is the default value in case of simple-server
    "http://127.0.0.1:3500",
    "http://localhost:3500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RegisterCredentials(BaseModel):
    email: str
    password: str
    confirm_password: str


class LoginCredentials(BaseModel):
    username: str
    password: str


class EventForm(BaseModel):
    user_id: str
    color_id: str
    title: str
    description: str
    start_time: str
    end_time: str
    created_at: str

class EventUpdateForm(BaseModel):
    id: str
    user_id: str
    color_id: str
    title: str
    description: str
    start_time: str
    end_time: str

# For the email validation
regex = '^[a-z0-9]+[\._]?[ a-z0-9]+[@]\w+[. ]\w{2,3}$'


def check(email):
    if(re.search(regex, email)):
        return False
    else:
        return True


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def get_user(db, email: str):
    if email in db:
        user_dict = db[email]
        return UserInDB(**user_dict)


def authenticate_user(db, email: str, password: str):
    user = get_user(db, email)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_users_as_dict():
    users_list = conn.execute(users.select()).fetchall()
    users_dict = {}
    for user in users_list:
        name = user[1]
        users_dict[name] = {
            "id": user[0],
            "email": name,
            "password": user[2]
        }
    return users_dict


# Show all the data of a given id's user


@app.get("/api/users/{id}")
async def read_user_data(id: int):
    return conn.execute(users.select().where(users.c.id == id)).fetchall()

# Update the password of a given id's user


@app.put("/api/users/{id}")
async def update_password(id: int, user: User):
    conn.execute(users.update().values(
        password=get_password_hash(user.password)
    ).where(users.c.id == id))
    return conn.execute(users.select()).fetchall()

# Show all the events of a given id's user


@app.get("/api/users/{id}/events")
async def read_user_events(id: int):
    return conn.execute(events.select().where(events.c.user_id == id).order_by(events.c.start_time)).fetchall()

# Add a new event for a given id's user


@app.post("/api/users/{id}/events")
async def add_user_event(event: EventForm):
    conn.execute(events.insert().values(
        user_id=event.user_id,
        color_id=event.color_id,
        title=event.title,
        description=event.description,
        start_time=event.start_time,
        end_time=event.end_time,
        created_at=event.created_at
    ))
    return conn.execute(events.select().where(events.c.user_id == id).order_by(events.c.start_time)).fetchall()

# Show a given event of a given id's user


@app.get("/api/users/{user_id}/events/{event_id}")
async def read_particular_user_event(user_id: int, event_id: int):
    return conn.execute(events.select().where(events.c.user_id == user_id).where(events.c.id == event_id)).fetchall()

# Update a given event of a given id's user


@app.put("/api/users/{user_id}/events/{event_id}")
async def update_particular_user_event(event: EventUpdateForm):
    conn.execute(events.update().values(
        color_id = event.color_id,
        title = event.title,
        description = event.description,
        start_time = event.start_time,
        end_time = event.end_time,
    ).where(events.c.user_id == event.user_id).where(events.c.id == event.id))
    return conn.execute(events.select().where(events.c.user_id == event.user_id).where(events.c.id == event.id)).fetchall()

# Get a certain user's certain event's all notifications


@app.get("/api/users/{user_id}/events/{event_id}/notifications")
async def read_particular_user_event_notifications(user_id: int, event_id: int):
    return conn.execute(notifications.select().distinct().where(notifications.c.event_id == event_id).join(events, events.c.user_id == user_id).order_by(notifications.c.trigger_time)).fetchall()

# Delete a certain user's certain event's all notifications


@app.delete("/api/users/{user_id}/events/{event_id}/notifications")
async def delete_particular_user_event_notifications(user_id: int, event_id: int):
    conn.execute(notifications.delete().where(
        notifications.c.event_id == event_id))
    return conn.execute(notifications.select().distinct().where(notifications.c.event_id == event_id).join(events, events.c.user_id == user_id).order_by(notifications.c.trigger_time)).fetchall()

# Show all the habits of a given id's user


@app.get("/api/users/{id}/habits")
async def read_user_habits(id: int):
    return conn.execute(habits.select().where(habits.c.user_id == id).order_by(habits.c.day_of_the_week)).fetchall()

# Add a new habit for a given id's user


@app.post("/api/users/{id}/habits")
async def add_user_habit(habit: Habit):
    conn.execute(habits.insert().values(
        user_id=habit.user_id,
        color_id=habit.color_id,
        title=habit.title,
        description=habit.description,
        day_of_the_week=habit.day_of_the_week
    ))
    return conn.execute(habits.select().where(habits.c.user_id == Habit.user_id).order_by(habits.c.day_of_the_week)).fetchall()

# Show a given habit of a given id's user


@app.get("/api/users/{user_id}/habits/{habit_id}")
async def read_particular_user_habit(user_id: int, habit_id: int):
    return conn.execute(habits.select().where(habits.c.user_id == user_id).where(habits.c.id == habit_id)).fetchall()

# Update a habit of a given id's user


@app.put("/api/users/{user_id}/habits/{habit_id}")
async def update_habit(habit: Habit):
    conn.execute(habits.update().values(
        color_id=habit.color_id,
        title=habit.title,
        description=habit.description,
        day_of_the_week=habit.day_of_the_week
    ).where(habits.c.user_id == habit.user_id).where(habits.c.id == habit.id))
    return conn.execute(habits.select().where(habits.c.user_id == habit.user_id).where(habits.c.id == habit.id)).fetchall()


# Register a new user
@app.post("/api/register")
async def register_user(user: RegisterCredentials):
    if check(user.email):
        return {
            "message": "Invalid Email!"
        }
    registered = conn.execute(users.select()).fetchall()
    for i in range(len(registered)):
        if registered[i][1] == user.email:
            return {
                "message": "They have already registered with this email!"
            }
    if (user.password != user.confirm_password):
        return {
            "message": "The passwords you entered are not the same!"
        }
    if(user.password == "" or user.confirm_password == ""):
        return {
            "message": "The password fields can not be empty!"
        }
    if re.fullmatch(r'[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]{8,64}', user.password):
        conn.execute(users.insert().values(
            email=user.email,
            password=get_password_hash(user.password),
        ))
    else:
        return {
            "message": "The password must contain english letters, optional numbers, and/or special characters!"
        }
    return {"message": "Successful registration!"}


# Login with a given user


@app.post("/api/login", response_model=Token)
async def login_for_access_token(form_data: LoginCredentials):
    user = authenticate_user(
        get_users_as_dict(), form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # the cookie's (where the jwt will be stored) expiration date/time will the same as the jwt's (ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        # the elements of data dictionary are critical, if there is some modification in that then the frontend must be modified as well.
        data={"email": user.email, "uid": user.id}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


# Show a given date's events of a given id's user


@app.get("/api/users/{id}/events/{frdate}/{todate}/")
async def read_user_date_events(id: int,  frdate: str, todate: str):
    return conn.execute(events.select().where(events.c.user_id == id).where(events.c.start_time >= frdate).where(events.c.start_time < todate).order_by(events.c.start_time)).fetchall()

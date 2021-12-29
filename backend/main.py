from datetime import datetime, timedelta
from fastapi import FastAPI
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
    username: Optional[str] = None


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
    email_reg: str
    password_reg: str
    conf_password_reg: str

class LoginCredentials(BaseModel):
    email_log: str
    password_log: str


#For the email validation
regex = '^[a-z0-9]+[\._]?[ a-z0-9]+[@]\w+[. ]\w{2,3}$'
def check(email):
    if(re.search(regex,email)):
        return False
    else:
        return True


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def check(email):
    if(re.search(regex, email)):
        return False
    else:
        return True

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


#Show all the data of a given id's user
@app.get("/api/users/{id}")
async def read_user_data(id: int):
    return conn.execute(users.select().where(users.c.id == id)).fetchall()

# Update the password of a given id's user
@app.put("/api/users/{id}")
async def update_password(id: int, user: User):
    conn.execute(users.update().values(
        password = get_password_hash(user.password)
    ).where(users.c.id == id))
    return conn.execute(users.select()).fetchall()

# Show all the events of a given id's user
@app.get("/api/users/{id}/events")
async def read_user_events(id: int):
    return conn.execute(events.select().where(events.c.user_id == id)).fetchall()

# Add a new event for a given id's user
@app.post("/api/users/{id}/events")
async def add_user_event(event: Event):
    conn.execute(events.insert().values(
        id=event.id,
        user_id=event.user_id,
        color_id=event.color_id,
        title=event.title,
        description=event.description,
        start_time=event.start_time,
        end_time=event.end_time,
        created_at=event.created_at
    ))
    return conn.execute(events.select()).fetchall()

# Show a given event of a given id's user
@app.get("/api/users/{user_id}/events/{event_id}")
async def read_particular_user_event(user_id: int, event_id: int):
    return conn.execute(events.select().where(events.c.user_id == user_id).where(events.c.id == event_id)).fetchall()

# Update a given event of a given id's user
@app.put("/api/users/{user_id}/events/{event_id}")
async def update_particular_user_event(user_id: int, event_id: int, event: Event):
    conn.execute(events.update().values(
        description=event.description
    ).where(events.c.user_id == user_id).where(events.c.id == event_id))
    return conn.execute(events.select().where(events.c.user_id == user_id).where(events.c.id == event_id)).fetchall()

# Get a certain user's certain event's all notifications
@app.get("/api/users/{user_id}/events/{event_id}/notifications")
async def read_particular_user_event_notifications(user_id: int, event_id: int):
    return conn.execute(notifications.select().distinct().where(notifications.c.event_id == event_id).join(events, events.c.user_id == user_id)).fetchall()

# Delete a certain user's certain event's all notifications
@app.delete("/api/users/{user_id}/events/{event_id}/notifications")
async def delete_particular_user_event_notifications(user_id: int, event_id: int):
    conn.execute(notifications.delete().where(
        notifications.c.event_id == event_id))
    return conn.execute(notifications.select().distinct().where(notifications.c.event_id == event_id).join(events, events.c.user_id == user_id)).fetchall()

# Show all the habits of a given id's user
@app.get("/api/users/{id}/habits")
async def read_user_habits(id: int):
    return conn.execute(habits.select().where(habits.c.user_id == id)).fetchall()

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
    return conn.execute(events.select()).fetchall()

# Show a given habit of a given id's user
@app.get("/api/users/{user_id}/habits/{habit_id}")
async def read_particular_user_habit(user_id: int, habit_id: int):
    return conn.execute(habits.select().where(habits.c.user_id == user_id).where(habits.c.id == habit_id)).fetchall()

# Update a habit of a given id's user
@app.put("/api/users/{user_id}/habits/{habit_id}")
async def update_habit(user_id: int, habit_id: int, habit: Habit):
    conn.execute(habits.update().values(
        color_id=habit.color_id,
        title=habit.title,
        description=habit.description,
        day_of_the_week=habit.day_of_the_week
    ).where(habits.c.user_id == user_id).where(habits.c.id == habit_id))
    return conn.execute(habits.select().where(habits.c.user_id == user_id).where(habits.c.id == habit_id)).fetchall()

#Register a new user
@app.post("/api/register")
async def register_user(user: RegisterCredentials):
    if check(user.email_reg):
        return {
        "message": "Invalid Email!"
        }
    registered = conn.execute(users.select()).fetchall()
    for i in range(len(registered)):
        if registered[i][1] == user.email_reg:
            return {
            "message": "They have already registered with this email!"
            }
    if (user.password_reg != user.conf_password_reg):
        return {
        "message": "The passwords you entered are not the same!"
        }
    if(user.password_reg =="" or user.conf_password_reg ==""):
        return {
        "message": "The password fields can not be empty!"
        }
    #mat = re.search(pat, password_reg)
    if re.fullmatch(r'[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]{8,64}', user.password_reg):
        conn.execute(users.insert().values(
            email = user.email_reg,
            password = user.password_reg,
        ))
    else:
        return {
        "message": "The password must contain english letters, optional numbers, and/or special characters!"
        }
    return {"message": "Successful registration!"}

#Login with a given user
@app.post("/api/login")
async def login_user(user: LoginCredentials):
    if check(user.email_log):
        return {
        "message": "Invalid Email!"
        }
    if(user.password_log ==""):
        return {
        "message": "The password field can not be empty!"
        }
    
    if not re.fullmatch(r'[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]{8,64}', user.password_log):
        return {
        "message": "Invalid password!"
        }
    registered = conn.execute(users.select()).fetchall()
    for i in range(len(registered)):
        if registered[i][1] == user.email_log:
            #print("Valid user!")
            if registered[i][2] == user.password_log:
                return {"message": "Successful login!"}
            else:
                return {
                "message": "Incorrect password!"
                }
    return {
    "message": "They have not registered with this email yet!"
    }
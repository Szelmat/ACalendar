from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional

from sqlalchemy.sql.expression import distinct
from connect import conn
from models import users, User, events, Event, notifications, Notification, habits, Habit



app = FastAPI()

origins = [
    # the fronted is running on this URI
    # the port 3500 is the default value in case of simple-server
    "http://127.0.0.1:3500",
    "http://localhost:3500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)


#Show all the data of a given id's user
@app.get("/api/users/{id}")
async def read_user_data(id: int):
    return conn.execute(users.select().where(users.c.id == id)).fetchall()

#Update the password of a given id's user
@app.put("/api/users/{id}")
async def update_password(id: int, user: User):
    conn.execute(users.update().values(
        password = user.password
    ).where(users.c.id == id))
    return conn.execute(users.select()).fetchall()

#Show all the events of a given id's user
@app.get("/api/users/{id}/events")
async def read_user_events(id: int):
    return conn.execute(events.select().where(events.c.user_id == id)).fetchall()

#Add a new event for a given id's user
@app.post("/api/users/{id}/events")
async def add_user_event(event: Event):
    conn.execute(events.insert().values(
        id = event.id,
        user_id = event.user_id,
        color_id = event.color_id,
        title = event.title,
        description = event.description,
        start_time = event.start_time,
        end_time = event.end_time,
        created_at = event.created_at
    ))
    return conn.execute(events.select()).fetchall()

#Show a given event of a given id's user
@app.get("/api/users/{user_id}/events/{event_id}")
async def read_particular_user_event(user_id: int, event_id: int):
    return conn.execute(events.select().where(events.c.user_id == user_id).where(events.c.id == event_id)).fetchall()


#Update a given event of a given id's user
@app.put("/api/users/{user_id}/events/{event_id}")
async def update_particular_user_event(user_id: int, event_id: int, event: Event):
    conn.execute(events.update().values(
        description = event.description
    ).where(events.c.user_id == user_id).where(events.c.id == event_id))
    return conn.execute(events.select().where(events.c.user_id == user_id).where(events.c.id == event_id)).fetchall()

#Get a certain user's certain event's all notifications
@app.get("/api/users/{user_id}/events/{event_id}/notifications")
async def read_particular_user_event_notifications(user_id: int, event_id: int):
    return conn.execute(notifications.select().distinct().where(notifications.c.event_id == event_id).join(events, events.c.user_id == user_id)).fetchall()
    #return conn.execute(events.select().where(events.c.user_id == user_id).where(events.c.id == event_id).join(notifications, events.c.id == notifications.c.event_id)).fetchall()

#Delete a certain user's certain event's all notifications
@app.delete("/api/users/{user_id}/events/{event_id}/notifications")
async def delete_particular_user_event_notifications(user_id: int, event_id: int):
    conn.execute(notifications.delete().where(notifications.c.event_id == event_id))
    return conn.execute(notifications.select().distinct().where(notifications.c.event_id == event_id).join(events, events.c.user_id == user_id)).fetchall()

#Show all the habits of a given id's user
@app.get("/api/users/{id}/habits")
async def read_user_habits(id: int):
    return conn.execute(habits.select().where(habits.c.user_id == id)).fetchall()

#Add a new habit for a given id's user
@app.post("/api/users/{id}/habits")
async def add_user_habit(habit: Habit):
    conn.execute(habits.insert().values(
        user_id = habit.user_id,
        color_id = habit.color_id,
        title = habit.title,
        description = habit.description,
        day_of_the_week = habit.day_of_the_week
    ))
    return conn.execute(events.select()).fetchall()

#Show a given habit of a given id's user
@app.get("/api/users/{user_id}/habits/{habit_id}")
async def read_particular_user_habit(user_id: int, habit_id: int):
    return conn.execute(habits.select().where(habits.c.user_id == user_id).where(habits.c.id == habit_id)).fetchall()


#Update a habit of a given id's user
@app.put("/api/users/{user_id}/habits/{habit_id}")
async def update_habit(user_id: int, habit_id: int, habit: Habit):
    conn.execute(habits.update().values(
        color_id = habit.color_id,
        title = habit.title,
        description = habit.description,
        day_of_the_week = habit.day_of_the_week
    ).where(habits.c.user_id == user_id).where(habits.c.id == habit_id))
    return conn.execute(habits.select().where(habits.c.user_id == user_id).where(habits.c.id == habit_id)).fetchall()


'''
#Show all data from the users table
@app.get("/")
async def read_data():
    return conn.execute(users.select()).fetchall()





#asd
class LoginCredentials(BaseModel):
    # this has to be the same name (and type (?)) as it's in the ajax request's body
    email: EmailStr
    password: str

class RegisterCredentials(BaseModel):
    # this has to be the same name (and type (?)) as it's in the ajax request's body
    email: EmailStr
    password: str
    confirm_password: str


@app.get("/")
async def root():
    return {
        "message": "Hello Guys"
    }

@app.post("/api/login")
async def user_login(loginCredentials: LoginCredentials):
    #User login with the credentials given by AJAX request.

    print("login credentials:", loginCredentials)
    # check, validate, etc..

    # template/example return value
    if True:
        return "okay"
    else:
        return "not okay (invalid email and/or password)"


@app.post("/api/register")
async def user_register(registerCredentials: RegisterCredentials):
    # User register with the credentials given by AJAX request.
    print("register credentials:", registerCredentials)
    # check, validate, etc..

    # template/example return value
    if True:
        return "okay"
    else:
        return "not okay (invalid email and/or password)"






# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: Optional[str] = None):
#     return {"item_id": item_id, "q": q}

'''
from connect import conn
from models import users, User, events, Event, notifications, Notification, habits, Habit

class UserInDB(User):
    password: str

def get_user(db, email: str):
    if email in db:
        user_dict = db[email]
        return UserInDB(**user_dict)



print(get_user(get_users_as_dict(), 'test@test.com'))

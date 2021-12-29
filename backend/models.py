import datetime
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy import Table, MetaData, Column, ForeignKey, Integer, String, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql.expression import null
from sqlalchemy.sql.sqltypes import SmallInteger
from connect import meta
from pydantic import BaseModel

users = Table(
    'users',meta,
    Column('id',Integer, primary_key=True, index=True),
    Column('email',String(255), unique=True, index=True),
    Column('password',String(255))
)

class User(BaseModel):
    id: str
    email: str
    password: str


events = Table(
    'events',meta,
    Column('id',Integer, primary_key=True, index=True),
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('color_id', SmallInteger, ForeignKey('colors.id')),
    Column('title',String(255)),
    Column('description',Text(16383), nullable=True),
    Column('start_time',DateTime),
    Column('end_time',DateTime),
    Column('created_at',DateTime, default=datetime.datetime.utcnow()),
)

class Event(BaseModel):
    id: str
    user_id: str
    color_id: str
    title: str
    description: str
    start_time: str
    end_time: str
    created_at: str


notifications = Table(
    'notifications',meta,
    Column('id', Integer, primary_key=True, index=True),
    Column('event_id',Integer, ForeignKey('events.id')),
    Column('type_id', SmallInteger, ForeignKey('notification_types.id')),
    Column('trigger_time',DateTime)
)

class Notification(BaseModel):
    id: str
    event_id: str
    type_id: str
    trigger_time: str

notification_types = Table(
    'notification_types',meta,
    Column('id',SmallInteger, primary_key=True),
    Column('name', String(100))
)

class Notification_type(BaseModel):
    id: str
    name: str

habits = Table(
    'habits',meta,
    Column('id',Integer, primary_key=True, index=True),
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('color_id', SmallInteger, ForeignKey('colors.id')),
    Column('title', String(255), nullable=True),
    Column('description',Text(16383)),
    Column('day_of_the_week', SmallInteger)
)

class Habit(BaseModel):
    id: str
    user_id : str
    color_id : str
    title : str
    description: str
    day_of_the_week: str



'''
Base = declarative_base()
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    password = Column(String(255))

class Color(Base):
    id = Column(SmallInteger)
    name = Column(String(100))

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    color_id = Column(SmallInteger, ForeignKey('colors.id'))
    title = Column(String(255))
    description = Column(Text(16383), nullable=True)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    created_at = Column(DateTime, default=datetime.datetime.utcnow())

class Habit(Base):
    __tablename__ = "habits"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    color_id = Column(SmallInteger, ForeignKey('colors.id'))
    title = Column(String(255), nullable=True)
    description = Column(Text(16383))
    day_of_the_week = Column(SmallInteger)

class Notification_type(Base):
    __tablename__ = 'notification_types'

    id  = Column(SmallInteger, primary_key=True)
    name = Column(String(100))
    
class Notification(Base):
    __tablename__ = 'notifications'

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey('events.id'))
    type_id = Column(SmallInteger, ForeignKey('notification_types.id'))
    trigger_time = Column(DateTime)

'''
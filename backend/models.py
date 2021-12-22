import datetime
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy import Table, MetaData, Column, ForeignKey, Integer, String, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql.expression import null
from sqlalchemy.sql.sqltypes import SmallInteger

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
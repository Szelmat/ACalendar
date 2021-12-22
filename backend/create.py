import datetime
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from sqlalchemy import Table, MetaData, Column, ForeignKey, Integer, String, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql.expression import null
from sqlalchemy.sql.sqltypes import SmallInteger

# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer(11), primary_key=True, index=True)
#     email = Column(String(255), unique=True, index=True)
#     password = Column(String(255))

# class Color(Base):
#     id = Column(Integer(1))
#     name = Column(String(100))

# class Event(Base):
#     __tablename__ = "events"

#     id = Column(Integer(11), primary_key=True, index=True)
#     user_id = Column(Integer(11), ForeignKey('users.id'))
#     color_id = Column(Integer(1), ForeignKey('colors.id'))
#     title = Column(String(255))
#     description = Column(String(16383), nullable=True)
#     start_time = Column(DateTime)
#     end_time = Column(DateTime)
#     created_at = Column(DateTime, default=datetime.datetime.utcnow())

# class Habit(Base):
#     __tablename__ = "habits"

#     id = Column(Integer(11), primary_key=True, index=True)
#     user_id = Column(Integer(11), ForeignKey('users.id'))
#     color_id = Column(Integer(1), ForeignKey('colors.id'))
#     title = Column(String(255), nullable=True)
#     description = Column(String(16383))
#     day_of_the_week = Column(Integer(1))

# class Notification_type(Base):
#     __tablename__ = 'notification_types'

#     id  = Column(Integer(1), primary_key=True)
#     name = Column(String(100))
    
# class Notification(Base):
#     __tablename__ = 'notifications'

#     id = Column(Integer(11), primary_key=True, index=True)
#     event_id = Column(Integer(11), ForeignKey('events.id'))
#     type_id = Column(Integer(1), ForeignKey('notification_types.id'))
#     trigger_time = Column(DateTime)




if __name__ == '__main__':
    print('Database creation started')
    file = open('env.txt', 'r')
    URL = file.readline()
    file.close()

    engine = create_engine(
        URL
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()
    metadata_obj = MetaData()

    users = Table(
        'users', metadata_obj, 
        Column('id', Integer, primary_key=True, index=True, nullable=False),
        Column('email', String(255), unique=True, index=True, nullable=False),
        Column('password', String(255), nullable=False)
    )

    colors = Table(
        'colors', metadata_obj,
        Column('id', SmallInteger, nullable=False, primary_key=True, index=True),
        Column('name', String(100), nullable=False)
    )

    events = Table(
        'events', metadata_obj,
        Column('id', Integer, primary_key=True, index=True),
        Column('user_id', Integer, ForeignKey('users.id'), nullable=False),
        Column('color_id', SmallInteger, ForeignKey('colors.id'), nullable=False),
        Column('title', String(255), nullable=False),
        Column('description', Text(16383), nullable=True),
        Column('start_time', DateTime, nullable=False),
        Column('end_time', DateTime, nullable=False),
        Column('created_at', DateTime, default=datetime.datetime.utcnow(), nullable=False)
    )

    habits = Table(
        'habits', metadata_obj,
        Column('id', Integer, primary_key=True, index=True),
        Column('user_id', Integer, ForeignKey('users.id'), nullable=False),
        Column('color_id', SmallInteger, ForeignKey('colors.id'), nullable=False),
        Column('title', String(255), nullable=False),
        Column('description', Text(16383), nullable=True),
        Column('day_of_the_week', SmallInteger, nullable=False)
    )

    notification_types = Table(
        'notification_types', metadata_obj,
        Column('id', SmallInteger, primary_key=True),
        Column('name', String(100), nullable=False)
    )

    notifications = Table(
        'notifications', metadata_obj,
        Column('id', Integer, primary_key=True, index=True),
        Column('event_id', Integer, ForeignKey('events.id'), nullable=False),
        Column('type_id', SmallInteger, ForeignKey('notification_types.id'), nullable=False),
        Column('trigger_time', DateTime, nullable=False)
    )

    print(metadata_obj.tables.keys())

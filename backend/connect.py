from sqlalchemy import create_engine, MetaData

file = open('env.txt', 'r')
URL = file.readline()
file.close()
engine = create_engine(
    URL
)
meta = MetaData()
conn = engine.connect()
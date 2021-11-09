from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

class LoginCredentials(BaseModel):
    # this has to be the same name (and type (?)) as it's in the ajax request's body
    email: str
    password: str

class RegisterCredentials(BaseModel):
    # this has to be the same name (and type (?)) as it's in the ajax request's body
    email: str
    password: str
    confirm_password: str


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

@app.get("/")
async def root():
    return {
        "message": "Hello Guys"
    }

@app.post("/api/login")
async def user_login(loginCredentials: LoginCredentials):
    """ User login with the credentials given by AJAX request. """

    print("login credentials:", loginCredentials)
    # check, validate, etc..

    # template/example return value
    if True:
        return "okay"
    else:
        return "not okay (invalid email and/or password)"


@app.post("/api/register")
async def user_register(registerCredentials: RegisterCredentials):
    """ User register with the credentials given by AJAX request. """
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
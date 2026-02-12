from pydantic import BaseModel, EmailStr, Field


class RegisterSchema(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)


class LoginSchema(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)

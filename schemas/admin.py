from pydantic import BaseModel


class AdminLogin(BaseModel):

    email: str
    senha: str
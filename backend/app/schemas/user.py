from pydantic import BaseModel

class User(BaseModel):
    id: int
    name: str
    contact_info: str
    role: str

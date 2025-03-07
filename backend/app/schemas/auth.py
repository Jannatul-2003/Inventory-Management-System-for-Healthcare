from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    contact_info: str

class UserResponse(BaseModel):
    id: int
    name: str
    contact_info: str
    role: str

class LoginResponse(BaseModel):
    user: UserResponse
    token: str


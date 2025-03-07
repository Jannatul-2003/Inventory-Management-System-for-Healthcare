import secrets
from app.repositories.user_repo import UserRepository

class AuthService:
    def __init__(self):
        self.user_repo = UserRepository()
    
    def login(self, username: str, contact_info: str):
        """
        Authenticate a user with username and contact information
        """
        user = self.user_repo.get_user_by_credentials(username, contact_info)
        print("User found:", user)  # Debugging output
        if not user:
            return None
        
        # Generate a simple token (in a real app, use JWT or similar)
        token = secrets.token_hex(16)
        
        return {
            "user": user,
            "token": token
        }


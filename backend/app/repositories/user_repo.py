# from app.schemas.user import User
# from app.config.database import get_db_connection

# class UserRepository:
#     def get_user_by_credentials(self, username: str, contact_info: str):
#         """
#         Get a user by username and contact information
#         """
#         conn = get_db_connection()
#         try:
#             cursor = conn.cursor()
#             cursor.execute(
#                 """
#                 SELECT id, name, contact_info, role
#                 FROM users
#                 WHERE name = %s AND contact_info = %s
#                 """,
#                 (username, contact_info)
#             )
#             user = cursor.fetchone()
#             cursor.close()
            
#             if user:
#                 return {
#                     "id": user[0],
#                     "name": user[1],
#                     "contact_info": user[2],
#                     "role": user[3]
#                 }
#             return None
#         finally:
#             conn.close()
from app.config.database import get_db_connection

class UserRepository:
    # def get_user_by_credentials(self, username: str, contact_info: str):
    #     """
    #     Get a user by username and contact information
    #     """
    #     try:
    #         with get_db_connection() as conn:
    #             with conn.cursor() as cursor:
    #                 cursor.execute(
    #                     """
    #                     SELECT id, name, contact_info, role
    #                     FROM users
    #                     WHERE LOWER(name) = LOWER(%s) AND LOWER(contact_info) = LOWER(%s)
    #                     """,
    #                     (username.lower, contact_info.lower)
    #                 )
    #                 user = cursor.fetchone()
                    
    #                 if user:
    #                     return {
    #                         "id": user[0],
    #                         "name": user[1],
    #                         "contact_info": user[2],
    #                         "role": user[3]
    #                     }
    #                 return None
    #     except Exception as e:
    #         print(f"Database error: {e}")
    #         return None

    def get_user_by_credentials(self, username: str, contact_info: str):
        try:
            with get_db_connection() as conn:
                with conn.cursor() as cursor:
                    print(f"Searching for user: {username}, {contact_info}")  # Debugging
                    cursor.execute(
                        """
                        SELECT id, name, contact_info, role
                        FROM users
                        WHERE name = %s AND contact_info = %s
                        """,
                        (username, contact_info)
                    )
                    user = cursor.fetchone()
                    print(f"User found: {user}")  # Debugging
                
                    if user:
                        return {
                            "id": user["id"],
                            "name": user["name"],
                            "contact_info": user["contact_info"],
                            "role": user["role"]
                        }
                    return None
        except Exception as e:
            print(f"Database error: {e}")
            return None

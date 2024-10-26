from server.models import User
from server.database import db
from sqlalchemy.exc import IntegrityError
import logging

logger = logging.getLogger(__name__)

class UserService:
    def create_user(self, name, email, password, role, phone_number, is_admin=False):
        try:
            new_user = User(name=name, email=email, role=role, phone_number=phone_number, is_admin=is_admin)
            new_user.set_password(password)
            db.session.add(new_user)
            db.session.commit()
            return True, "User created successfully"
        except IntegrityError as e:
            db.session.rollback()
            if "users.email" in str(e.orig):
                return False, "Email already exists"
            elif "users.phone_number" in str(e.orig):
                return False, "Phone number already exists"
            else:
                logger.error(f"IntegrityError during user creation: {str(e)}")
                return False, "An error occurred while creating the user"
        except Exception as e:
            db.session.rollback()
            logger.error(f"Unexpected error during user creation: {str(e)}")
            return False, "An unexpected error occurred"
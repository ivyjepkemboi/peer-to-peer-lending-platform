from server.models import User
from server.database import db
from server.validators.password_validator import PasswordValidator
from flask_jwt_extended import create_access_token
from datetime import timedelta
from flask_mail import Mail, Message
from flask import url_for


mail = Mail()

class UserService:
    def create_user(self, name, email, password, role, phone_number, is_admin=False):
        # Check if the user already exists
        if User.query.filter_by(email=email).first():
            return False, "Email already exists."

        # Validate the password
        validator = PasswordValidator(password)
        is_valid, validation_message = validator.validate()
        if not is_valid:
            return False, validation_message

        # Create the new user but mark as unverified
        new_user = User(name=name, email=email, role=role, phone_number=phone_number)
        new_user.set_password(password)
        new_user.is_verified = False  # Mark user as unverified
        new_user.is_admin = is_admin  # Set the is_admin flag based on the request

        db.session.add(new_user)
        db.session.commit()

        # Generate email verification token
        verification_token = self.generate_verification_token(new_user.id)
        
        # Send the verification email
        self.send_verification_email(email, verification_token)

        return True, "User created successfully. Please verify your email."

    def generate_verification_token(self, user_id):
        return create_access_token(identity=user_id, expires_delta=timedelta(hours=24)) 
    
    def send_verification_email(self, email, token):
        verification_url = url_for('verifyemailresource', token=token, _external=True)
        subject = "Verify your email"
        body = f"Please click the following link to verify your email: {verification_url}"
        
        msg = Message(subject, recipients=[email], body=body)
        mail.send(msg)
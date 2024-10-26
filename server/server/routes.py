from flask import make_response, request, jsonify, redirect, url_for
from flask_restful import Resource, reqparse
from flask_jwt_extended import create_access_token, decode_token, create_refresh_token, jwt_required, get_jwt_identity
from server.models import User, Loan, Payment, Notification, Message
from server.database import db
from server.services.user_service import UserService
from flask_limiter.util import get_remote_address
from flask_limiter import Limiter
from server.extensions import limiter
from flask_dance.contrib.google import google
from server.decorators import admin_required
from server.services.mpesa_service import MpesaService
from server.utils import is_password_complex, is_valid_email
import uuid
from datetime import datetime
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class SignupResource(Resource):
    def post(self):
        try:
            data = request.get_json()
            name = data.get('name')
            email = data.get('email')
            password = data.get('password')
            role = data.get('role')
            phone_number = data.get('phone_number')
            is_admin = data.get('is_admin', False)

            # Check if all required fields are provided
            if not all([name, email, password, role, phone_number]):
                return {"message": "All fields are required."}, 400

            # Validate email and password
            if not is_valid_email(email):
                return {"message": "Invalid email address."}, 400

            if not is_password_complex(password):
                return {"message": "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character."}, 400

            # Create the user using UserService
            user_service = UserService()
            success, message = user_service.create_user(
                name=name,
                email=email,
                password=password,
                role=role,
                phone_number=phone_number,
                is_admin=is_admin
            )

            # If user creation fails, return error
            if not success:
                logger.error(f"User creation failed: {message}")
                return {"message": message}, 400

            # Fetch the newly created user
            user = User.query.filter_by(email=email).first()

            # Generate JWT access token
            access_token = create_access_token(identity=user.id)

            # Return the access token and user info
            return {
                "access_token": access_token,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "name": user.name,
                    "role": user.role,
                    "phone_number": user.phone_number,
                    "is_admin": user.is_admin
                },
                "message": "Account created successfully"
            }, 201

        except Exception as e:
            logger.exception("An error occurred during user registration")
            return {"message": str(e)}, 500



class LoginResource(Resource):
    decorators = [limiter.limit("5 per minute", key_func=get_remote_address)]

    def post(self):
        try:
            data = request.get_json()
            email = data.get('email')
            password = data.get('password')

            # Find user by email
            user = User.query.filter_by(email=email).first()

            # Check if user exists and password matches
            if not user or not user.check_password(password):
                logger.warning(f"Failed login attempt for email: {email}")
                return {"message": "Invalid credentials"}, 401

            # Generate JWT access and refresh tokens
            access_token = create_access_token(identity=user.id, fresh=True)
            refresh_token = create_refresh_token(identity=user.id)

            # Return tokens and user details
            return {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "is_admin": user.is_admin,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "name": user.name,
                    "role": user.role
                },
                "message": "Logged in successfully"
            }, 200

        except Exception as e:
            logger.exception("An error occurred during user login")
            return {"message": str(e)}, 500
        


        
class AdminUsersResource(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if not current_user or not current_user.is_admin:
            return {"message": "Unauthorized access"}, 403

        users = User.query.all()
        user_list = [{
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "phone_number": user.phone_number,
            "created_at": user.created_at.isoformat(),
            "is_admin": user.is_admin,
            "is_verified": user.is_verified
        } for user in users]

        return {"users": user_list}, 200

class VerifyEmailResource(Resource):
    def get(self, token):
        try:
            decoded_token = decode_token(token)
            user_id = decoded_token['sub']  # Get user ID from the token
        except Exception as e:
            logger.error(f"Token decoding failed: {str(e)}")
            return {"message": "Invalid or expired token"}, 400

        user = User.query.get(user_id)
        if not user:
            logger.warning(f"User not found for ID: {user_id}")
            return {"message": "User not found"}, 404

        user.is_verified = True  # Mark the user as verified
        db.session.commit()

        logger.info(f"Email verified successfully for user ID: {user_id}")
        return {"message": "Email verified successfully"}, 200

class TokenRefreshResource(Resource):
    @jwt_required(refresh=True)
    def post(self):
        try:
            current_user = get_jwt_identity()
            new_token = create_access_token(identity=current_user, fresh=False)
            return {'access_token': new_token}, 200
        except Exception as e:
            logger.exception("An error occurred during token refresh")
            return {"message": str(e)}, 500

class GoogleLoginResource(Resource):
    def get(self):
        if not google.authorized:
            return redirect(url_for("google.login"))

        resp = google.get("/oauth2/v1/userinfo")
        if not resp.ok:
            return jsonify({"message": "Failed to fetch user info from Google"}), 400

        user_info = resp.json()
        email = user_info["email"]
        name = user_info.get("name", "")

        user = User.query.filter_by(email=email).first()

        if user:
            access_token = create_access_token(identity=user.id)
        else:
            new_user = User(name=name, email=email, is_verified=True)
            db.session.add(new_user)
            db.session.commit()
            access_token = create_access_token(identity=new_user.id)

        return redirect(url_for("homepage"))

class HomePageResource(Resource):
    def get(self):
        return jsonify({"message": "Welcome to the Homepage!"})

class LoanCreationResource(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        borrower_id = get_jwt_identity()

        amount = data.get('amount')
        interest_rate = data.get('interest_rate')
        duration_months = data.get('duration_months')

        if not all([amount, interest_rate, duration_months]):
            return {"message": "All loan details are required"}, 400

        outstanding_balance = amount

        new_loan = Loan(
            borrower_id=borrower_id,
            amount=amount,
            interest_rate=interest_rate,
            duration_months=duration_months,
            status='pending',
            outstanding_balance=outstanding_balance
        )

        db.session.add(new_loan)
        db.session.commit()

        return {"message": "Loan request created successfully, awaiting approval"}, 201

class LoanApprovalResource(Resource):
    @jwt_required()
    @admin_required
    def post(self, loan_id):
        try:
            loan = Loan.query.filter_by(id=str(loan_id)).first()

            if not loan:
                return {"message": f"Loan with ID {loan_id} not found"}, 404

            if loan.status != 'pending':
                return {"message": "Loan is not pending, cannot approve"}, 400

            loan.status = 'approved'
            db.session.commit()

            return {"message": f"Loan {loan_id} approved successfully"}, 200

        except Exception as e:
            return {
                "message": "An error occurred while approving the loan",
                "error": str(e)
            }, 500

class BrowseLoansResource(Resource):
    @jwt_required()
    def get(self):
        loans = Loan.query.filter_by(status='pending').all()
        
        if not loans:
            return {"message": "No loans available"}, 404

        loan_list = [{
            "id": loan.id,
            "amount": loan.amount,
            "interest_rate": loan.interest_rate,
            "duration_months": loan.duration_months,
            "borrower_id": loan.borrower_id,
            "status": loan.status
        } for loan in loans]

        return {"loans": loan_list}, 200

class BorrowerProfileResource(Resource):
    @jwt_required()
    def get(self, borrower_id):
        borrower = User.query.get(borrower_id)
        if not borrower:
            return {"message": "Borrower not found"}, 404

        loans = Loan.query.filter_by(borrower_id=borrower.id).all()
        loan_history = [{
            "amount": loan.amount,
            "interest_rate": loan.interest_rate,
            "duration_months": loan.duration_months,
            "status": loan.status
        } for loan in loans]

        profile = {
            "name": borrower.name,
            "email": borrower.email,
            "loan_history": loan_history
        }

        return {"borrower_profile": profile}, 200

class MpesaPaymentResource(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('phone_number', required=True, help='Phone number is required')
        parser.add_argument('amount', required=True, help='Amount is required')
        args = parser.parse_args()

        mpesa_service = MpesaService()
        response = mpesa_service.initiate_stk_push(
            phone_number=args['phone_number'],
            amount=args['amount'],
            callback_url="http://127.0.0.1:5000/mpesa/callback"  
        )

        return response, 200

class MpesaCallbackResource(Resource):
    def post(self):
        data = request.get_json()

        print(data)

        if 'Body' in data and 'stkCallback' in data['Body']:
            callback_data = data['Body']['stkCallback']

            merchant_request_id = callback_data.get('MerchantRequestID')
            checkout_request_id = callback_data.get('CheckoutRequestID')
            result_code = callback_data.get('ResultCode')
            result_desc = callback_data.get('ResultDesc')

            if result_code == 0:
                amount_paid = callback_data['CallbackMetadata']['Item'][0]['Value']
                mpesa_receipt_number = callback_data['CallbackMetadata']['Item'][1]['Value']
                phone_number = callback_data['CallbackMetadata']['Item'][3]['Value']
                
                user = User.query.filter_by(phone_number=phone_number).first()

                if user:
                    loan = Loan.query.filter_by(borrower_id=user.id, is_fully_repaid=False).first()

                    if loan:
                        new_payment = Payment(
                            loan_id=loan.id,
                            amount=amount_paid,
                            mpesa_receipt_number=mpesa_receipt_number,
                            phone_number=phone_number
                        )
                        db.session.add(new_payment)

                        loan.outstanding_balance -= amount_paid
                        if loan.outstanding_balance <= 0:
                            loan.is_fully_repaid = True

                        db.session.commit()

        return jsonify({"ResultCode": 0, "ResultDesc": "The service request was processed successfully"})

class LoanUpdateResource(Resource):
    @jwt_required()
    def patch(self, loan_id):
        loan = Loan.query.get(loan_id)
        
        if not loan:
            return {"message": "Loan not found"}, 404

        data = request.get_json()

        if 'amount' in data:
            loan.amount = data['amount']
        if 'interest_rate' in data:
            loan.interest_rate = data['interest_rate']
        if 'duration_months' in data:
            loan.duration_months = data['duration_months']
        if 'status' in data:
            loan.status = data['status']

        db.session.commit()

        return {"message": "Loan updated successfully"}, 200

class UserDeactivateResource(Resource):
    @jwt_required()
    @admin_required
    def patch(self, user_id):
        user = User.query.get(user_id)
        
        if not user:
            return {"message": "User not found"}, 404

        data = request.get_json()

        if 'is_active' in data:
            user.is_active = data['is_active']

        db.session.commit()

        return {"message": "User status updated successfully"}, 200

class LoanDeactivateResource(Resource):
    @jwt_required()
    @admin_required
    def patch(self, loan_id):
        loan = Loan.query.get(loan_id)
        
        if not loan:
            return make_response(jsonify({"message": "Loan not found"}), 404)

        data = request.get_json()

        if 'status' in data and data['status'] == 'inactive':
            loan.status = 'inactive'
        else:
            return make_response(jsonify({"message": "Invalid status, only 'inactive' allowed"}), 400)

        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({"message": f"Error updating loan status: {str(e)}"}), 500)

        return make_response(jsonify({"message": "Loan status updated successfully"}), 200)

class LoanRepaymentHistoryResource(Resource):
    @jwt_required()
    def get(self, loan_id):
        loan = Loan.query.get(loan_id)
        
        if not loan:
            return {"message": "Loan not found"}, 404

        payments = Payment.query.filter_by(loan_id=loan.id).all()
        payment_history = [{
            "payment_id": payment.id,
            "amount": payment.amount,
            "payment_date": payment.payment_date,
            "phone_number": payment.phone_number,
            "mpesa_receipt_number": payment.mpesa_receipt_number
        } for payment in payments]

        return {"payments": payment_history}, 200

class UserProfileUpdateResource(Resource):
    @jwt_required()
    def patch(self, user_id):
        user = User.query.get(user_id)
        
        if not user:
            return {"message": "User not found"}, 404

        data = request.get_json()

        if 'email' in data:
            user.email = data['email']
        if 'name' in data:
            user.name = data['name']
        if 'password' in data:
            user.set_password(data['password'])

        db.session.commit()

        return {"message": "User profile updated successfully"}, 200

class GetUsersResource(Resource):
    @jwt_required()
    def get(self):
        users = User.query.all()

        user_list = [{
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "phone_number": user.phone_number,
            "outstanding_balance": sum([loan.outstanding_balance for loan in user.loans_borrowed]) if user.role == "borrower" else None,
            "amount_lended": sum([loan.amount for loan in user.loans_lent]) if user.role == "lender" else None,
            "is_admin": user.is_admin,
            "is_verified": user.is_verified
        } for user in users]

        return {"users": user_list}, 200

# Endpoint to get a specific user by ID
class GetUserByIdResource(Resource):
    @jwt_required()
    def get(self, user_id):
        user = User.query.get(user_id)
        
        if not user:
            return {"message": "User not found"}, 404

        user_data = {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "phone_number": user.phone_number,
            "outstanding_balance": sum([loan.outstanding_balance for loan in user.loans_borrowed]) if user.role == "borrower" else None,
            "amount_lended": sum([loan.amount for loan in user.loans_lent]) if user.role == "lender" else None,
            "is_admin": user.is_admin,
            "is_verified": user.is_verified
        }

        return {"user": user_data}, 200

# Endpoint to get notifications for a user
class UserNotificationsResource(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()  # Get the current logged-in user ID

        # Fetch the user's notifications
        user = User.query.get(current_user)
        
        if not user:
            return {"message": "User not found"}, 404

        # Convert datetime to ISO format for JSON serialization
        notifications = [{
            "id": notification.id,
            "message": notification.message,
            "created_at": notification.created_at.isoformat(),  # Convert datetime to string
            "is_read": notification.is_read
        } for notification in user.notifications]

        return {"notifications": notifications}, 200

# Endpoint to mark a notification as read
class MarkNotificationAsReadResource(Resource):
    @jwt_required()
    def patch(self, notification_id):
        user_id = get_jwt_identity()
        notification = Notification.query.filter_by(id=notification_id, user_id=user_id).first()

        if not notification:
            return {"message": "Notification not found"}, 404

        notification.is_read = True
        db.session.commit()

        return {"message": "Notification marked as read"}, 200

# Endpoint to send a message between users
class SendMessageResource(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        user_id = get_jwt_identity()
        recipient_id = data.get("recipient_id")
        content = data.get("content")

        if not all([recipient_id, content]):
            return {"message": "Recipient and content are required"}, 400

        # Create a new message
        new_message = Message(
            user_id=recipient_id,
            sender_id=user_id,
            content=content
        )

        db.session.add(new_message)
        db.session.commit()

        return {"message": "Message sent successfully"}, 201

# Endpoint to get all messages for a user
class UserMessagesResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()

        # Fetch messages where the user is either the sender or receiver
        sent_messages = Message.query.filter_by(sender_id=user_id).all()
        received_messages = Message.query.filter_by(receiver_id=user_id).all()

        # Format sent messages
        sent_message_list = [{
            "id": message.id,
            "sender_id": message.sender_id,
            "receiver_id": message.receiver_id,
            "content": message.content,
            "created_at": message.created_at.isoformat()  # Convert datetime to ISO string
        } for message in sent_messages]

        # Format received messages
        received_message_list = [{
            "id": message.id,
            "sender_id": message.sender_id,
            "receiver_id": message.receiver_id,
            "content": message.content,
            "created_at": message.created_at.isoformat()  # Convert datetime to ISO string
        } for message in received_messages]

        # Combine sent and received messages
        messages = {
            "sent_messages": sent_message_list,
            "received_messages": received_message_list
        }

        return {"messages": messages}, 200
class CreateAdminResource(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        name = data.get('name', 'Admin User')

        if not email or not password:
            return {"message": "Email and password are required"}, 400

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return {"message": "User with this email already exists"}, 400

        new_admin = User(
            name=name,
            email=email,
            role='lender',  # Use 'lender' as the role for admin
            phone_number='0000000000',  # You might want to make this customizable
            is_admin=True
        )
        new_admin.set_password(password)

        db.session.add(new_admin)
        db.session.commit()

        return {"message": "Admin user created successfully"}, 201

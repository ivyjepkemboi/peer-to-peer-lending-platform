from flask import Flask
from flask_restful import Api
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager 
from server.config import Config
from flask_mail import Mail
from server.database import db, bcrypt
from server.routes import UserProfileUpdateResource, LoanRepaymentHistoryResource, LoanDeactivateResource,UserDeactivateResource, LoanUpdateResource,SignupResource, LoginResource, VerifyEmailResource, TokenRefreshResource, GoogleLoginResource, HomePageResource, LoanApprovalResource, LoanCreationResource, BrowseLoansResource, BorrowerProfileResource, MpesaPaymentResource, MpesaCallbackResource, GetUsersResource, GetUserByIdResource, UserNotificationsResource, MarkNotificationAsReadResource, SendMessageResource, UserMessagesResource
from server.routes import (
    UserProfileUpdateResource, LoanRepaymentHistoryResource, LoanDeactivateResource,
    UserDeactivateResource, LoanUpdateResource, SignupResource, LoginResource,
    VerifyEmailResource, TokenRefreshResource, GoogleLoginResource, HomePageResource,
    LoanApprovalResource, LoanCreationResource, BrowseLoansResource,
    BorrowerProfileResource, MpesaPaymentResource, MpesaCallbackResource,
    AdminUsersResource, CreateAdminResource  # Add this line to import AdminUsersResource
)
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from server.extensions import limiter
from flask_dance.contrib.google import make_google_blueprint
from flask import redirect, url_for
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()  # This line loads the environment variables from .env file

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.config.from_object(Config)

google_bp = make_google_blueprint(
    client_id=app.config["GOOGLE_OAUTH_CLIENT_ID"],
    client_secret=app.config["GOOGLE_OAUTH_CLIENT_SECRET"],
    redirect_to="homepage" 
)
app.register_blueprint(google_bp, url_prefix="/login")

limiter.init_app(app)
mail = Mail(app)

db.init_app(app)
bcrypt.init_app(app)

# Set up Flask-Migrate
migrate = Migrate(app, db)

jwt = JWTManager(app)

api = Api(app)

# Add resources
api.add_resource(SignupResource, '/signup')
api.add_resource(LoginResource, '/login')
api.add_resource(VerifyEmailResource, '/verify-email/<string:token>')
api.add_resource(TokenRefreshResource, '/refresh-token')
api.add_resource(GoogleLoginResource, '/login/google')
api.add_resource(HomePageResource, '/', endpoint='homepage')
api.add_resource(LoanCreationResource, '/loans')
api.add_resource(LoanApprovalResource, '/loans/approve/<string:loan_id>')
api.add_resource(BrowseLoansResource, '/loans/browse')
api.add_resource(BorrowerProfileResource, '/borrower/<string:borrower_id>')
api.add_resource(MpesaPaymentResource, '/mpesa/payment')
api.add_resource(MpesaCallbackResource, '/mpesa/callback')
api.add_resource(LoanUpdateResource, '/loans/<string:loan_id>')
api.add_resource(UserDeactivateResource, '/users/<string:user_id>/deactivate')
api.add_resource(LoanRepaymentHistoryResource, '/loans/<string:loan_id>/payments')
api.add_resource(LoanDeactivateResource, '/loans/<string:loan_id>/deactivate')
api.add_resource(UserProfileUpdateResource, '/users/<string:user_id>')
api.add_resource(GetUsersResource, '/users')
api.add_resource(GetUserByIdResource, '/users/<string:user_id>')
api.add_resource(UserNotificationsResource, '/users/notifications')
api.add_resource(MarkNotificationAsReadResource, '/users/notifications/<string:notification_id>/read')
api.add_resource(SendMessageResource, '/users/messages/send')
api.add_resource(UserMessagesResource, '/users/messages')



api.add_resource(AdminUsersResource, '/admin/users')
api.add_resource(CreateAdminResource, '/create-admin')

if __name__ == '__main__':
    app.run(debug=True)
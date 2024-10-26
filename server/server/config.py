import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a_very_secure_secret_key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///p2p_lending.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'your_jwt_secret_key'  

    MAIL_SERVER = 'smtp.gmail.com'  
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = 'danpersie53@gmail.com'
    MAIL_PASSWORD = 'akmu wbdw cqxq dfij'
    MAIL_DEFAULT_SENDER = 'danpersie53@gmail.com'
    
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)  # Access token expires in 15 minutes
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)  

    GOOGLE_OAUTH_CLIENT_ID = os.environ.get('GOOGLE_OAUTH_CLIENT_ID')
    GOOGLE_OAUTH_CLIENT_SECRET = os.environ.get('GOOGLE_OAUTH_CLIENT_SECRET')

#9694949

#Nanya Supplies Limited


# export GOOGLE_OAUTH_CLIENT_ID=23522690168-ou3t4vf9o09s80d76knbi621h9ta756i.apps.googleusercontent.com
# export GOOGLE_OAUTH_CLIENT_SECRET=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
# export OAUTHLIB_INSECURE_TRANSPORT=1

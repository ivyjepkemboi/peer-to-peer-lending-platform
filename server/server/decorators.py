from functools import wraps
from flask_jwt_extended import get_jwt_identity
from flask import jsonify, make_response
from server.models import User
from server.database import db

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if user and user.is_admin:
            return fn(*args, **kwargs)
        else:
            return {"message": "Admin access required"}, 403
    return wrapper

from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask import request

def get_client_ip():
    if request.headers.get('X-Forwarded-For'):
        return request.headers.get('X-Forwarded-For').split(',')[0].strip()
    return request.remote_addr or "127.0.0.1"
from flask_cors import CORS
from flask_mail import Mail
from flask_socketio import SocketIO

bcrypt = Bcrypt()
jwt = JWTManager()
cors = CORS()
mail = Mail()
socketio = SocketIO()

# Initialize limiter
limiter = Limiter(
    key_func=get_client_ip,
    default_limits=["5000 per day", "1000 per hour"]
)

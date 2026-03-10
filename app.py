from flask import Flask
from flask_jwt_extended import JWTManager
from config import JWT_SECRET_KEY
from routes.event_routes import events_bp

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = JWT_SECRET_KEY

jwt = JWTManager(app)

app.register_blueprint(events_bp)

if __name__ == '__main__':
    app.run(debug=True)

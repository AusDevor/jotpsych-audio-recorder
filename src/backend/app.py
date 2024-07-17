from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS

import os

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
    app.config['SECRET_KEY'] = 'secret123'
    app.config['JWT_SECRET_KEY'] = 'secret1234'

    CORS(
        app,
        resources={r"*": {"origins": ["*"]}},
        allow_headers=["Authorization", "Content-Type", "app-version"],
        methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"],
        supports_credentials=True
    )

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    with app.app_context():
        db.create_all()

    @app.after_request
    def add_security_headers(response):
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        return response

    @app.route('/')
    def index():
        return jsonify({'status': 200})

    @app.route('/register', methods=['POST'])
    def register():
        data = request.get_json()
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        new_user = User(username=data['username'], password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully'}), 201

    @app.route('/login', methods=['POST'])
    def login():
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        if user and bcrypt.check_password_hash(user.password, data['password']):
            access_token = create_access_token(identity={'username': user.username})
            return jsonify({'token': access_token}), 200
        return jsonify({'message': 'Invalid credentials'}), 401

    @app.route('/user', methods=['GET'])
    @jwt_required()
    def user():
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user['username']).first()
        if user:
            return jsonify({
                'id': user.id,
                'username': user.username,
            }), 200
        return jsonify({'message': 'User not found'}), 404

    @app.route('/upload', methods=['OPTIONS', 'POST'])
    def upload():
        if request.method == 'OPTIONS':
            return _build_cors_preflight_response()
        if request.method == 'POST':
            # Handle file upload
            if 'file' not in request.files:
                return jsonify({'message': 'No file part'}), 400
            file = request.files['file']
            if file.filename == '':
                return jsonify({'message': 'No selected file'}), 400
            # Save the file or process it here
            return jsonify({'message': 'File successfully uploaded'}), 200

    return app

def _build_cors_preflight_response():
    response = jsonify({'message': 'CORS preflight successful'})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Authorization, Content-Type, app-version")
    response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response

def _corsify_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Authorization, Content-Type, app-version")
    response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)

if __name__ == '__main__':
    app = create_app()
    app.run(port=3002, debug=True)
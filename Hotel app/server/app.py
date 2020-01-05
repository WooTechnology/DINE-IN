from flask import Flask, request, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token, create_refresh_token)
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['JWT_SECRET_KEY'] = 'secret'

db = SQLAlchemy(app)
jwt = JWTManager(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(20), nullable=False)
    lastname = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(60), nullable=False)

    def __repr__(self):
        return f"User('{self.firstname}','{self.lastname}', '{self.email}')"


class Food(db.Model):
    id = db.Column(db.Integer, unique=True , primary_key=True)
    name = db.Column(db.String(60), unique=True, nullable=False)
    description = db.Column(db.String(120), nullable=False)
    amount = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"Food('{self.id}', '{self.name}', '{self.description}', '{self.amount}')"


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/register', methods=['POST'])
def register():
    user_data = request.get_json()

    new_user = User(
        firstname=user_data['firstname'],
        lastname=user_data['lastname'],
        email=user_data['email'],
        password=user_data['password']
    )

    if User.query.filter_by(email=new_user.email).first():
        return {"error": "Email address already taken"}

    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=user_data['email'])
    refresh_token = create_refresh_token(identity=user_data['email'])

    return {
       'email': user_data['email'],
       'access_token': access_token,
       'refresh_token': refresh_token
    }


@app.route('/login', methods=['POST'])
def login():
    user_data = request.get_json()
    current_user = User.query.filter_by(email=user_data['email']).first()

    if not current_user:
        return {"error": "User not in DB. Register as a new user"}

    password = user_data['password']
    if current_user.password == password:
        access_token = create_access_token(identity=user_data['email'])
        refresh_token = create_refresh_token(identity=user_data['email'])
        return {
            'email': current_user.email, 
            'access_token': access_token,
            'refresh_token': refresh_token
        }
    else:
        return {'error': 'Wrong credentials'}


@app.route('/menu_create', methods=['POST'])
def menu_create():
    if request.method == 'POST':
        food_data = request.get_json()

        new_food = Food(
            id=food_data["id"],
            name=food_data["name"],
            description=food_data["description"],
            amount=food_data["amount"]
        )

        db.session.add(new_food)
        db.session.commit()

        return 'Done'


@app.route('/menu_update/<idx>', methods=['POST'])
def menu_update(idx):
    if request.method == 'POST':
        food_data = request.get_json()

        data = Food.query.filter_by(id=idx).first()
        data.name = food_data['name']
        data.description = food_data['description']
        data.amount = food_data['amount']
        db.session.commit()

        return 'Done'


@app.route('/menu_delete', methods=['POST'])
def menu_delete():
    if request.method == 'POST':
        food_data = request.get_json()
        
        data = Food.query.filter_by(id=food_data[0]['id']).first()
        db.session.delete(data)
        db.session.commit()

        return 'Done'


@app.route('/menu')
def menu():
    food_list = Food.query.all()
    items = []

    for item in food_list:
        items.append({'id': item.id, 'name': item.name, 'description': item.description, 'amount': item.amount})

    return jsonify({'food_items': items})


if __name__ == "__main__":
    db.create_all()
    app.run(debug=True)

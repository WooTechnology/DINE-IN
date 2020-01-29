from datetime import datetime
from flask import Flask, request, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token, create_refresh_token)
import json
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
        return f"User('{self.id}', '{self.firstname}', '{self.lastname}', '{self.email}', '{self.password}')"


class Customer(db.Model):
    customer_id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(20), nullable=False)
    customer_email = db.Column(db.String(120), nullable=False)
    mobileno = db.Column(db.Integer, nullable=False)
    no_of_guests = db.Column(db.Integer, nullable=False)
    sessionid = db.Column(db.Text, nullable=False)
    tableno = db.Column(db.String(40))
    orders = db.relationship('Order', backref='author', lazy=True)

    def __repr__(self):
        return f"Customer('{self.customer_id}', '{self.customer_name}', '{self.customer_email}', '{self.mobileno}', '{self.no_of_guests}', '{self.tableno}')"


class Order(db.Model):
    orderid = db.Column(db.Integer, unique=True, nullable=False, primary_key=True)
    status = db.Column(db.String(30), nullable=False)
    food = db.Column(db.Text, nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    date_ordered = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    tableno = db.Column(db.String(40),nullable=False)
    sessionid = db.Column(db.Text, db.ForeignKey('customer.sessionid'), nullable=False)

    def __repr__(self):
        return f"Order('{self.orderid}', '{self.status}', '{self.food}', '{self.amount}', '{self.tableno}','{self.date_ordered}','{self.sessionid}')"


class Food(db.Model):
    id = db.Column(db.Integer, unique=True, primary_key=True)
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


@app.route('/customer_details', methods=['GET', 'POST'])
def customer_details():
    if request.method == 'POST':
        user_data = request.get_json()
        
        access_token_customer = create_access_token(identity=user_data['email'])
        refresh_token_customer = create_refresh_token(identity=user_data['email'])

        if Customer.query.filter_by(sessionid=access_token_customer).first():
            return {"error": "Session already taking place on another window"}

        new_user = Customer(
            customer_name=user_data['name'],
            customer_email=user_data['email'],
            mobileno=user_data['mobile'],
            no_of_guests=user_data['guests'],
            sessionid=access_token_customer
        )

        db.session.add(new_user)
        db.session.commit()

        return {
            'email': user_data['email'],
            'customer_access_token': access_token_customer,
            'customer_refresh_token': refresh_token_customer
         }
    else:
        user_data = request.get_json()
        sessid = user_data['sessionid']
        customer = Customer.query.filter_by(sessionid=sessid).first()
        food = customer.orders.order_by(desc(customer.orders.date_ordered)).first()
        print(food)

        return jsonify({'customer_details': food})


@app.route('/add_table/<sessionidx>', methods=['POST'])
def add_table(sessionidx):
    data = request.get_json()
    find_customer = Customer.query.filter_by(sessionid=sessionidx).first()
    find_customer.tableno = data

    db.session.commit()
    
    return 'Done'  


@app.route('/getpayment', methods=['POST'])
def getpayment():
    user_data = request.get_json()
    sessid = user_data['sessionid']
    customer = Customer.query.filter_by(sessionid=sessid).first()
    order = customer.orders[-1]
    food = json.loads(order.food)
    print(type(food))
    tt = {'id': customer.customer_id, 'name': customer.customer_name, 'food': json.dumps(food), 'tableno': customer.tableno, 'amount': order.amount, 'orderid': order.orderid}
    
    return jsonify({'customer_details': tt})


@app.route('/order_delete', methods=['POST'])
def order_delete():
    if request.method == 'POST':
        order_data = request.get_json()
        
        data = Order.query.filter_by(orderid=order_data[0]['orderid']).first()
        db.session.delete(data)
        db.session.commit()

        return 'Done'


@app.route('/order', methods=['GET', 'POST'])
def order_food():
    if request.method == 'GET':
        order_list = Order.query.all()
        items = []

        for item in order_list:
            items.append({'orderid': item.orderid, 'status': item.status, 'food': item.food, 'tableno': item.tableno, 'amount': item.amount, 'datetime': item.date_ordered})

        print(items)

        return jsonify({'order_items': items})
    else:
        order_data = request.get_json()
        sessid = order_data['sessionid']
        customer = Customer.query.filter_by(sessionid=sessid).first()

        data = Order(
            status='Food is being prepared',
            food=order_data['food'],
            amount=order_data['grandtotal'],
            tableno=customer.tableno,
            sessionid=sessid
        )

        db.session.add(data)
        db.session.commit()

        return 'Done'


@app.route('/order_cancel', methods=['POST'])
def order_cancel():
    data = request.get_json()
    sessionidx = data['sessionid']
    order_id = data['orderid']
    order = Order.query.filter_by(sessionid=sessionidx,orderid=order_id).first()
    db.session.delete(order)
    db.session.commit()

    return 'Done'


@app.route('/update_status/<idx>', methods=['GET', 'POST'])
def update_status(idx):
    if request.method == 'POST':
        status_update = request.get_json()
        data = Order.query.filter_by(orderid=idx).first()
        data.status = status_update['status']
        db.session.commit()

        return 'Done' 


if __name__ == "__main__":
    db.create_all()
    app.run(debug=True)

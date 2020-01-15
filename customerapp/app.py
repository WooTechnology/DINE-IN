from flask import Flask, render_template, request, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_wtf import FlaskForm
from wtforms import Form, IntegerField, StringField, TextAreaField, PasswordField, validators


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db' 
# tells the application where our database will be stored

db = SQLAlchemy(app) 
# initialise connection to the database

# session.logged_in = False

# MODELS
class Customers(db.Model):
    """model for one of your table"""
    # __tablename__ = "customers"

     # define your model
        # create a new class which inherits from a basic database model, provided by SQLAlchemy
        # SQLAlchemy also creates a table called user, which it will use to store our User objects.
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    mobile_no = db.Column(db.String(10), nullable=False)
    no_of_guests = db.Column(db.Integer, nullable=False)
    table_no = db.Column(db.Integer, nullable=False)

    def __init__(self,name,email,mobile_no,no_of_guests,table_no):
        super().__init__()
        self.name = name
        self.email = email
        self.mobile_no = mobile_no
        self.no_of_guests = no_of_guests
        self.table_no = table_no

    # defines how to represent our User object as a string. This allows us to do things like print(Customer)
    def __repr__(self):
        return '<Customer %r>' % self.name

class Tables(db.Model):
    table_no = db.Column(db.Integer, primary_key=True)
    QRcode = db.Column(db.String(100), primary_key=True)

    def __init__(self,table_no,QRcode):
        super().__init__()
        self.table_no = table_no
        self.QRcode = QRcode

    # defines how to represent our Menu object as a string. This allows us to do things like print(Menu)
    def __repr__(self):
        return '<Table %r>' % self.table_no


class Menu(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Integer, nullable=False)

    def __init__(self,name,description,price):
        super().__init__()
        self.name = name
        self.description = description
        self.price = price

    # defines how to represent our Menu object as a string. This allows us to do things like print(Menu)
    def __repr__(self):
        return '<Food %r>' % self.name

class Orders(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, nullable=False)
    food = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(100), nullable=False)
    table_no = db.Column(db.Integer, nullable=False)
    total_amount = db.Column(db.Integer, nullable=False)

    def __init__(self,customer_id,food,status,table_no,total_amount):
        super().__init__()
        self.customer_id = customer_id
        self.food = food
        self.status = status
        self.table_no = table_no
        self.total_amount = total_amount

    # defines how to represent our Order object as a string. This allows us to do things like print(Order)
    def __repr__(self):
        return '<Order %r>' % self.status

# FORMS
class CustomerDetailsForm(Form):
    name = StringField('Name', validators=[validators.Length(min=1,max=50),
                                           validators.InputRequired()])
    email = StringField('Email', validators=[validators.Length(min=1,max=50),
                                                # ,message=_(u'Little short for an email address?')), 
                                            #  validators.Email(message=_(u'That\'s not a valid email address.')),
                                            validators.Email(),
                                             validators.InputRequired()])
    mobile_no = IntegerField('Contact Number', validators=[
                                                # validators.Length(min=10,max=10),
                                                # message=_(u'Little short for a mobile number?')),
                                                      validators.InputRequired()])
    no_of_guests = IntegerField('Total number of guests', validators=[
                                                            # validators.NumberRange(min=1, max=5),  
                                                            validators.InputRequired()])
    table_no = IntegerField('Table Number', validators=[validators.NumberRange(min=1, max=50),  
                                                            validators.InputRequired()])                                                       
                                                    

@app.route("/")
def home():
    """render home page of the restaurant with a check-in button"""

    return render_template("home.html")


@app.route("/check-in")
def checkin():
    """render the QR code scan page"""

    return render_template("scanQR.html")


@app.route("/fill-details/<int:table_no>", methods=['GET','POST'])
def fillcustomerdetails(table_no):
    """render page for filling in customer details"""

    session.logged_in = True
    if request.method == 'POST':    # with QR code of the table
        form = CustomerDetailsForm()
        return render_template("fill-details.html", table_no = table_no, session=session)
    else:
        form = CustomerDetailsForm()
        return render_template("fill-details.html", form=form, session=session)


@app.route("/foodmenu", methods=['GET','POST'])
def menu():
    """render restaurant's menu page"""
    
    if request.method == 'POST':    # with customer details 
        form = CustomerDetailsForm(request.form)
        if form.validate():
            name = form.name.data
            email = form.email.data
            mobile_no = form.mobile_no.data
            no_of_guests = form.no_of_guests.data
            table_no = form.table_no.data
            new_customer = Customers(name=name, email=email, mobile_no=mobile_no, no_of_guests=no_of_guests, table_no=table_no)
            print("User created!")
            try:
                print("Trying to add new customer")
                db.session.add(new_customer)
                db.session.commit()
                print("New customer added")
                return redirect(url_for("menu")) # menu is the function name
            except:
                return "There was an issue in adding this customer in our database!"
        else:
            return "Form not valid!"
    else:
        all_food_items = Menu.query.order_by(Menu.id).all()
        return render_template("menu.html", food_items = all_food_items, session=session)


@app.route("/place-order/<int:id>")
def placeorder(id): # id is the "id" of the order being placed through menu.html page
    """render the the order and bill summary page : order.html"""

    # TO DO : add the order details returned by menu.html (maybe json object) to the Orders table


    # TO DO : fetch the details of the concerned order from "Orders" table
    current_order = Orders.query.get_or_404(id)

    return render_template("order.html", session=session, current_order=current_order)


@app.route("/confirm-order/<int:id>")
def confirmorder(id):
    """render the order status page"""
    current_order = Orders.query.get_or_404(id)
    return render_template("order-status.html", session=session, current_order=current_order)


@app.route("/check-out")
def checkout():
    """render the Thankyou page or Payment page"""

    session.logged_in = False
    return render_template("thankyou.html", session=session)


@app.route("/allusers")
def allusers():
    all_users = Customers.query.order_by(Customers.id).all()
    return render_template("all_users.html", all_users = all_users)

if __name__ == "__main__":
    db.create_all()
    app.run(debug=True)



# Commands to create virtual environment
# pip install virtualenv
# virtualenv env

# Command to enter the virtual environment
# source env/bin/activate

# command to create the db :
# python (will open python3 shell)
# from app import db
# db.create_all()
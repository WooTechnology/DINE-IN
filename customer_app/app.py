from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route("/")
def home():
    """render home page of the restaurant with a check-in button"""
    return render_template("home.html")

@app.route("/check-in")
def checkin():
    """render the QR code scan page"""
    return render_template("scanQR.html")

@app.route("/fill-details")
def fillcustomerdetails():
    """render page for filling in customer details"""
    return render_template("fill-details.html")

@app.route("/menu")
def menu():
    """render restaurant's menu page"""
    return render_template("menu.html")

@app.route("/place-order")
def placeorder():
    """render the the order and bill summary page"""
    return render_template("order.html")

@app.route("/confirm-order")
def confirmorder():
    """render the order status page"""
    return render_template("order-status.html")

@app.route("/check-out")
def checkout():
    """render the Thankyou page or Payment page"""
    return render_template("thankyou.html")


if __name__ == "__main__":
    app.run(debug=True)


# Commands to create virtual environment
# pip install virtualenv
# virtualenv env

# Command to enter the virtual environment
# source env/bin/activate


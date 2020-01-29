import React from 'react';
import {Link} from 'react-router-dom';
import Navbar from './Navbar';
import "./forms.css";
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import './customer.css'


export default class Customerform extends React.Component {
       state = {
        name : "",
        email :  "",
        mobileno : 0,
        guests : 0,
        nameError : "",
        emailError : "",
        mobileError : "",
        guestsError : "",
        toggle : false
      };
    

    validate = () => {
        let nameError = "";
        let emailError = "";
        let mobileError = "";
        let guestsError = "";
    
        if (!this.state.name) {
            nameError = "Field Empty!!";
        }
 
        if (!this.state.mobileno) {
            mobileError = "Field Empty!!";
        }

        if (!this.state.email.includes("@")||this.state.email.includes(" ")) {
            emailError = "Invalid Email";
        }

        if (this.state.mobileno.length!==10)
        {
          mobileError="Invalid Mobile Number";
        }

        if(!this.state.guests){
            guestsError  = "Field Empty!!";
        }
    
        if (emailError || nameError || mobileError || guestsError) {
            this.setState({ emailError, nameError, mobileError, guestsError });
            this.toggle=true;
          return false;
        }
    
        return true;
    };

    recieve = async() => {
      const name = this.state.name;
      const email = this.state.email;
      const mobile = this.state.mobileno;
      const guests = this.state.guests;
      const user = {name, email, mobile, guests};
      const isValid = this.validate();
      if(isValid){
        fetch('/customer_details', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(user)
        }).then( res => res.json())
        .then(data=>{
           sessionStorage.setItem('customer_access_token', data.customer_access_token);
          
           sessionStorage.setItem('customer_email', data.email);
    
          if (sessionStorage.getItem("customer_access_token") !== null && sessionStorage.getItem("customer_access_token")!=="undefined") {
            window.location.replace("/scan")
          }
          else{
              alert(data.error)
          }
        }).catch(err => console.log(err));
  
      }
      else{
        console.log("bye")
      }
    };


    render(){
        return (  
          <div className="bg">
           <MuiThemeProvider>
                <div className="cuss">
                <h1 style={{textAlign: "center"}}>Customer Details</h1>
                <TextField
                placeholder="Enter Your Name"
                label="Name"
                value={this.state.name}
                onChange={event => this.setState({ name: event.target.value })}
                error={this.toggle}
                helperText={this.state.nameError}
                variant="outlined"
                fullWidth="true"
                margin="normal"
                />
                <br />
                <TextField
                placeholder="Enter Your Email"
                label="Email"
                value={this.state.email}
                onChange={event => this.setState({ email: event.target.value })}
                error={this.toggle}
                helperText={this.state.emailError}
                variant="outlined"
                margin="normal"
                fullWidth="true"
                />
                <br />
                <TextField
                placeholder="Enter Your MobileNo"
                label="MobileNo"
                value={this.state.mobileno}
                onChange={event => this.setState({ mobileno: event.target.value })}
                error={this.toggle}
                helperText={this.state.mobileError}
                variant="outlined"
                margin="normal"
                fullWidth="true"
                />
                <br />
                <TextField
                placeholder="Enter Number of Guests"
                label="Guests"
                value={this.state.guests}
                onChange={event => this.setState({ guests: event.target.value })}
                error={this.toggle}
                helperText={this.state.guestsError}
                variant="outlined"
                margin="normal"
                fullWidth="true"
                />
                <br />
                <br />
                <button style={{display:"block", width: "100%", padding:" 15px 32px",fontSize:"16px", backgroundColor:'purple', color: "white", pointerEvents: "cursor"}} onClick={this.recieve}>Submit</button>
                <br />
                </div> 
                </MuiThemeProvider>
        </div>
      );
  }
}
import React from 'react';
import {Link} from 'react-router-dom';
import Navbar from './Navbar';
import "./forms.css";
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';


export default class Registerform extends React.Component {
       state = {
        firstname : "",
        lastname : "",
        email :  "",
        password : "",
        firstnameError : "",
        lastnameError : "",
        emailError : "",
        passwordError : "",
        toggle : false
      };
    

    validate = () => {
        let firstnameError = "";
        let lastnameError = "";
        let emailError = "";
        let passwordError = "";
    
        if (!this.state.firstname) {
          firstnameError = "Field Empty!!";
        }
 
        if (!this.state.lastname) {
            lastnameError = "Field Empty!!";
        }

        if (!this.state.email.includes("@")) {
            emailError = "Invalid Email";
        }

        if(!this.state.password){
          passwordError  = "Field Empty!!";
        }
    
        if (emailError || firstnameError || lastnameError || passwordError) {
            this.setState({ emailError, firstnameError, lastnameError, passwordError });
            this.toggle=true;
          return false;
        }
    
        return true;
    };

    recieve = async() => {
      const firstname = this.state.firstname;
      const lastname = this.state.lastname;
      const email = this.state.email;
      const password = this.state.password;
      const user = {firstname , lastname , email , password};
      const isValid = this.validate();
      if(isValid){
        fetch('/register', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(user)
        }).then( res => res.json())
        .then(data=>{
          localStorage.setItem('access_token', data.access_token);
          
          localStorage.setItem('email', data.email);
    
          if (localStorage.getItem("access_token") !== null && localStorage.getItem("access_token")!=="undefined") {
            window.location.replace("/login")
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
          <div>
          <Navbar />
          <MuiThemeProvider>
              <Container >
                   <div>
                    <h1>Register</h1>
                        <TextField
                            placeholder="Enter Your First Name"
                            label="First Name"
                            value={this.state.firstname}
                            onChange={event => this.setState({ firstname: event.target.value })}
                            error={this.toggle}
                            helperText={this.state.firstnameError}
                            variant="outlined"
                            fullWidth="true"
                            margin="normal"
                        />
                        
                        <br />
                        <TextField
                            placeholder="Enter Your Last Name"
                            label="Last Name"
                            value={this.state.lastname}
                            onChange={event => this.setState({ lastname: event.target.value })}
                            error={this.toggle}
                            helperText={this.state.lastnameError}
                            variant="outlined"
                            margin="normal"
                            fullWidth="true"
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
                            type="password"
                            placeholder="Enter Your Password"
                            label="Password"
                            value={this.state.password}
                            onChange={event => this.setState({ password: event.target.value })}
                            error={this.toggle}
                            helperText={this.state.passwordError}
                            variant="outlined"
                            margin="normal"
                            fullWidth="true"
                        />
                        <br />
                        <Link to="/login" >Already a member?</Link>
                        <br/>
                        <br/>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={this.recieve}
                        >Submit
                        </Button>
                      </div>   
                   </Container>
        </MuiThemeProvider>
        </div>
      );
  }
}
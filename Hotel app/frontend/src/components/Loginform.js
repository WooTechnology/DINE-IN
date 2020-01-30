import React from 'react';
import { Link } from 'react-router-dom';
import "./forms.css"
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

export default class Registerform extends React.Component {
       state = {
        email :  "",
        password : "",
        emailError : "",
        passwordError : "",
        toggle : false
      };
    

    validate = () => {
        let emailError = "";
        let passwordError = "";

        if (!this.state.email.includes("@")) {
            emailError = "Invalid Email";
        }

        if(!this.state.password){
          passwordError  = "Field Empty!!";
        }
    
        if (emailError || passwordError) {
            this.setState({ emailError, passwordError });
            this.toggle=true;
          return false;
        }
    
        return true;
    };

    recieve = async() => {
      const email = this.state.email;
      const password = this.state.password;
      const user = { email , password };
      const isValid = this.validate();
      if(isValid){
        fetch('/login', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(user)
        }).then( res => res.json())
        .then(data=>{
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('email', data.email)
    
          if (localStorage.getItem("access_token") !== null && localStorage.getItem("access_token")!=="undefined") {
            window.location.replace("/main")
          }else{
              alert(data.error)
          }
        }).catch(err => console.log(err));;
      }
      else{
        console.log("bye")
      }
    };

    render(){
        const {classes} = this.props;
        return ( 
          <MuiThemeProvider>
              <Container maxWidth="sm" style={{marginTop:200}}>
                   <div>
                    <h1>Login</h1>
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
                        <Link to="/register">New User? Click here to Register</Link>
                        <br />
                        <br />
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={this.recieve}
                        >Submit
                        </Button>
                      </div>   
                   </Container>
        </MuiThemeProvider>
      );
  }
}
import React, { Component } from 'react';
import {BrowserRouter , Route , Switch} from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';
import Registerform  from './components/Registerform';
import Loginform from './components/Loginform';
import Main from './components/Main';
import Menumanagement from './components/Menumanagement';
import Additem from './components/Additem';
import Updateitem from './components/Updateitem';
import {isLoggedIn} from './components/auth';

class App extends Component {
  
  render() {
    return (
          <BrowserRouter>
           <Switch>
            
             <Route exact path="/" component={Registerform} />
             <Route exact path="/login" component={Loginform} />
             <PrivateRoute exact isloggedin={isLoggedIn()} path="/main" component={Main} />
             <PrivateRoute exact path="/menu" component={Menumanagement} />
             <PrivateRoute exact path="/add" component={Additem} />
             <PrivateRoute exact path="/update" component={Updateitem} />
           </Switch>
          </BrowserRouter>
    );
  }
}

export default App;

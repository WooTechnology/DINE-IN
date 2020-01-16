import React from 'react';
import {Route,Redirect } from "react-router-dom";
import {isLoggedInCustomer} from './auth';

export const PrivateRouteCustomer = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
        isLoggedInCustomer() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/customer",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);
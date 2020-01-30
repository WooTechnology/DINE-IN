import React from 'react';
import {Link} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {deleteTokens} from './auth';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const logout = (e) => {
   e.preventDefault();
   deleteTokens();
   window.location.replace('/register');
}

const navlink = () => {
  window.location.replace("/login")
}

export default function Navbar() {

      const classes = useStyles();
      return (
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                Hotel App
              </Typography>
              <Button color="inherit" onClick={navlink}>Login</Button>
              <Button color="inherit" onClick={logout}>Logout</Button>
            </Toolbar>
          </AppBar>
        </div>
      );
  }

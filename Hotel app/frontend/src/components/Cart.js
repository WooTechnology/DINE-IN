import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative',
    backgroundColor: 'black'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  but: {
      margin: "auto"
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



export default function FullScreenDialog(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button  variant="outlined"  onClick={handleClickOpen} style={{display: "block" ,margin: "auto", border: "white", color:"white", fontSize: 12}}>
        Go to Cart
      </Button>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Cart
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          {Object.keys(props.food).map((key,i) => (
          <ListItem >
            <ListItemText primary={props.food[key].name} secondary={props.food[key].price} />
            <RemoveIcon fontSize="large" onClick={() => props.handleRemove(key,i)} />
            <Typography fontSize="large">{props.food[key].quantity}</Typography>
            <AddIcon fontSize="large" onClick={() => props.handleAdd(key,i)} />
          </ListItem>
          ))}
          <Divider />
            <ListItem >
                <ListItemText primary="Subtotal: " secondary={props.grandtotal}/>
                <Button style={{backgroundColor: "black", color:"white", }} onClick={() => props.handleConfirm()}>Confirm Order</Button>
            </ListItem>
        </List>
      </Dialog>
    </div>
  );
}
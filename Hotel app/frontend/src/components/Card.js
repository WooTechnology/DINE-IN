import React,{useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';



const useStyles = makeStyles({
  card: {
    minWidth: 300,
    maxWidth: 1000,
    margin: "auto",
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});


export default function SimpleCard(props) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  const additem = props.additem
  return (
      <div >
          {props.data.map((x,i) => (
           <Card className={classes.card}>
           <CardContent >
             <Typography className={classes.title} color="textSecondary" gutterBottom>
               FoodItem-ID: {x.id}
             </Typography>
             <Typography variant="h5" component="h2">
               {x.name}
             </Typography>
             <Typography variant="body2" component="p">
               {x.description}
             </Typography>
             <Typography className={classes.title} color="textSecondary" gutterBottom>
               Price: Rs.{x.amount}
             </Typography>
           </CardContent>
           <CardActions>
            <Button variant="outlined" style={{backgroundColor:"lightblue"}} onClick={() => additem(x,i)}>Add to Cart</Button>
           </CardActions>
         </Card>
          ))} 
      </div>
  );
}
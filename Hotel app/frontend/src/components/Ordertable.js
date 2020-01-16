import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const test = fooditem => {
  return (
      <ul>
        {fooditem.map((x,i) => {
          const hh = x.quantity*x.price;
        return <li>{x.name} x{x.quantity}: Rs.{hh}</li>
        })}
      </ul>
  )
}

const handleUpdate = (x) => {
  const data = {'status': 'Food is ready'};
  fetch(`/update_status/${x.orderid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(res => {
    if(res.ok){
      console.log("Status Updated");
    }
  })

  return(
    <Button disabled>Completed</Button>
  )
}


const row = (x,i,props) => {
    const header = props.header 
    const handleRemove = props.handleRemove;

    return (
      <TableRow key={`tr-${i}`}>
        {header.map((y, k) => (
        <TableCell key={`trc-${k}`}>
          {console.log(x['food'])}
           {y.prop === 'food' ? test(JSON.parse(x[y.prop])) : x[y.prop]}
        </TableCell>
      ))}
        <TableCell>
          {x.status === 'Food is being prepared' ? 
          <Button 
          variant="contained" 
          style={{backgroundColor: 'blue', margin: 15,color: "white"}}
          onClick={() => handleUpdate(x)}
          >
          Complete</Button> : <Button disabled>Completed</Button>} 
          <Button variant="contained" 
          style={{backgroundColor: 'yellow', margin: 15,color: "black"}}
          >
          Cancel</Button>
          <Button variant="contained" 
          style={{backgroundColor: 'red', margin: 15,color: "white"}}
          onClick={() => handleRemove(i)}
          >
          Delete</Button>
        </TableCell>
      </TableRow>
    );
  };



export default function SimpleTable(props) {
  const classes = useStyles();
  const header  = props.header;
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
          {header.map((x, i) => (
          <TableCell key={`thc-${i}`}>{x.name}</TableCell>
        ))} 
          <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {props.data.map((x, i) =>row(x,i,props))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}


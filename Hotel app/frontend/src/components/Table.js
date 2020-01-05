import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const updateitem = () => {
  window.location.replace("/update")
}


const row = (x,i,props) => {
    const header = props.header 
    const handleRemove = props.handleRemove;
    return (
      <TableRow key={`tr-${i}`}>
        {header.map((y, k) => (
        <TableCell key={`trc-${k}`}>
           {x[y.prop]}
        </TableCell>
      ))}
        <TableCell>
          <EditIcon onClick={updateitem} />
        </TableCell>
        <TableCell>
          <DeleteIcon onClick={() => handleRemove(i)} />
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
          </TableRow>
        </TableHead>
        <TableBody>
        {props.data.map((x, i) =>row(x,i,props))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}


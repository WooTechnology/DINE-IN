import React, { useState,useEffect } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Ordertable from "./Ordertable";


export default function Order(){
  
  const [data1, setData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
        fetch("/order").then( res => res.json()).then(data =>{
            setData(data.order_items)
        })
    }, 20000);
    return () => clearInterval(interval);
  }, []);


 const handleRemove = i => {
    let deletedata = data1.filter((row, j) => j === i)
    let temp = JSON.stringify(deletedata);
    fetch('/order_delete', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(deletedata)
    })
    setData(data1.filter((row, j) => j !== i));
  };



    return (
      <MuiThemeProvider>
        <div>
          <Ordertable
           handleRemove={handleRemove}
           data={data1}
           header={[
            {
              name: "Orderid",
              prop: "orderid"
            },
            {
              name: "Userid",
              prop: "userid"
            },
            {
              name: "Status",
              prop: "status"
            },
            {
              name: "Food",
              prop: "food"
            },
            {
              name: "Table No",
              prop: "tableno"
            },
            {
              name: "Amount",
              prop: "amount"
            }
          ]}
          />
        </div>
      </MuiThemeProvider>
    );
}

import React, { useEffect } from 'react';
import {deleteTokensCustomer} from './auth';
import './customer.css'

export default function Checkout(){

    
    const handleOrder = () => {
        window.location.replace("/place_order");
    }

    const handleCheckout = () => {
        deleteTokensCustomer();
        window.location.replace("/customer")
    }

    return (
        <div className="bg3" style={{textAlign: "center"}}>
          <div  style={{border: "2px solid black", textAlign: "center" ,minWidth: 300, maxWidth: 700,margin: "auto", marginTop: "200px", backgroundColor:"white",height: "300px"}}>
           <h1>Thank You For your Visit</h1>
            <h3 style={{marginTop: "50px"}}>Wanna Order Again??</h3>
           <button style={{display:"block", width: "100%", backgroundColor:'blue',color:"white", padding:" 15px 32px",fontSize:"16px", pointerEvents: "cursor" }} onClick={() => handleOrder()}>Order Again</button>
           <h3>See You Next Time :))</h3>
            <button style={{display:"block", width: "100%", padding:" 15px 32px",fontSize:"16px", backgroundColor:'red', color: "white", pointer: "cursor", marginBottom: "20px"}} onClick={() => handleCheckout()}>Checkout</button>
        </div>
        </div>
    )
}
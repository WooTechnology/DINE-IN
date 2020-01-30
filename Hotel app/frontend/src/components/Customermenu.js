import React,{useState, useEffect} from 'react';
import Card from './Card';
import Cart from './Cart';
import './customer.css';
import {isLoggedInCustomer} from './auth';


export default class Customermenu extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        data1: [],
        food: [],
        grandtotal: 0,
      };
      this.additem = this.additem.bind(this);
      this.handleRemove = this.handleRemove.bind(this);
      this.handleAdd = this.handleAdd.bind(this);
      this.handleConfirm = this.handleConfirm.bind(this);
    }
    
    componentDidMount(){
      fetch("/menu").then( res => res.json()).then(data =>{
          this.setState({data1: data.food_items})
      })
    }

    additem  = (x,i) => {
      const item = {'name':x.name,'price':x.amount,'quantity':1}
      this.setState({food: this.state.food.concat(item)})
      this.setState(prevState => {
        return {grandtotal: prevState.grandtotal + x.amount}
      })
      alert("Item added to cart");
   } 

   handleRemove = (key,i) => {
     const item = this.state.food[i].price;
     this.setState(prevState => {
       let fooditem = {...prevState.food}
       console.log(fooditem);
       fooditem[i].quantity = fooditem[i].quantity - 1;
       if(fooditem[i].quantity === 0){
           return {food: this.state.food.filter((row,j) => j!==i)}
       }
       else{
          return { fooditem }
       }
     })
     this.setState(prevState => {
       console.log(this.state.food[i].price)
       return {grandtotal: prevState.grandtotal - this.state.food[i].price}
     })
   };
  
   handleAdd = (i) => {
    this.setState(prevState => {
      let fooditem = {...prevState.food}
      fooditem[i].quantity = fooditem[i].quantity + 1;
      return {fooditem}
    })
    this.setState(prevState => {
      return {grandtotal: prevState.grandtotal + this.state.food[i].price}
    })
   };

   handleConfirm = () => {
     if(isLoggedInCustomer()){
      const sessid = sessionStorage.getItem("customer_access_token");
      const food = JSON.stringify(this.state.food);
      const grandtotal = this.state.grandtotal;
      const customerorder = {'sessionid':sessid,food,grandtotal}
      console.log(JSON.stringify(customerorder));
      fetch('/order', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(customerorder)
      }).then(res => {
        if(res.ok){
          alert("Order Confirmed");
          window.location.replace("/pay")
        }
      })
     }
     else{
       console.log("hello")
     }
   };

      render(){      
        return (
            <div className="bg2">
            <div style={{backgroundColor: "black", height: 70}}>
                <Cart
                  food={this.state.food}
                  handleAdd={this.handleAdd}
                  handleRemove={this.handleRemove}
                  grandtotal={this.state.grandtotal}
                  handleConfirm={this.handleConfirm}
                />
            </div>
            <Card 
            data={this.state.data1}
            additem={this.additem}
            />
            </div>
        )
     }   
}
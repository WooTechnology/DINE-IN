import React, { Component } from 'react'
import QrReader from 'react-qr-reader'

export default class Example extends Component {
  constructor(props){
    super(props)
    this.state = {
      delay: 500,
      result: '',
    }

    this.handleScan = this.handleScan.bind(this)
  }
  handleScan(data){
    if(data){
      this.setState({ result: data })
      if (localStorage.getItem("customer_access_token") !== null && localStorage.getItem("customer_access_token")!=="undefined") {
        const sessionidx = localStorage.getItem("customer_access_token")
         fetch(`/add_table/${sessionidx}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(this.state.result)
        }).then( res => {
            if(res.ok){
                window.location.replace("/place_order")
            }
            else{
              console.log("data not sent")
            }
        })
      }
      else{
        alert("Customer details not entered")
      }
    }
    else{
      console.log("Not working")
    }
  }

  handleError(err){
    console.error(err)
  }
  render(){
    const previewStyle = {
      height: 500,
      width: 800,
      margin: "auto"
    }

    return(
      <div>
        <QrReader
          delay={this.state.delay}
          style={previewStyle}
          onError={this.handleError}
          onScan={this.handleScan}
          />
          <p style={{textAlign:"center"}}>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <h1>Result: {this.state.result}</h1>
          </p>
      </div>
    )
  }
}
 
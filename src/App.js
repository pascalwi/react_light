import React from 'react';
import socketIO from "socket.io-client"

import './App.css';


class App extends React.Component {

	constructor(){
    super()    
    this.socket = socketIO("192.168.178.65:4001")
  }  

  handleSubmit = e =>{
    e.preventDefault()    
    this.socket.emit("toggle")    
  }

  handleInput = e => {
    this.socket.emit("setBrightness", {brightness: e.target.value})    
  }

  render(){
    return(
      <div className="App">        
        <h1>Light Control</h1>
        <form onSubmit={this.handleSubmit}>
        <div className="slidecontainer">
          <input type="range" className="slider" min = "0" max = "255" onInput={this.handleInput}/>
        </div>
        <button>toggle</button>
        </form>  
      </div>
    )  
  }
}

export default App;

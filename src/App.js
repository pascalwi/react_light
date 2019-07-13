import React from 'react';
import socketIO from "socket.io-client"

import './App.css';


class App extends React.Component {

  state = {
    endpoint: "192.168.178.65:4001"
  }

  handleSubmit = e =>{
    e.preventDefault()    
    const socket = socketIO(this.state.endpoint)
    socket.emit("toggle")    
  }

  render(){
    return(
      <div className="App">        
        <h1>Light Control</h1>
        <form onSubmit={this.handleSubmit}>
        <button>toggle</button>
        </form>  
      </div>
    )  
  }
}

export default App;

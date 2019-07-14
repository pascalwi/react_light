import React from "react";
import socketIO from "socket.io-client";

import "./App.css";

class App extends React.Component {
  state = { brightness: 0 };

  componentDidMount() {
    this.socket = socketIO("192.168.178.65:4001"); //establish socket
    this.socket.on("loadstate", data => {
      this.setState({ brightness: data.brightness });
    }); // get initial brightness from server
  }

  handleChange = e => {
    this.socket.emit("handleChange", { brightness: e.target.value });
    this.setState({ brightness: e.target.value });
  }; // send adjusted brightness to server and set state

  MouseUp = e => {
    this.socket.emit("mouseUp");
  };

  render() {
    return (
      <div>
        <div className="topbar">
          <h1>Light Control</h1>
          <p>Drag the slider to adjust brightness.</p>
        </div>
        <div className="slidecontainer">
          <input
            type="range"
            className="slider"
            min="0"
            max="255"
            onChange={this.handleChange}
            onMouseUp={this.MouseUp}
            onTouchEnd={this.MouseUp}
            value={this.state.brightness}
          />
          <p>{Math.round(this.state.brightness / 2.55)}</p>
        </div>
      </div>
    );
  }
}

export default App;

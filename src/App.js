import React from "react";
import socketIO from "socket.io-client";

import "./App.css";

class App extends React.Component {
  state = {
    brightness: 0,
    timer: 0
  };

  componentDidMount() {
    this.socket = socketIO("192.168.178.65:4001"); //establish socket
    this.socket.on("loadstate", data => {
      this.setState({ brightness: data.brightness });
    }); // get initial brightness from server
    this.socket.on("updateTime", data => {
      this.setState({ timer: data.timer });
    });
  }

  handleChange = e => {
    if (e.target.name === "brightness") {
      this.socket.emit("handleChange", { brightness: e.target.value });
      this.setState({ brightness: e.target.value });
    } // send adjusted brightness to server and set state
    else {
      this.setState({ timer: e.target.value });
    }
  };
  MouseUp = e => {
    this.socket.emit("mouseUp");
  }; // tell server to update clients

  timer = e => {
    if (e.target.value !== "0" && this.state.brightness === "0") {
      this.setState({ brightness: "255" });
    } else if (e.target.value === "0") {
      this.setState({ brightness: "0" });
    }

    var time = e.target.value;

    setTimeout(() => {
      this.socket.emit("timer", {
        timer: time,
        brightness: this.state.brightness
      });
    }, 50);
  };

  render() {
    return (
      <div>
        <div className="topbar">
          <h1>Light Control</h1>
        </div>
        <div className="slidecontainer">
          <p>BRIGHTNESS:</p>
          <p>{Math.round(this.state.brightness / 2.55)}</p>
          <input
            name="brightness"
            type="range"
            className="slider"
            min="0"
            max="255"
            onChange={this.handleChange}
            onMouseUp={this.MouseUp}
            onTouchEnd={this.MouseUp}
            value={this.state.brightness}
          />
          <p />
        </div>
        <div className="slidecontainer">
          <p>TIMER</p>
          <p>{this.state.timer}</p>
          <input
            name="timer"
            type="range"
            className="slider"
            min="0"
            max="120"
            onMouseUp={this.timer}
            onTouchEnd={this.timer}
            onChange={this.handleChange}
            value={this.state.timer}
          />
        </div>
      </div>
    );
  }
}

export default App;

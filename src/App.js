import React from "react";
import socketIO from "socket.io-client";

import "./App.css";

class App extends React.Component {
  state = {
    brightness: "0",
    timer: "0"
  };

  componentDidMount() {
    this.socket = socketIO("192.168.178.65:4001"); //establish socket

    this.socket.on("loadstate", data => {
      console.log(data);
      this.setState({ brightness: data.brightness, timer: data.timer });
    }); // get initial brightness and time from server

    this.socket.on("updateTime", data => {
      this.setState({ timer: data.timer }, () => {
        if (this.state.timer === 0) {
          this.setState({ brightness: "0" });
        }
      });
    });
  }

  handleChange = e => {
    if (e.target.name === "brightness") {
      this.socket.emit("handleChange", { brightness: e.target.value });
      this.setState({ brightness: e.target.value });
    } // send adjusted brightness to server and set state
    else {
      //update label during input
      this.setState({ timer: e.target.value });
    }
  };
  MouseUp = e => {
    this.socket.emit("mouseUp");
  }; // update other clients after finished update

  timer = e => {
    //start timer after sl
    const emitTimer = () => {
      // handle emit with right state
      // function call in setState to guarantee changed state
      this.socket.emit("timer", {
        timer: remTime,
        brightness: this.state.brightness
      });
    };

    var remTime = e.target.value; // val from slider
    if (remTime !== "0" && this.state.brightness === "0") {
      //if timer is started with bright =  0, set bright to 100
      this.setState({ brightness: "255" }, () => {
        emitTimer();
      });
    } else if (remTime === "0") {
      // if timer is set to 0 , turn off (bright = 0)
      this.setState({ brightness: "0" }, () => {
        emitTimer();
      });
    } else {
      emitTimer();
    }
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
            onChange={this.handleChange}
            onMouseUp={this.timer}
            onTouchEnd={this.timer}
            value={this.state.timer}
          />
        </div>
      </div>
    );
  }
}

export default App;

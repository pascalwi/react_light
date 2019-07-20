const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const Gpio = require("pigpio").Gpio;
const index = require("./index");

const app = express();
app.use(index);
const server = http.createServer(app);

const io = socketIO(server);

LED = new Gpio(17, { mode: Gpio.OUTPUT });
let brightness = "0";
let remainingTime = "0";

countdown = data => {
  remainingTime = data.timer;
  brightness = data.brightness;

  if (remainingTime == 0) {
    // instant off when draggin slider to zero
    LED.pwmWrite(0);
    clearInterval(interval);
  } else {
    //set bright to val from state
    LED.pwmWrite(Number(brightness));

    //clear previous intervalls if existant
    if (typeof interval !== "undefined") {
      clearInterval(interval);
    }
    //respond every minute with a minute less, sketchy ?
    interval = setInterval(() => {
      remainingTime--;
      io.emit("updateTime", { timer: remainingTime });
    }, 3000);
  }
};

io.on("connection", socket => {
  //set initial on connect
  io.emit("loadstate", { brightness: brightness, timer: remainingTime });

  //adjust led
  socket.on("handleChange", data => {
    brightness = data.brightness;
    LED.pwmWrite(brightness);
  });

  //update other clients on change in bright
  socket.on("mouseUp", data => {
    socket.broadcast.emit("loadstate", {
      brightness: brightness,
      timer: remainingTime
    });
  });

  //handle timer and update other clients on change in timer
  socket.on("timer", data => {
    countdown(data);
    socket.broadcast.emit("loadstate", {
      brightness: brightness,
      timer: remainingTime
    });
  });
});

server.listen(4001, () => console.log("listening on port 4001"));

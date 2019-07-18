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

var brightness = "0";
var remainigTime;

countdown = data => {
  var remainingTime = data.timer;
  var brightness = data.brightness;

  console.log("bright node", brightness);
  // instant off when draggin slider to zero
  if (Number(remainingTime) < 1) {
    LED.pwmWrite(0);
  } else {
    LED.pwmWrite(Number(brightness));
  }

  //clear previous intervalls if existant
  if (typeof interval !== "undefined") {
    clearInterval(interval);
  }

  interval = setInterval(() => {
    remainingTime--;

    if (Number(remainingTime) < 1) {
      clearInterval(interval);
      LED.pwmWrite(0);
      io.emit("loadstate", { brightness: "0" });
    }

    if (remainingTime < 0) {
      remainingTime = 0;
    }

    io.emit("updateTime", { timer: remainingTime });
  }, 60000);
};

io.on("connection", socket => {
  socket.emit("loadstate", { brightness: brightness });

  socket.on("handleChange", data => {
    brightness = data.brightness;
    LED.pwmWrite(data.brightness);
  });

  socket.on("timer", data => {
    countdown(data);
  });

  socket.on("mouseUp", data => {
    io.emit("loadstate", { brightness: brightness });
  });
});

server.listen(4001, () => console.log("listening on port 4001"));

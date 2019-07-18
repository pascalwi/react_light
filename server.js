const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const Gpio = require("pigpio").Gpio;
const index = require("./index");

const app = express();
app.use(index);
const server = http.createServer(app);

const io = socketIO(server);
var brightness = 0;
var minutes = 0;

LED = new Gpio(17, { mode: Gpio.OUTPUT });

oneMinute = counter => {
  console.log(counter);
};

io.on("connection", socket => {
  socket.emit("loadstate", { brightness: brightness });

  socket.on("handleChange", data => {
    brightness = data.brightness;
    LED.pwmWrite(data.brightness);
  });

  socket.on("timer", data => {
    var remainingTime = data.timer;
    console.log(countdown);
    clearInterval(countdown);

    var countdown = setInterval(() => {
      console.log(remainingTime);
      remainingTime--;
      io.emit("updateTime", { timer: remainingTime });
    }, 1000);
    // setTimeout(() => {
    //   io.emit("updateTime", { timer: data.timer - 1 });
    // }, 10000);
  });

  socket.on("mouseUp", data => {
    io.emit("loadstate", { brightness: brightness });
  });
});

server.listen(4001, () => console.log("listening on port 4001"));

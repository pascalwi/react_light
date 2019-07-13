const http = require("http")
const express = require("express")
const socketIO = require("socket.io")
const Gpio = require("onoff").Gpio
const index = require("./index")

const app = express()
app.use(index)

const server = http.createServer(app)

const io = socketIO(server)

LED = new Gpio (17, 'out')
io.on("connection", socket => {
    socket.on("toggle", () => {
        if (LED.readSync() === 0){
            LED.writeSync(1)
        } else {
            LED.writeSync(0)
        }
    })
})

server.listen(4001, () => console.log("listening on port 4001"))
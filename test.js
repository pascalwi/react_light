const Gpio = require("pigpio").Gpio;
LED = new Gpio(17, { mode: Gpio.OUTPUT });
LED.pwmWrite(255);
setTimeout(() => LED.pwmWrite(0), 60000);

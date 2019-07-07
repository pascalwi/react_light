import React from 'react';



class LightControl extends React.Component {

  

handleSubmit = e => {
        
    var Gpio = require('onoff').Gpio
    var led = new Gpio(17, 'out')
    led.writeSync(1)
    console.log("hi")
    e.preventDefault();
}

handleClick = e =>{
    console.log("Click")
    var Gpio = require('onoff').Gpio
    var led = new Gpio(17, 'out')
    led.writeSync(1)  
}

render(){
    return(<form>    
    <button onClick={this.handleClick}>haldlo</button>    
    </form>)    
    };
}

export default LightControl;
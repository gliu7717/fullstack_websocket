import { io } from 'socket.io-client';
import { colorfulLog } from 'colorful-log-sw';

const socket = io('http://localhost:8000/');
var stdin = process.openStdin();

stdin.addListener("data", function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that  
    // with toString() and then trim() 
    console.log("you entered: [" + d.toString().trim() + "]");
    
    socket.emit('message', d.toString().trim());
});


const createSocketClient = (name, interval) => {
    socket.on('connect', () => {
        colorfulLog(`${name} connected!`);
    });

    socket.on('newNumber', data => {
        colorfulLog(data);
    });
    
    socket.on('message', data => {
        console.log(data);
    });

    setInterval(() => {
        // const randomNumber = Math.ceil(Math.random() * 100);
        // socket.emit('newNumber', `Here's your random number: ${randomNumber}`);
        socket.emit('message', `Hello from ${name}!`);
    }, interval);
    
    socket.on('disconnect', () => {
        colorfulLog(`${name} disconnected!`);
    });
}

createSocketClient(process.argv[2], 5000);
//createSocketClient('Client server 2', 5000);
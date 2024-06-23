import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { colorfulLog } from 'colorful-log-sw';

const app = express();
const server = http.createServer(app);
const io = new Server(server);


var stdin = process.openStdin();

stdin.addListener("data", function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that  
    // with toString() and then trim() 
    console.log("you entered: [" + d.toString().trim() + "]");
    io.sockets.emit('message', d.toString().trim());
});


io.on('connection', socket => {
    colorfulLog(`Connected to: ${socket.client.id}`);
        
    socket.on('message', data => {
        colorfulLog(data);
        const randomNumber = Math.ceil(Math.random() * 100);
        //socket.emit('newNumber', `Here's your random number: ${randomNumber}`);
        //Send to current client

        //io.sockets.emit('newNumber', `Here's your random number: ${randomNumber}`);
        //Send to all clients include sender

        socket.broadcast.emit('newNumber', `Here's your random number: ${randomNumber}`);
        socket.broadcast.emit("message",data);
        // Send to all clients except sender
    });

    socket.on('disconnect', () => {
        colorfulLog(`Disconnected from: ${socket.client.id}`);
    });
});

server.listen(8000, () => {
    colorfulLog('Waiting for connections on port 8000', '');
});
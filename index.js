const WebSocket = require("ws");
const path = require("path");
const express = require("express");



//* Defining the PORT number 
const PORT = 5000;



//* Creating the instance of express
const app = express();



//* Creating the express server 
const server = app.listen(PORT, () => {
    console.log(`Server is listening on PORT number ${PORT}`);
});



//* Creating the web socket server 
const wss = new WebSocket.Server({
    server : server
});



//* Displaying the HTML file 
app.get("/", (req, res) => {
    let filePath = path.join(__dirname, "index.html");
    res.sendFile(filePath);
});



//* Create a rooms object to store different clients 
let rooms = {};



//* Establishing a new web socket server 
wss.on("connection", (ws) => {

    //* WHat you want me to do, when I receive opening request 
    ws.on("open", () => {
        console.log(`COnnection is OPENED!!!!`);
    });


    //* What you want me to do, when I receive message from the client  
    ws.on("message", (msg) => {

        //* Get message from the client 
        let body = msg.toString();
        console.log("Main Body =", JSON.parse(body));
        body = JSON.parse(body);

        //* Now, let's de-structure the 'body' object 
        const { COMMAND, ROOM_NUMBER, MESSAGE, CLIENT_NUMBER } = body;


        //* If we get "join" request 
        if(COMMAND == "join") {
            if(!rooms[ROOM_NUMBER]) {
                rooms[ROOM_NUMBER] = [];
            }
            rooms[ROOM_NUMBER].push({ws, CLIENT_NUMBER : CLIENT_NUMBER});
            console.log("ROOMS = ", rooms);
        }
        
        //* If we get "message" request 
        else if(COMMAND == "message") {
            rooms[ROOM_NUMBER] = [...new Set(rooms[ROOM_NUMBER])];
            rooms[ROOM_NUMBER].forEach((currClient) => {
                if(currClient.ws !== ws) {
                    currClient.ws.send(JSON.stringify({
                        MSG : MESSAGE, 
                        CLIENT_NUM : CLIENT_NUMBER
                    }));
                }
            });
        }
        
    });


    //* What you want me to do, when I receive close request 
    ws.on("close", () => {
        console.log(`Web Socket connection is CLOSED!!!!`);
    });
});
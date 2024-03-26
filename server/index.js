// https://www.w3schools.com/nodejs/nodejs_raspberrypi_webserver_websocket.asp
// https://blog.logrocket.com/websocket-tutorial-real-time-node-react/
import { createServer } from 'http';
import { WebSocket, WebSocketServer }from 'ws';
import { Gpio } from 'onoff';
import { connect } from 'http2';


// Spinning the HTTP server and the WebSocket server.
const server = createServer();
const wsServer = new WebSocketServer({ server });
const port = 8000;
let client = null;

server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});

const handleDisconnect = () => {
  console.log(`WebSocket disconnected.`);
  client = null;
}

wsServer.on('connection', (connection) => {
  console.log(`Received a new connection.`);

  client = connection;
  // User disconnected
  connection.on('close', () => handleDisconnect());
});


const channel = 17;
const sensor = new Gpio(channel, 'in', 'both');
let count = 0
sensor.watch((err, value) => {
  console.log('Movement Detected!', count);
  count ++;
  if(client != null && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify({ message: 'Movement Detected!', count }));
  }
});

process.on('SIGINT',  () => { //on ctrl+c
  sensor.unexport();
  process.exit();
});

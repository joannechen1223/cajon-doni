// Reference:
// 1. https://www.w3schools.com/nodejs/nodejs_raspberrypi_webserver_websocket.asp
// 2. https://github.com/codezri/react-node-websockets-demo
import { createServer } from 'http';
import { WebSocket, WebSocketServer }from 'ws';
import { Gpio } from 'onoff';
import { exec } from 'child_process';

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

const playSound = (soundPath) => {
  exec(`aplay ${soundPath}`, (err, stdout, stderr) => {
    if (err) {
      console.error('Error playing sound:', err);
    } else {
      console.log('Sound played successfully');
    }
  });
}

wsServer.on('connection', (connection) => {
  console.log(`Received a new connection.`);

  client = connection;
  // User disconnected
  connection.on('close', () => handleDisconnect());
});

const coolDownMs = 300;


const channel1 = 17;
const sensor1 = new Gpio(channel1, 'in', 'both');
let sensor1CoolDown = false;
let count1 = 0;
sensor1.watch((err, value) => {
  console.log('Sensor1 Movement Detected!', count1);
  count1 ++;
  if(!sensor1CoolDown) {
    if (client != null && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ sensor: 1 }));
    }
    sensor1CoolDown = true;
    playSound('./audio/sound1.wav');
    setTimeout(() => {
      sensor1CoolDown = false;
    }, coolDownMs);
  }
});

const channel2 = 22;
const sensor2 = new Gpio(channel2, 'in', 'both');
let sensor2CoolDown = false;
let count2 = 0;
sensor2.watch((err, value) => {
  console.log('Sensor2 Movement Detected!', count2);
  count2 ++;
  if(!sensor2CoolDown) {
    if (client != null && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ sensor: 2 }));
    }
    sensor2CoolDown = true;
    playSound('./audio/sound2.wav');
    setTimeout(() => {
      sensor2CoolDown = false;
    }, coolDownMs);
  }
});

process.on('SIGINT',  () => { //on ctrl+c
  sensor1.unexport();
  sensor2.unexport();
  process.exit();
});

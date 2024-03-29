#cajon-doni
![Logo](./asset/logo.svg)

This is a digital fabrication project that consists of a self-made mini Cajon and a web-based rhythm game. The mini Cajon is powered by Raspberry pi and vibration sensors(SW-420). The server side of the code is built by Node.js and runs on the Raspberry pi to detect the hit. The client side is built with React,
and it should be run on a device that share the same internet environment. The server and client side communicate through HTTP + WebSocket.

## How to run the server?

```bash
# Go to the server directory
cd server

# install
npm install

# run
npm start
```

## How to run the client?

Make sure to install [`bun`](https://bun.sh/) first.

```bash
# Go to the client directory
cd client

# install
bun install

# run
bun dev
```

For more information, please refer to [here](./client/README.md).

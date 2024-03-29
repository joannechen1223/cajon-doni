# cajon-doni
<img src="./asset/logo.svg" alt="Logo" width="300">


This is a digital fabrication project that consists of a self-made mini Cajon and a web-based rhythm game. The mini Cajon is powered by Raspberry Pi and vibration sensors(SW-420). The server side of the code is built by Node.js and runs on the Raspberry pi to detect the hit. The client side is built with React,
and it should be run on a device that shares the same internet environment. The server and client side communicate through HTTP + WebSocket.


https://github.com/joannechen1223/cajon-doni/assets/22555930/5fa332ec-e813-4920-9a5f-d7689efe2d5c



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

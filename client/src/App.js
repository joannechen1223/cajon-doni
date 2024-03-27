import { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import './App.css';

const WS_URL = 'ws://100.110.142.168:8000';
const COLOR = {
  RED: '#ee6055',
  BLUE: '#48cae4',
  WHITE: '#ffffff',
};

const App = () => {
  const [leftColor, setLeftColor] = useState(COLOR.WHITE);
  const [rightColor, setRightColor] = useState(COLOR.WHITE);
  const { lastJsonMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    },
    share: true,
    filter: () => true,
    retryOnError: true,
    shouldReconnect: () => true,
  });

  useEffect(() => {
    if (lastJsonMessage && readyState === ReadyState.OPEN) {
      if (lastJsonMessage.sensor === 1) {
        setLeftColor(COLOR.RED);
        setTimeout(() => setLeftColor(COLOR.WHITE), 200);
      }
      if (lastJsonMessage.sensor === 2) {
        setRightColor(COLOR.BLUE);
        setTimeout(() => setRightColor(COLOR.WHITE), 200);
      }
    }
  }, [lastJsonMessage, readyState]);

  return (
    <div className="App">
      <header className="App-header">
        <p>cajon-doni</p>
        <div className="Container">
          <div className="Drum" style={{ backgroundColor: leftColor }}></div>
          <div className="Drum" style={{ backgroundColor: rightColor }}></div>
        </div>
      </header>
    </div>
  );
};

export default App;

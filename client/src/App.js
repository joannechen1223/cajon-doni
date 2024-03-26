import { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import './App.css';

const WS_URL = 'ws://100.110.142.168:8000';
const circleCss = {
  borderRadius: '50%',
  width: '100px',
  height: '100px'
}

const App = () => {
  const [color, setColor] = useState('white');
  const { lastJsonMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    },
    share: true,
    filter: () => true,
    retryOnError: true,
    shouldReconnect: () => true
  });

  useEffect(() => {
    if (lastJsonMessage && readyState === ReadyState.OPEN) {
      setColor('red');
      setTimeout(() => setColor('white'), 200);
    }
  }, [lastJsonMessage, readyState]);



  return (
    <div className="App">
      <header className="App-header">
        <p>
          cajon-doni
        </p>
        <div style={{ backgroundColor: color, ...circleCss }}></div>
      </header>
    </div>
  );
}

export default App;

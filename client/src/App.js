import { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import './App.css';

const WS_URL = 'ws://100.110.142.168:8000';
const COLOR = {
  RED: '#ee6055',
  BLUE: '#48cae4',
  WHITE: '#ffffff',
};

const notes = [
  { sensor: 1, time: 1 },
  { sensor: 1, time: 2 },
  { sensor: 2, time: 3 },
  { sensor: 2, time: 6 },
  { sensor: 1, time: 10 },
  { sensor: 2, time: 10.5 },
  { sensor: 2, time: 11 },
];

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
    const noteElements = document.querySelectorAll('.note');

    noteElements.forEach((noteElement) => {
      noteElement.addEventListener('animationend', (event) => {
        if (event.animationName === 'move-left') {
          noteElement.style.display = 'none';
        }
      });
    });
  }, []);

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

  const getNoteStyle = (sensor, time) => {
    return {
      animation: `appear 0.1s forwards ${
        time - 0.1
      }s, move-left 5s linear ${time}s 1`,
      backgroundColor: sensor === 1 ? COLOR.RED : COLOR.BLUE,
    };
  };

  return (
    <div className="app">
      <header className="app-header">
        <p>cajon-doni</p>
        <div className="drum-container">
          <div className="drum" style={{ backgroundColor: leftColor }}></div>
          <div className="drum" style={{ backgroundColor: rightColor }}></div>
        </div>
        <div className="game">
          <div className="hit-zone" />
          {notes.map((note, index) => (
            <div
              key={index}
              className="note"
              style={getNoteStyle(note.sensor, note.time)}
            />
          ))}
        </div>
      </header>
    </div>
  );
};

export default App;

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { RoomProvider } from './context/roomContext';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <RoomProvider>
        <App />
      </RoomProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Game from './components/Game';
import Rules from './components/Rules';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
const rootElement = document.getElementById('root');
ReactDOM.render(

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="play" element={<Game />} />
        <Route path="rules" element={<Rules />} />
      </Routes>
    </BrowserRouter>,
    rootElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

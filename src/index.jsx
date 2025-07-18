import React from "react";
import { createRoot } from 'react-dom/client';
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter } from "react-router-dom";
import "./static/css/booth.css";
import "react-tooltip/dist/react-tooltip.css";
import store from "./store/index";
import { Provider } from "react-redux";
import crypto from 'crypto-browserify';

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript


root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

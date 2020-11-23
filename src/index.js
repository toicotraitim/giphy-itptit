import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";

import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename="http://toilahuong.tech/giphy">
      <Router>
        <App />
      </Router>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);


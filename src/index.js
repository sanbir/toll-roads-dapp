import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router';
import routes from './routes';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './index.css';

ReactDOM.render(
    <Router history={browserHistory} routes={routes} />,
  document.getElementById('root')
);

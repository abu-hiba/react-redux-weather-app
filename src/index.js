import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './Store/configureStore';
import { Provider } from 'react-redux';

const store = configureStore();

require('dotenv').config()

ReactDOM.render(<Provider store={store} ><App /></Provider>, document.getElementById('root'));
registerServiceWorker();

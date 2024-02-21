import { Tuple, configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { thunk } from 'redux-thunk';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom/client';
import reducer from './reducers';
import './index.scss';
import App from './components/app';

const store = configureStore({ reducer, middleware: () => new Tuple(thunk) });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
);

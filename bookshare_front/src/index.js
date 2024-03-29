import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {HashRouter as Router} from 'react-router-dom';
import {I18nextProvider} from "react-i18next";
import i18n from "./Lang/i18n";

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <I18nextProvider i18n={i18n}>
                <App/>
            </I18nextProvider>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

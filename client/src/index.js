//core
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom'
import {createStore} from 'redux'
import {Provider} from 'react-redux'

//components
import App from './App';

//config
import rootReducer from "./redux/rootReducer";

//styles
import './tailwind.output.css';
import './index.css';

const store = createStore(rootReducer);

ReactDOM.render(
    //<React.StrictMode>
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>
    // </React.StrictMode>
    , document.getElementById('root')
);

// @ts-ignore
import React from 'react';
// @ts-ignore
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import './tailwind.output.css';
// @ts-ignore
import {BrowserRouter} from 'react-router-dom'

import {createStore} from 'redux'
// @ts-ignore
import {Provider} from 'react-redux'
import rootReducer from "./redux/rootReducer";

const store = createStore(rootReducer)

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<App/>
			</BrowserRouter>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);

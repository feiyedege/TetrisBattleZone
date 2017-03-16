import React from 'react';
import ReactDOM from 'react-dom';
import {createStore , applyMiddleware , combineReducers} from 'redux';
import { Provider } from 'react-redux';
import indexReducer from './reducer/indexReducer.js';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import App from './Container/App.js';
import Help from './Container/Help.js';
import Rooms from './Container/Rooms.js';
import Records from './Container/Records.js';
import AllUser from './Container/AllUser.js';
import BattleRoom from './container/BattleRoom.js';
import { Router, Route, hashHistory, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';


//日志中间件
var logger = createLogger();

//处理加工一下reducer
var reducer = combineReducers({
	indexReducer,
	routing: routerReducer
});
 
//创建了一个store对象，使用counter来创建
var store = createStore(reducer,applyMiddleware(thunk));


//创建一个History对象
const history = syncHistoryWithStore(hashHistory, store);

//此时就可以上组件了
ReactDOM.render(
	<Provider store={store}>
	    <Router history={history}>
			<Route path="/" component={App}>
				<Route path="/help" component={Help}></Route>
				<Route path="/rooms" component={Rooms}></Route>
				<Route path="/alluser" component={AllUser}></Route>
				<Route path="/battle" component={BattleRoom}></Route>
				<Route path="/*" component={Help}></Route>
			</Route>
	    </Router>
  	</Provider>
	,
	document.getElementById("container")
);

export {store};
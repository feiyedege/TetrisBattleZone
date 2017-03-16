import React, { Component } from 'react';
import {connect} from 'react-redux';
import Aside from './Aside.js';
import Header from './Header.js';
import { hasLogin } from '../action/Action.js';
import {come} from '../socketAPI/socketEmit.js';
import Login from '../component/Login.js';
import Logup from '../component/Logup.js';

class App extends Component{

	componentDidMount(){

		var self=this;
		
		this.props.hasLogin(function(data){
			if(data.isLogin){
				come(data.nickname);
			}
		});
	}

	render(){
		this.props.room ? window.location.hash = "#/battle" : null;
		return (
			<div className="bigbox">
				<Header></Header>
				<Aside></Aside>
				{ this.props.children }
				{ this.props.isLogin ? null : this.props.goLogup ? <Logup></Logup> : <Login></Login> }
			</div>
		)
	}
}

//加工CounterContainer
App = connect(
	(state)=>{
		return {
			isLogin:state.indexReducer.isLogin,
			goLogup:state.indexReducer.goLogup,
			room:state.indexReducer.room
		}
	},{
		hasLogin
	}
)(App);

export default App;
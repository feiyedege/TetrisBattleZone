import React, { Component } from "react";
import { connect } from 'react-redux';
import { checkLogin, goLogup } from '../action/Action.js';
import { come } from '../socketAPI/socketEmit.js';

class Login extends Component{
	//生命周期：上树之后
	componentDidMount(){
		$(".form-login").css({ "margin-top" : -1000 });
		$(".form-login").animate({ "margin-top" : -180 });
	}

	loginBtnHandler(){
		var self = this;
		var nick = $(this.refs.nickname).val();
		this.props.checkLogin(nick, $(this.refs.password).val(), function(data){
			if(data.result == 1){
				alert("登录成功");
				come(nick);
			}else if(data.result == -8){
				alert("重复登陆");
			}else{
				alert("登录失败");
			}
		});
	}
	 
	render(){
		return (
			<div className="mask">
				<form className="form-login">
				    <h2>现在登录</h2>
				    <div className="login-wrap">
				        <input type="text" placeholder="用户名" autoFocus ref="nickname" />
				        <br/>
				        <input type="password" placeholder="密码" ref="password"/>
				        <button type="button" onClick={ this.loginBtnHandler.bind(this) }>登录</button>
				        <hr />
				        <div className="registration">
				            没有账号？<br />
				            <a href="#" onClick={ this.props.goLogup }>
				                马上去注册
				            </a>
				        </div>
					</div>
				</form>
			</div>
		);
	};
}

//加工CounterContainer
Login = connect(
	(state)=>{
		return {
		}
	},{
		checkLogin,
		goLogup
	}
)(Login);

export default Login;
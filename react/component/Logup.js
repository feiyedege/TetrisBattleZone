import React, { Component } from "react";
import { connect } from 'react-redux';
import { logup } from '../action/Action.js';
import { come } from '../socketAPI/socketEmit.js';

class Logup extends Component{
	//生命周期：上树之后
	componentDidMount(){
		$(".form-login").css({ "margin-top" : -1000 });
		$(".form-login").animate({ "margin-top" : -180 });
	}

	//点击鼠标的事件
	registBtnHandler(){
		//用户名
		var nickname = $(this.refs.nickname).val();
		//密码
		var password1 = $(this.refs.password1).val();
		var password2 = $(this.refs.password2).val();
		//验证密码是否一样
		if(password1 != password2){
			alert("两次输入的密码不同！");
			return;
		}

		//如果相同的话就可以注册了，注册使用Action的函数
		this.props.logup(nickname, password1, function(data){
			var r = data.result;
			if(r == 1){
				alert("恭喜，你已经成功注册！");
				come(nickname);
			}else if(r == -1){
				alert("数据库错误");
			}else if(r == -2){
				alert("用户名已存在");
			}else if(r == -4){
				alert("请填写完整");
			}
		});
	}
	 
	render(){
		return (
			<div className="mask">
				<form className="form-login">
				    <h2>注册</h2>
				    <div className="login-wrap">
				        <input type="text" placeholder="用户名" autoFocus ref="nickname" />
				        <br/>
				        <input type="password" placeholder="密码" ref="password1"/>
				        <br/>
				        <input type="password" placeholder="再次输入" ref="password2"/>
				        <button type="button" onClick={ this.registBtnHandler.bind(this) }>注册</button>
					</div>
				</form>
			</div>
		);
	};
}

//加工CounterContainer
Logup = connect(
	(state)=>{
		return {
			 
		}
	},{
		logup
	}
)(Logup);

export default Logup;
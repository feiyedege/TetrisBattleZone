import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
 
class Header extends Component{

	componentDidMount(){

	}
	exit(){
		$.get("/exit", { "nickname" : this.props.nickname }, function(data){
			// 服务器返回1，退出成功，重定向到主页
			if(data.result == 1){
				window.location="/";
			}
		});
	}
	//预备的东西，圆括号里面没有东西
	render(){
		return (
			<header className="header">
				<div className="title"> 
					<Link to="help"><b>俄罗斯对战小平台</b><i>——黄鹏菲</i></Link>
				</div>
				<div className="welcome">
					{ this.props.isLogin ? this.props.nickname+"，欢迎您！" : null }
				</div>
				<div className="exit" onClick={ this.exit.bind(this) }>
					退出登陆
				</div>
			</header>
		)
	}
}

//加工CounterContainer
Header = connect(
	(state)=>{
		return {
			isLogin:state.indexReducer.isLogin,
			nickname:state.indexReducer.nickname
		}
	},{
		
	}
)(Header);

export default Header;

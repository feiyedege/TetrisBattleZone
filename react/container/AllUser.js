import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendMessage } from "../socketAPI/socketEmit.js";

class AllUser extends Component{

	componentDidMount(){

	}

	componentDidUpdate (){
		$(".msg").scrollTop($(".msg")[0].scrollHeight);
	}

	// 发送消息
	messageInRoom(){
		var sendText = document.querySelector("#allmsg");
		var words = sendText.value;
		if(words){
			sendMessage({"type" : "all", "words" : words, "nickname" : this.props.nickname});
			sendText.value = "";
		}
	}

	keydownHandler(event){
		if(event.nativeEvent.keyCode == 13){
			this.messageInRoom();
		}
	}

	render(){
		return (
			<div id="main-content">
				<h2>当前在线玩家</h2>
				<ul className="users">
				{ Object.keys(this.props.users).map((userid, key) => <li key={ key }>{ this.props.users[userid].nickname }</li>) }
				</ul>
				<div className="msgbox">
					<ul className="msg">
					{ this.props.allmessage.map((message, key) => <li key={ key }>{ message.nickname + ": " + message.words }</li>) }
					</ul>
				</div>
				<div className="sendmsg">
					<input id="allmsg" type="text" onKeyDown={ this.keydownHandler.bind(this) }/>
					<input type="button" value="发言" onClick={ this.messageInRoom.bind(this) }/>
				</div>
			</div>
		)
	}
}

//加工CounterContainer
AllUser = connect(
	(state)=>{
		return {
			nickname : state.indexReducer.nickname,
			users : state.indexReducer.users,
			allmessage : state.indexReducer.allmessage
		}
	},{
	}
)(AllUser);

export default AllUser;
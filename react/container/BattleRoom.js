import React, { Component } from "react";
import { connect } from 'react-redux';
import Game from "../game/Game.js";
import EnemyLi from "../component/EnemyLi.js";
import DaojuLi from "../component/DaojuLi.js";
import { roomOperate, sendMessage, sendGameInfo } from "../socketAPI/socketEmit.js";
import { changeGroup, changeReady, shiftDaoju, useDaoju } from "../action/Action.js";

// 暴露给socket调用的函数
var start = null;
var renderGuest = null;

// 下面的变量存储当前该类的实例
var tempBR = null;
// 脏标记，游戏结束后使用道具无效
var gameover = true;



// 此处的键盘事件，写在类里面容易bug，
function shiftKeydownHandler(e){
	// 如果游戏结束，返回
	if(gameover){
		return;
	}
	if(tempBR.props.daoju.length == 0){
		return;
	}
	if(e.keyCode == 9){
		e.preventDefault();
		tempBR.props.shiftDaoju();
	}else if(e.keyCode == 49){
		tempBR.hostGame.removeRows += tempBR.props.daoju[0];
		tempBR.props.useDaoju();
	}else if(e.keyCode > 49 && e.keyCode < 55){
		var enemies = [];
		for(var i = 0; i < tempBR.props.room.players.length; i++){
			if(tempBR.props.room.players[i].nickname != tempBR.props.nickname){
				enemies.push(tempBR.props.room.players[i].nickname);
			}
		}
		if(!enemies[e.keyCode - 50]){
			return;
		}
		sendGameInfo({ "type" : "daoju", "sn" : tempBR.props.daoju[0], "tarObj" : enemies[e.keyCode - 50] });
		tempBR.props.useDaoju();

	}
}


class BattleRoom extends Component{

	componentDidMount(){
		tempBR = this;
		start = this.startFun();
		renderGuest = this.renderGuestFun();
		document.addEventListener("keydown", shiftKeydownHandler, true);
	}

	componentDidUpdate (){
		$(".sendMessage").scrollTop($(".sendMessage")[0].scrollHeight);
	}

	componentWillUnmount(){
		document.removeEventListener("keydown", shiftKeydownHandler, true);
		tempBR.props = null;
	}

	startFun(){
		var self = this;
		return function(){
			gameover = false;
			self.hostGame = new Game(self.props.nickname, "myscore", "next1", "next2");
			for(var i = 0; i < self.props.room.players.length; i++){
				var player = self.props.room.players[i]
				if(player.nickname != self.props.nickname){
					self[player.nickname] = new Game(player.nickname, player.nickname + "score");
				}
			}
			self.hostGame.start();
			return self.hostGame;
		};
	}

	renderGuestFun(){
		var self = this;
		return function(order){
			var gg=self[order.id];
			gg.block[0].row = order.block.row;
			gg.block[0].col = order.block.col;
			gg.block[0].matrix = order.block.matrix;
			gg.block[0].type = order.block.type;
			gg.map.matrix = order.map.matrix;
			gg.score = order.score;
			gg.clear("table", 20, 12);
			gg.block[0].render("table");
			gg.map.render();
			gg.showScore();
		};
	}

	// 准备按钮点击事件
	setout(){
		roomOperate({ "type" : "ready" });
		changeReady(true);
		$(".start input").attr("disabled", "disabled").css("background", "-webkit-linear-gradient(top, silver, #666, silver)");
	}

	// 退出按钮点击事件
	exit(){
		if(this.hostGame){
			this.hostGame.end();
		}
		roomOperate({ "type" : "leave" });
		$(".exit input").attr("disabled", "disabled");
	}

	// 发送房内消息
	messageInRoom(){
		var sendText = document.querySelectorAll(".words")[0];
		var words = sendText.value;
		if(words){
			sendMessage({"type" : "room", "words" : words, "nickname" : this.props.nickname});
			sendText.value = "";
		}
	}

	// 文本输入框回车事件
	keydownHandler(event){
		if(event.nativeEvent.keyCode == 13){
			this.messageInRoom();
		}
	}

	// 分组事件
	changeMyGroup(event){
		if(event.target.type == "button"){
			// 如果游戏开始，返回
			if(this.props.room.start){
				return;
			}
			var group = event.target.value;
			// 如果所选组与自己当前组相同，返回
			if(group == this.props.group){
				return;
			}
			// 如果点击的是按钮，则发射分组事件
			roomOperate({ "type" : "changeGroup", "group" : group });
			// 改变自己的分组
			changeGroup(group);
		}
	}

	// 根据分组，改变自己的昵称背景
	groupColor(group){
		switch(group){
			case "A":
				return "-webkit-linear-gradient(top, silver, #F6BC12, silver)";
			case "B":
				return "-webkit-linear-gradient(top, silver, #29AEE6, silver)";
			case "C":
				return "-webkit-linear-gradient(top, silver, #F86633, silver)";
			case "Single":
				return "-webkit-linear-gradient(top, silver, #7CC919, silver)";
		}
	}

	render(){
		this.props.room ? null :  window.location.hash = "#/rooms";
		return (
			<div id="main-content" className="battleRoom">
				<div className="header">
					{this.props.room ? <span>房间: { this.props.room.players[0].currentRoom }; 人数: { this.props.room.players.length } / { this.props.room.length }</span> : null }; 
				</div>
				<div className="content">
					<ul className="enemies">
						{	this.props.room ? this.props.room.players.map((player, key) => {
								if(player.nickname != this.props.nickname){
									return <EnemyLi player={ player } key={ key } groupColor={ this.groupColor }></EnemyLi>;
								}
							}) : null
						}
					</ul>
					<div className="mine" style={{ "background" : this.props.ready ? "#256A67" : "gray" }}>
						<audio src="/music/bgm.mp3" loop preload id="bgm"></audio>
						<audio src="/music/drop.wav" id="dropmusic"></audio>
						<h3 className="myInfo" style={{ "background" : this.groupColor(this.props.group)}}>{ this.props.nickname }<i id="myscore">分数：0</i></h3>
						<table id={ this.props.nickname }></table>
						<ul className="daoju" id="items">
						{ this.props.daoju.map((type, key) => <DaojuLi type={ type } key={ key }></DaojuLi>) }
						</ul>
						<div className="shuoming" id="detail">
						</div>
						<div className="next" style={{ "background" : this.props.ready ? "#256A67" : "gray" }}>
							<h3>NEXT</h3>
							<div>
								<table id="next1"></table>
								<table id="next2"></table>
							</div>
						</div>
					</div>
					<div className="rightSide">
						<div className="sysMessage">
							<ul className="sendMessage" ref="sm">
							{ this.props.roommessage.map((message, key) => <li key={ key }>{ message.nickname + ": " + message.words }</li>) }
							</ul>
							<input className="words" type="text" onKeyDown={ this.keydownHandler.bind(this) }/>
							<input type="button" value="发言" onClick={ this.messageInRoom.bind(this) }/>
						</div>
						<div className="chooseGroup">
							<p>选择编组</p>
							<div className="groups" onClick={this.changeMyGroup.bind(this)}>
								<div className="abc">
									<input type="button" value="A"/>
									<input type="button" value="B"/>
									<input type="button" value="C"/>
								</div>
								<div className="single">
									<input type="button" value="Single"/>
								</div>
							</div>
						</div>
						<div className="start">
							<input type="button" value="准备" onClick={ this.setout.bind(this) }/>
						</div>
						<div className="exit">
							<input type="button" value="退出" onClick={ this.exit.bind(this) }/>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

//加工CounterContainer
BattleRoom = connect(
	(state)=>{
		return {
			room : state.indexReducer.room,
			ready : state.indexReducer.ready,
			group : state.indexReducer.group,
			nickname : state.indexReducer.nickname,
			daoju : state.indexReducer.daoju,
			roommessage : state.indexReducer.roommessage
		}
	},{
		shiftDaoju,
		useDaoju
	}
)(BattleRoom);

// 暴露给socketOn使用
export { start, renderGuest };
// 暴露给Game使用
export const GameOver = () =>{ gameover = true };
export default BattleRoom;
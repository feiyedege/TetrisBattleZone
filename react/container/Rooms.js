import React, { Component } from 'react';
import { connect } from 'react-redux';
import RoomLi from '../component/RoomLi.js';
import { roomOperate } from '../socketAPI/socketEmit.js';

class Rooms extends Component{

	componentDidMount(){

	}
	// 创建房间
	create(){
		// 玩家输入房间名
		var newRoom = prompt("请输入房间名");
		if(!newRoom){
			return;
		}
		// 玩家输入房间人数
		var len;
		while(!Number(len) || parseInt(len)!=len || len < 1 || len > 6){
			var len = prompt("请输入房间人数", "整数1~6");
		}
		// 调用socket发送事件
		if(newRoom){
			//创建房间
			roomOperate({ "type" : "create", "room" : newRoom, "length" : len });
		}
	}
	// 加入房间
	enter(event){
		if(event.target.className == "roomMask"){
			// 如果房间已经开始游戏，或者房间已满，返回
			var roomStr = event.target.getAttribute("data-room");
			if(this.props.rooms[roomStr].start || this.props.rooms[roomStr].length == this.props.rooms[roomStr].players.length){
				alert("该房间已满或正在游戏中");
				return;
			}
			//双击房间时，向服务端发送进入对战房间事件
			roomOperate({ "type" : "enter", "room" : roomStr });
		}
	}

	render(){
		return (
			<div id="main-content">
				<h2>房间</h2>
				<ul className="rooms" onDoubleClick={ this.enter.bind(this) }>
				{ Object.keys(this.props.rooms).map((room, key) => <RoomLi room={ this.props.rooms[room] } name={ room } key={ key }></RoomLi>) }
				</ul>
				<input type="button" className="createRoom" value="创建房间" onClick={this.create.bind(this)}/>
			</div>
		)
	}
}

//加工CounterContainer
Rooms = connect(
	(state)=>{
		return {
			rooms:state.indexReducer.rooms
		}
	},{
	}
)(Rooms);

export default Rooms;
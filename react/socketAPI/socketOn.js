import { updateRooms, updateCurrentRoom, updateUsers, outRoom, allMessage, roomMessage, changeGroup } from "../action/Action.js";
import { start, renderGuest, gameover } from "../container/BattleRoom.js";

const socket = io();

var hostGame = null;

// 接收到游戏指令
socket.on('gameOrder', function(order){
	switch(order.type){
		// 游戏开始，调用BattleRoom的start函数
		case 'start':
			hostGame = start();
			break;
		//对手游戏渲染指令
		case 'render':
			renderGuest(order);
			break;
		// 被别人使用了道具
		case 'daoju':
			if(order.upOrDown == "up"){
				hostGame.appendRows += order.sn;
			}else{
				hostGame.removeRows += order.sn;
			}
			break;
		// 本局游戏结束，激活准备按钮，删除表格
		case 'over':
			if(!gameover){
				hostGame.end();
			}
			if(order.winner){
				switch(order.winner){
					case "A":
					case "B":
					case "C":
						alert("恭喜" + order.winner + "组玩家获得胜利");
						break;
					default:
						alert("恭喜玩家" + order.winner + "获得胜利");
						break;
				}
			}
			$(".start input").attr("disabled", false).css("background", "-webkit-linear-gradient(top, white, #61CEED, white)");
			$("table").empty();
			break;
	}
});

// 收到所有房间信息
socket.on('allRooms', function(rooms){
	// 更新所有房间信息
	updateRooms(rooms);
});

// 收到所有在线玩家信息
socket.on('allUsers', function(JSON){
	// 更新所有在线玩家信息
	updateUsers(JSON);
});

// 房间操作结果
socket.on('roomOperateRslt', function(JSON){
	switch(JSON.type){
		// 房间名重复
		case "repeated":
			alert("该房间已存在");
			break;
		// 房间已满
		case "fullOrStart":
			alert("该房间已满或正在游戏中");
			break;
		// 重置分组
		case "resetGroup":
			changeGroup("Single");
			break;
	}
});

// 收到房内信息
socket.on('inRoom', function(room){
	// 更新所有房间信息
	updateCurrentRoom(room);
});

// 收到离开房间成功信息
socket.on('out', function(){
	// 更新所有房间信息
	outRoom();
});

// 断开链接
socket.on('disconnect', function(){
	window.location = "/";
});

// 收到消息
socket.on('message', function(JSON){
	// 根据消息的类型不同，做不同的事
switch(JSON.type){
	// 发送给所有人的
	case 'all':
		// 更新自己的大厅消息属性
		allMessage(JSON);
		break;
	// 发送给房内的
	case 'room':
		// 更新自己的房内消息属性
		roomMessage(JSON);
		break;
	// 单独发给自己的，预留接口
	case 'one':
		break;
}
});

export default socket;
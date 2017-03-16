import socket from './socketOn.js';

//将游戏信息发往服务端
export const sendGameInfo = (JSON) =>{
	socket.emit("gameOrder", JSON);
}

//发送进入平台的信息
export const come = (nickname) =>{
	socket.emit("coming", nickname);
}

//发送消息
export const sendMessage = (JSON) =>{
	socket.emit("message", JSON);
}

//发送房间操作的信息
export const roomOperate = (JSON) =>{
	socket.emit("roomOperate", JSON);
}

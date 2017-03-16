import {store} from "../main.js";
// import {roomOperate} from "../socketAPI/socketEmit.js";

//检查是否已登录
export const hasLogin = (cb) => (dispatch, getState) => {
	$.get("/isLogin", function(data){
		dispatch({...data, "type":"ISLOGIN"});
		cb(data);
	});
}

// 登录
export const checkLogin = (nickname, password, callback) => (dispatch, getState) =>{
	$.post("/checkLogin", {"nickname":nickname, "password":password}, function(data){
		if(data.result==1){
			dispatch({"type":"LOGIN", "nickname":nickname});
		}

		callback && typeof callback =="function" && callback(data);
	});
}

// 去注册
export const goLogup = () => (dispatch, getState) => {
	dispatch({"type":"GOLOGUP"});
}

//注册
export const logup = (nickname, password, callback) => (dispatch, getState) =>{
	$.post("/logup", {"nickname":nickname, "password":password}, function(data){
		if(data.result == 1){
			dispatch({"type":"LOGUP", "nickname":nickname});
		}

		callback && typeof callback =="function" && callback(data);
	});
}


/****************以下是socket调用的ACTION ****************************/

//更新所有房间
export const updateRooms = (rooms) =>{
	store.dispatch({ "type" : "UPDATEROOMS", "rooms" : rooms });
}

//更新在线玩家
export const updateUsers = (users) =>{
	store.dispatch({ "type" : "UPDATEUSERS", "users" : users });
}

//更新当前房间
export const updateCurrentRoom = (room) =>{
	store.dispatch({ "type" : "UPDATECURRENTROOM", "room" : room });
}

//离开当前房间
export const outRoom = () =>{
	store.dispatch({ "type" : "OUTROOM" });
}

// 改变分组
export const changeGroup = (group) => {
	store.dispatch({ "type" : "CHANGEGROUP", "group" : group });
}

// 改变分组
export const changeReady = (ready) => {
	store.dispatch({ "type" : "CHANGEREADY", "ready" : ready });
}

//收到发给所有人的消息
export const allMessage = (message) =>{
	store.dispatch({ "type" : "ALLMESSAGE", "message" : message });
}

//收到发给房内的消息
export const roomMessage = (message) =>{
	store.dispatch({ "type" : "ROOMMESSAGE", "message" : message });
}

/********************以下是游戏调用的ACTION***************/
// 获得道具
export const getDaoju = (arr) =>{
	store.dispatch({ "type" : "GETDAOJU", "daojuArr" : arr });
}

// 切换道具顺序
export const shiftDaoju = () => (dispatch, getState) =>{
	var dj = getState().indexReducer.daoju.slice(0);
	var item = dj.shift();
	dj.push(item);
	store.dispatch({ "type" : "SETDAOJU", "daoju" : dj });
}

// 使用道具
export const useDaoju = () => (dispatch, getState) =>{
	var dj = getState().indexReducer.daoju.slice(0);
	var item = dj.shift();
	store.dispatch({ "type" : "SETDAOJU", "daoju" : dj });
}

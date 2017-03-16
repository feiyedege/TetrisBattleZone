//reducer
export default (state,action) => {
	if(state === undefined){
		//这里就是默认的Redux Action
		return {
			"isLogin" : false,
			"goLogup" : false,
			"nickname" : null,
			"rooms" : {},
			"room" : null,
			"group" : "Single",
			"ready" : false,
			"allmessage" : [],
			"roommessage" : [],
			"users" : {},
			"daoju" : [1,2,3]
		};
	}

	//去注册
	if(action.type === "GOLOGUP"){
		return {
			...state,
			"goLogup" : true
		}
	}

	//注册成功
	if(action.type === "LOGUP"){
		return {
			...state,
			"isLogin" : true,
			"goLogup" : false,
			"nickname" : action.nickname
		}
	}

	//登录成功
	if(action.type === "LOGIN"){
		return{
			...state,
			"isLogin" : true,
			"nickname" : action.nickname
		}
	}

	//检查是否已经登录了
	if(action.type === "ISLOGIN"){
		return {
			...state,
			"nickname" : action.nickname,
			"isLogin" : action.isLogin
		}
	}

	// 改变分组
	if(action.type === "CHANGEREADY"){
		return{
			...state,
			"ready" : action.ready
		}
	}

	// 改变准备状态
	if(action.type === "CHANGEGROUP"){
		return{
			...state,
			"group" : action.group
		}
	}


/*****************以下是socket相关的ACTION*******************************/
	//更新所有房间
	if(action.type === "UPDATEROOMS"){
		return {
			...state,
			"rooms" : action.rooms
		}
	}

	//更新在线玩家
	if(action.type === "UPDATEUSERS"){
		return {
			...state,
			"users" : action.users
		}
	}

	//更新当前房间
	if(action.type === "UPDATECURRENTROOM"){
		return {
			...state,
			"room" : action.room
		}
	}

	//离开当前房间
	if(action.type === "OUTROOM"){
		return {
			...state,
			"room" : null,
			"roommessage" : [],
			"daoju" : [],
			"group" : "single",
			"ready" : false
		}
	}

	//收到给所有人的信息
	if(action.type === "ALLMESSAGE"){
		return {
			...state,
			"allmessage" : state.allmessage.concat(action.message)
		}
	}

	//收到给房内的信息
	if(action.type === "ROOMMESSAGE"){
		return {
			...state,
			"roommessage" : state.roommessage.concat(action.message)
		}
	}

/********************以下是游戏相关的*******************/
	// 获得道具
	if(action.type === "GETDAOJU"){
		return {
			...state,
			"daoju" : state.daoju.concat(action.daojuArr)
		}
	}

	// 设置道具
	if(action.type === "SETDAOJU"){
		return {
			...state,
			"daoju" : action.daoju
		}
	}
	

	

	return state;
}
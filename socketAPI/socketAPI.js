// 当前玩家在线玩家信息 users对象
// users对象的每一个属性名是一个socket.id，属性值是一个user对象
// user对象有
// "nickname"属性，玩家昵称，字符串
// "currentRoom"属性，玩家当前所在房间，字符串
// "ready"属性，玩家是否已经准备，布尔值
// "group"属性，表示玩家的分组，字符串
var users = {};

// 当前房间信息 rooms对象
// 对象的每一个属性名是一个房间名，属性值是一个room对象
// room对象有 
// "length"属性，表示房间人数要求，数字
// "readyCount"属性，表示已经准备的玩家人数，数字
// "players"属性，表示房间内的玩家，数组
// "start"属性，表示游戏是否开始，布尔值
var rooms = {};

function mysocket(socket, io){
	// 玩家进入大厅
	socket.on('coming', function(nickname){
		// 一旦有人进来，users初始化其信息
		users[this.id] = { "nickname" : nickname, "currentRoom" : null, "ready" : false, "group" : "Single" };
		// 把所有房间信息发给他
		socket.emit('allRooms', rooms);
		// 向所有玩家更新当前在线玩家的信息
		io.emit('allUsers', users);
		// 后台打印
		console.log("有人进来了，", this.id);
	});

	// 收到创建房间的事件
	socket.on('roomOperate', function(JSON){
		switch(JSON.type){
			// 创建房间
			case 'create':
				if(JSON.room in rooms){
					// 已经存在，向客户端发送事件
					socket.emit('roomOperateRslt', { "type" : "repeated" });
				}else{
					// 房间不存在，rooms初始化房间信息
					rooms[JSON.room] = { "length" : JSON.length, "readyCount" : 0, "players" : [ users[this.id] ], "start" : false };
					// 记录此玩家当前所在房间
					users[this.id].currentRoom = JSON.room;
					// 向所有玩家更新房间信息
					io.emit('allRooms', rooms);
					// 此socket加入该房间
					socket.join(JSON.room);
					// 向此玩家发送该房间信息
					socket.emit('inRoom', rooms[JSON.room]);
				}
				break;
			// 加入房间
			case 'enter':
				var theUser = users[this.id];
				if(!JSON.room){
					break;
				}
				var theRoom = rooms[JSON.room];
				// 如果房间没开始，且没满，让玩家加入
				if(!theRoom.start && theRoom.length > theRoom.players.length){
					// 更新theroom
					theRoom.players.push(theUser);
					// 更新theuser
					theUser.currentRoom = JSON.room;
					// 此socket加入该房间
					socket.join(JSON.room);
					// 向此房内所有玩家更新此房间信息
					io.in(JSON.room).emit('inRoom', theRoom);
					// 向所有玩家更新房间信息
					io.emit('allRooms', rooms);
				// 房间已满，不能加入
				}else{
					socket.emit('roomOperateRslt', { "type" : "fullOrStart" });
				}
				break;
			// 离开房间
			case 'leave':
				var theUser = users[this.id];
				var roomName = theUser.currentRoom;
				var theRoom = rooms[roomName];
				// 为了鲁棒
				if(!theRoom){
					break;
				}
				// 更新房间
				// 如果玩家离开时是准备状态，则readyCount减1
				if(theUser.ready){
					theRoom.readyCount--;
					theUser.ready = false;
				}
				// 从players数组中删除玩家
				theRoom.players.splice(theRoom.players.indexOf(theUser), 1);
				// 如果此时players的length为0，即房内没人了，删除该房间
				if(theRoom.players.length == 0){
					delete rooms[roomName];
				}
				// 向房内剩余玩家发送房内更新消息
				socket.to(roomName).emit('inRoom', theRoom);
				// 此socket离开房间
				socket.leave(roomName);
				// 更新玩家
				theUser.currentRoom = null;
				theUser.group = "Single";
				// 向所有玩家更新房间信息
				io.emit('allRooms', rooms);
				// 向此玩家发送离开成功信息
				socket.emit('out');
				if(theRoom.start){
					gameIsOver(theRoom, roomName);
				}
				break;
			// 玩家准备
			case 'ready':
				var theUser = users[this.id];
				var theRoom = rooms[theUser.currentRoom];
				// 更新玩家
				theUser.ready = true;
				// 更新此房间
				theRoom.readyCount++;
				// 如果所有玩家都准备了，发送游戏开始信息
				if(theRoom.length == theRoom.readyCount){
					// 更新房间start属性
					theRoom.start = true;
					io.in(theUser.currentRoom).emit('gameOrder', { "type" : "start" });
				}
				// 向此房内所有玩家更新此房间信息
				io.in(theUser.currentRoom).emit('inRoom', theRoom);
				// 向所有玩家更新房间信息
				io.emit('allRooms', rooms);
				break;
			case 'changeGroup':
				var theUser = users[this.id];
				var theRoom = rooms[theUser.currentRoom];
				// 如果游戏已经开始，不能改变分组
				if(theRoom.start){
					break;
				}
				// 更新玩家
				theUser.group = JSON.group;
				// 如果房间有多人，且满了，判断所有玩家是不是都在同一组，把"Singe"除外
				if(theRoom.length > 1 && theRoom.length == theRoom.players.length && theRoom.players[0].group != "Single"){
					for(var i = 1; i < theRoom.length; i++){
						if(theRoom.players[i].group != theRoom.players[i-1].group){
							break;
						}
					}
					// i等于房间长度，说明所有人分组相同
					if(i == theRoom.length){
						// 把所有人分组重置为"Single"
						for(var i = 0; i < theRoom.length; i++){
							theRoom.players[i].group = "Single";
						}
						// 向此房内所有玩家发送重置分组信息信息
						io.in(theUser.currentRoom).emit('roomOperateRslt', { "type" : "resetGroup" });
					}
				}
				// 向此房内所有玩家更新此房间信息
				io.in(theUser.currentRoom).emit('inRoom', theRoom);
				break;
		}
	});

	// 游戏事件
	socket.on('gameOrder', function(JSON){
		switch(JSON.type){
			// 传递游戏渲染指令
			case 'render':
				socket.to(users[this.id].currentRoom).emit("gameOrder", JSON);
				break;
			// 玩家游戏结束，需要改变玩家ready属性，并判断游戏是否结束
			case 'GameOver':
				var theUser = users[this.id];
				var theRoom = rooms[theUser.currentRoom];
				theUser.ready = false;
				// 如果房内长度为1
				if(theRoom.length == 1){
					// 更新房间属性
					theRoom.readyCount = 0;
					theRoom.start = false;
					// 向房内玩家更新该房信息
					io.in(theUser.currentRoom).emit('inRoom', theRoom);
					// 向所有玩家更新房间信息
					io.emit('allRooms', rooms);
					// 发送游戏结束信息
					socket.emit('gameOrder', { "type" : "over" });
				}else{
					gameIsOver(theRoom, theUser.currentRoom);
				}
				break;
			// 玩家使用道具
			case 'daoju':
				var theUser = users[this.id];
				var tbNick = JSON.tarObj;
				for(var k in users){
					if (users[k].nickname == tbNick){
						var tbID = k;
						break;
					}
				}
				if(theUser.group != "Single" && theUser.group == users[tbID].group){
					var upOrDownStr = "down";
				}else{
					var upOrDownStr = "up";
				}
				socket.to(tbID).emit('gameOrder', { "type" : "daoju", "upOrDown" : upOrDownStr, "sn" : JSON.sn });
				break;
		}
	});

	// 消息事件
	socket.on('message', function(JSON){
		// 根据消息类型，判断怎么传递消息
		switch(JSON.type){
			// 发送给所有人的
			case 'all':
				io.emit('message', JSON);
				break;
			// 发送给某房内的
			case 'room':
				var theUser = users[this.id];
				io.in(theUser.currentRoom).emit('message', JSON);
				break;
			// 发送给特定某人的
			case 'one':
				for(var k in users){
					if(users[k].nickname == JSON.one){
						socket.to(k).emit('message', JSON);
						break;
					}
				}
				break;
		}
	});

	// 玩家断开连接时
	socket.on('disconnect',function(){
		// 后台打印
		console.log("有人离开了，", this.id);
		// 判断此玩家是否coming过
		if(users[this.id]){
			// 获得离开玩家的信息对象
			var theUser = users[this.id];
			// 如果玩家离开时在某房间内
			if(theUser.currentRoom){
				var roomName = theUser.currentRoom
				var theRoom = rooms[roomName];
				if(theUser.ready){
					// 如果玩家断开时是准备状态，则readyCount减1
					theRoom.readyCount--;
				}
				// 从players数组中删除玩家
				theRoom.players.splice(theRoom.players.indexOf(theUser), 1);
				// 如果此时players的length为0，即房内没人了，删除该房间
				if(theRoom.players.length == 0){
					delete rooms[roomName];
				}
				// 向此房内所有玩家更新此房间信息
				io.in(roomName).emit('inRoom', theRoom);
				// 向所有玩家更新房间信息
				io.emit('allRooms', rooms);
				// 此socket离开房间
				socket.leave(theUser.currentRoom);
				if(theRoom.start){
					gameIsOver(theRoom, roomName);
				}
			}
			// 清除该玩家记录
			delete users[this.id];
			// 向所有玩家更新当前在线玩家的信息
			io.emit('allUsers', users);
		}
	});

	function gameIsOver(theRoom, roomName){
		var zubie = null;
		for(var i = 0; i < theRoom.players.length; i++){
			// 
			if(zubie){
				// 如果有两组玩家活着，表示游戏没结束
				if(theRoom.players[i].ready && theRoom.players[i].group != zubie){
					io.in(roomName).emit('inRoom', theRoom);
					return;
				}
			// 找到第一个还活着的玩家
			}else if(theRoom.players[i].ready){
				zubie = theRoom.players[i].group == "Single" ? "Single1" : theRoom.players[i].group;
			}
		}
		// 下面语句如果执行，表示游戏结束；判断获胜方，并重置玩家ready属性
		var winner = null;
		for(var i = 0; i < theRoom.players.length; i++){
			if(theRoom.players[i].ready){
				theRoom.players[i].ready = false;
				if(winner){
					continue;
				}
				winner = theRoom.players[i].group == "Single" ? theRoom.players[i].nickname : theRoom.players[i].group;
			}
		}
		// 更新房间属性
		theRoom.readyCount = 0;
		theRoom.start = false;
		// 向房内玩家更新该房信息
		io.in(roomName).emit('inRoom', theRoom);
		// 向所有玩家更新房间信息
		io.emit('allRooms', rooms);
		// 发送获胜方信息
		io.in(roomName).emit('gameOrder', { "type" : "over", "winner" : winner });
	}
}

module.exports = mysocket;
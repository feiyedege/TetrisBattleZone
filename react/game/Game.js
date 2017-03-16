import Block from "./Block.js";
import Map from "./Map.js";
import { sendGameInfo } from "../socketAPI/socketEmit.js";
import { GameOver } from "../container/BattleRoom.js";
import { getDaoju, changeReady } from "../action/Action.js";

//游戏类
var Game = function(tableid, scoreid, next1, next2){
	// 表格
	this.table = document.getElementById(tableid);
	// 下二个砖块的表格
	if(next1 && next2){
		this.next1 = document.getElementById(next1);
		this.next2 = document.getElementById(next2);
	}
	// 分数
	this.scoreDom = document.getElementById(scoreid);
	// 表格id，用于socket
	this.tableID=tableid;
	// 帧编号
	this.f = 0;
	// 转块
	this.block = [new Block(this), new Block(this), new Block(this)];
	this.block[0].ready();
	// 地图
	this.map = new Map(this);
	// 分数
	this.score = 0;
	// 道具分，满100就随机一个道具
	this.daojufen = 0;
	// 被人用道具减少行数
	this.removeRows = 0;
	// 被人用道具增加行数
	this.appendRows = 0;
	// 创建表格
	this.init();
}
//初始化
Game.prototype.init = function(){
	//创建20行，12列的表格
	for(var row = 0 ; row < 20 ; row++){
		var tr = document.createElement("tr");
		for(var col = 0 ; col < 12 ; col++){
			var td = document.createElement("td");
			// td.innerHTML = row + "," + col;
			//td上树
			tr.appendChild(td);
		}
		//tr上树
		this.table.appendChild(tr);
	}
	if(this.next1 && this.next2){
		//创建4行，4列的表格
		for(var row = 0 ; row < 4 ; row++){
			var tr = document.createElement("tr");
			for(var col = 0 ; col < 4 ; col++){
				var td = document.createElement("td");
				// td.innerHTML = row + "," + col;
				//td上树
				tr.appendChild(td);
			}
			//tr上树
			this.next1.appendChild(tr);
		}
		//创建4行，4列的表格
		for(var row = 0 ; row < 4 ; row++){
			var tr = document.createElement("tr");
			for(var col = 0 ; col < 4 ; col++){
				var td = document.createElement("td");
				// td.innerHTML = row + "," + col;
				//td上树
				tr.appendChild(td);
			}
			//tr上树
			this.next2.appendChild(tr);
		}
	}
}

//设置类名
Game.prototype.setClass = function(row, col, _class, table){
	if(Number(_class)){
		_class = "number" + _class
	}
	this[table].getElementsByTagName("tr")[row].getElementsByTagName("td")[col].className = _class;
}

//清屏
Game.prototype.clear = function(table, R, C){
	for(var row = 0 ; row < R ; row++){
		for(var col = 0 ; col < C ; col++){
			this.setClass(row, col, "", table);
		}
	}
}

// 渲染分数
Game.prototype.showScore = function(){
	this.scoreDom.innerHTML = "分数: " + this.score;
}

//获得道具
Game.prototype.getDaoju = function(arr){
	getDaoju(arr);
}
//绑定监听
Game.prototype.bindEvent = function(){
	var self = this;
	document.onkeydown = function(event){
		if(event.keyCode == 37){
			//左键
			if(!self.block[0].compare(self.map.cut(self.block[0].row, self.block[0].col - 1))){
				self.block[0].goLeft();
			}
		}else if(event.keyCode == 39){
			//右键
			if(!self.block[0].compare(self.map.cut(self.block[0].row, self.block[0].col + 1))){
				self.block[0].goRight();
			}
		}else if(event.keyCode == 40){
			//下键
			if(!self.block[0].compare(self.map.cut(self.block[0].row + 1, self.block[0].col))){
				self.block[0].goDown();
			}
		}else if(event.keyCode == 38){
			//上键，旋转
			if(!self.block[0].compare(self.map.cut(self.block[0].row,self.block[0].col),self.block[0].getNextDirectionMatrix())){
				self.block[0].rotate();
			}
		}else if(event.keyCode == 32){
			//空格键直接下落。
			while(!self.block[0].compare(self.map.cut(self.block[0].row + 1, self.block[0].col))){
				self.block[0].goDown();
			}

			document.getElementById("dropmusic").load();
			document.getElementById("dropmusic").play();
		}
	}
}
//开始定时器
Game.prototype.start = function(){
	document.getElementById("bgm").load();
	document.getElementById("bgm").play();
	this.bindEvent();
	var self = this;
	this.block[1].render("next1");
	this.block[2].render("next2");
	//定时器
	this.timer = setInterval(function(){
		//①帧编号++
		self.f ++;
		//②显示帧编号，方便我们调试，方便我们判断定时器此时在运行
		// document.getElementById("tip").innerHTML = "帧编号：" + self.f;
		// document.getElementById("hostScore").innerHTML = "我的分数：" + self.score;
		//③清屏
		self.clear("table", 20, 12);
		if(self.f % 5 == 0){
			// 被人用了减行道具
			if(self.removeRows){
				self.map.remove();
				self.removeRows--;
			}
			// 如果此时被敌人使用了道具，则尸体上升
			if(self.appendRows){
				self.appendRows--;
				self.map.append();
				// 上升后判断尸体与砖块是否重合，重合则砖块被顶上一行，并成为尸体
				if(self.block[0].compare(self.map.cut(self.block[0].row, self.block[0].col))){
					self.map.integrate(self.block[0].row - 1, self.block[0].col,self.block[0].matrix, self.block[0].type);
					//看看死的时候是不是死在了0行一下
					if(self.block[0].row -1 <= 0){
						// 游戏结束，最后渲染一帧
						self.map.render();
						self.end();
						sendGameInfo({ "type" : "GameOver" });
						return;
					}
					//死去吧，我们不要你了
					self.block.shift();
					self.block.push(new Block(self));
					self.block[0].ready();
					// 清空并重新渲染下二个方块
					self.clear("next1", 4, 4);
					self.clear("next2", 4, 4);
					self.block[1].render("next1");
					self.block[2].render("next2");
					//进行消行判定
					self.map.check();
				}
			}
		}
		//④渲染砖头
		if(self.f % 20 == 0){
			//现在我们要判断转块是否能够下落，对的，判断这个事儿写在Game类里面！
			//因为如果写在转块里面，此时转块势必要去获得Map的信息，此时砖头太过于智能，不好维护。
			if(!self.block[0].compare(self.map.cut(self.block[0].row + 1 , self.block[0].col))){
				self.block[0].goDown();
			}else{
				//融合！！！
				self.map.integrate(self.block[0].row,self.block[0].col,self.block[0].matrix,self.block[0].type);
				//看看死的时候是不是死在了0行一下
				if(self.block[0].row <= 0){
					// 游戏结束，最后渲染一帧
					self.map.render();
					self.end();
					sendGameInfo({ "type" : "GameOver" });
					return;
				}
				//死去吧，我们不要你了
				self.block.shift();
				self.block.push(new Block(self));
				self.block[0].ready();
				// 清空并重新渲染下二个方块
				self.clear("next1", 4, 4);
				self.clear("next2", 4, 4);
				self.block[1].render("next1");
				self.block[2].render("next2");
				//进行消行判定
				self.map.check();
			}
		}
		self.block[0].render("table");
		//⑤渲染地图（死去的转块）
		self.map.render();
		// 渲染分数
		self.showScore();
		//TODO:
		sendGameInfo({"type":"render", "id": self.tableID, "block":{"row":self.block[0].row,"col":self.block[0].col,"type":self.block[0].type,"matrix":self.block[0].matrix}, "map":{"matrix":self.map.matrix}, "score": self.score});

	},20);
	Game.prototype.end=function(){
		document.getElementById("bgm").pause();
		document.onkeydown = null;
		GameOver();
		clearInterval(this.timer);
		changeReady(false);
	}
}

export default Game;
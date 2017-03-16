
var Map = function(game){
	this.game=game;
	//@Array 矩阵
	this.matrix = [
		"QQ000000000000QQ",
		"QQ000000000000QQ",
		"QQ000000000000QQ",
		"QQ000000000000QQ",
		"QQ000000000000QQ",
		"QQ000000000000QQ",
		"QQ000000000000QQ",
		"QQ000000000000QQ",
		"QQ000000000000QQ",
		"QQ000000000000QQ",
		"QQ000000000000QQ",
		"QQ000000000000QQ",
		"QQ0000000I0000QQ",
		"QQ0000000I0000QQ",
		"QQ0000000I0000QQ",
		"QQ0000000I0000QQ",
		"QQ0000000I0000QQ",
		"QQ0000000A0000QQ",
		"QQ00000AAA0000QQ",
		"QQ000TTAAAA120QQ",
		"QQQQQQQQQQQQQQQQ",
		"QQQQQQQQQQQQQQQQ",
		"QQQQQQQQQQQQQQQQ",
		"QQQQQQQQQQQQQQQQ",
		"QQQQQQQQQQQQQQQQ"
	]
}
//渲染方法
Map.prototype.render = function(){
	//渲染20行12列，填写类名
	for(var row = 0 ; row < 20 ; row++){
		for(var col = 0 ; col < 12 ; col++){
			//得到这一位，加2的目的是修正左边的墙Q
			var char = this.matrix[row].charAt(col + 2);
			if(char != "0"){
				//渲染，填颜色
				this.game.setClass(row,col,char,"table");
			}
		}
	}
}
//切片方法
Map.prototype.cut = function(row,col){
	//这个函数接受行号、列号，
	//返回这里的4*4（一维数组["0000","00T0","000S","0000"]）
	var result = [];
	for(var i = row ; i < row + 4 ; i++){
		result.push(this.matrix[i].substr(2 + col ,4));
	}
	return result;
}
//“融入”方法，接受四个参数，行号、列号、十六进制数字、要替换为的类名
//比如传入3,6,0x6440,"L"   。  就表示,0x6440死在了3、6。此时请用"L"进行融合
//此时就要将这个人的尸体，融入地图的矩阵
Map.prototype.integrate = function(row,col,blockMatrix,classname){
	for(var i = 0 ; i < 4 ; i++){
		for(var j = 0; j < 4 ; j++){
			 borunqing(blockMatrix,i,j) == 1 && (this.matrix[row + i] = changeString(this.matrix[row + i] , col + j + 2 , classname));
		}
	}
}
//消行判定
Map.prototype.check = function(){
	var lines=0;
	for(var i = 19 ; i >= 0 ; i--){
		//如果这一行的字符串中没有0这个字符出现，就是满行
		if(this.matrix[i].indexOf("0") == -1){
			// 判断是否有道具，即是否有数字1,2,3
			var daojuArr = this.matrix[i].match(/\d/g);
			if(daojuArr){
				this.game.getDaoju(daojuArr);
			}
			// 删除这行
			this.matrix.splice(i,1);

			this.matrix.unshift("QQ000000000000QQ");
			lines++
			//这里我们跑一个题，
			i++;
		}
	}
	this.game.score += lines*lines*10;
	this.game.daojufen += lines*lines*10;
	// 看道具分过100了吗
	while(this.game.daojufen >= 100){
		this.daoju();
		this.game.daojufen -= 100;
	}
}

// 从下面增加1行灰块
Map.prototype.append = function(){
	var str=["QQ0A0A0A0A0A0AQQ", "QQA0A0A0A0A0A0QQ"][Math.round(Math.random())];
	// 最底行增加一行
	this.matrix.splice(20, 0, str);
	// 最上面弹出一行
	this.matrix.shift();
}

// 从下面减少1行灰块
Map.prototype.remove = function(){
	// 先判断最后一行有没有灰块
	if(this.matrix[19].indexOf("A") != -1){
		// 最底行删除一行
		this.matrix.splice(19,1);
		// 最上面增加一行
		this.matrix.unshift("QQ000000000000QQ");
	}
}

// 产生道具
Map.prototype.daoju = function(){
	// 先产生道具种类1,2,3
	var num = Math.ceil(Math.random()*3);
	// 产生一个随机列
	var djcol=Math.floor(Math.random()*12+2);
	// 用一个数组来记录空列，下次产生随机数过滤掉他
	var emptycol=[];
	// 找到这一列最上面的元素，变为道具元素
	var i = 0;
	while(true){
		while(emptycol.indexOf(djcol) != -1){
			djcol=Math.floor(Math.random()*12+2);
		}
		for(i=0; i<20; i++){
			if(this.matrix[i].charAt(djcol) != "0"){
				this.matrix[i] = changeString(this.matrix[i], djcol, num);
				break;
			}
		}
		if(i == 20){
			emptycol.push(djcol);
		}else{
			break;
		}
	}
}

//功能函数，薄润清大定理：一个方块0xabcd第m行第n个块的亮灭状态就是：
//(0xabcd >> (3 - m) * 4 & 0xf) >> (3-n) & 0x1
//请看笔记
function borunqing(fangkuai,hang,lie){
	return (fangkuai >> (3 - hang) * 4 & 0xf) >> (3 - lie) & 0x1;
}

//功能函数。这个函数的功能是接受一个字符串string，把这个字符串的第pos位变为chr
//比如changeString("我爱王俊凯",1,"很喜欢");
//返回"我很喜欢王俊凯";
function changeString(string,pos,chr){
	return string.substr(0,pos) + chr + string.substr(pos + 1)
}

export default Map;
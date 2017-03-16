
//砖块类，2017年1月21日11:30:39
var Block = function(game){
	this.game=game;
	//@String 随机一个形状，自己的形状是一个字母
	this.type = (["I","L","J","Z","S","O","T"])[parseInt(Math.random() * 7)]
	//@Array 自己拥有的所有形状矩阵，是一个携带16进制数字的数组
	this.allMatrix = getAllBlocks()[this.type];
	//@Number 自己的所有的方向总数
	this.allDirectionAmount = this.allMatrix.length;
	//@Number 自己的方向，随机一个。
	this.direction = parseInt(Math.random() * this.allDirectionAmount);
	//@Number(16) 自己的当前矩阵
	this.matrix = this.allMatrix[this.direction];
	//一个砖块是4*4的矩阵，此时砖块的位置，就是左上角的位置。
	this.row = 0;
	this.col = 0;
}
//下落
Block.prototype.ready = function(){
	this.col = 4;
}
//下落
Block.prototype.goDown = function(){
	this.row++;
}
//左边移动
Block.prototype.goLeft = function(){
	this.col--;
}
//右边移动
Block.prototype.goRight = function(){
	this.col++;
}
//旋转方法
Block.prototype.rotate = function(){
	//顺时针旋转一下
	this.direction ++;
	if(this.direction === this.allDirectionAmount){
		this.direction = 0;
	}
	//重新获得新的矩阵
	this.matrix = this.allMatrix[this.direction];
}
//返回下一个方向的矩阵方法，供Game类判断是否能够旋转使用，但是这个方法不是真的旋转
Block.prototype.getNextDirectionMatrix = function(){
	//试着给自己的方向加1，不是真假
	var _d = this.direction + 1;
	if(_d === this.allDirectionAmount){
		_d = 0;
	}
	return this.allMatrix[_d];
}

//渲染
Block.prototype.render = function(table){
	for(var i = 0 ; i < 4 ; i++){
		for(var j = 0 ; j < 4 ; j++){
			borunqing(this.matrix,i,j) && this.game.setClass(i + this.row, j + this.col, this.type, table);
		}
	}
}
//比对方法，接受一个这样的数组作为参数["0000","00T0","000S","0000"]
//与自己的Matrix进行比对，如果有冲突，就是说这一位都不是0，则函数返回true
//如果没有冲突返回false
//第二个参数是自己的矩阵，如果不传默认是自己的矩阵
Block.prototype.compare = function(arr,mymatrix){
	if(mymatrix === undefined){
		mymatrix = this.matrix;
	}
	//注意，此时有一个问题，我自己的矩阵形如0x0660，而传进来的是一个4个字符串的数组。
	for(var i = 0 ; i < 4 ; i++){
		for(var j = 0 ; j < 4 ; j++){
			//先得到我的矩阵的这一位的状态，要么0，要么1
			var myMatrixState = borunqing(mymatrix,i,j);
			//再得到传入的arr这一位的字符
			var arrChar = arr[i].charAt(j);
			//比对，看看是不是都是0
			if(arrChar != 0 && myMatrixState != 0){
				//冲突了
				return true;
			}
		}
	}
	return false;
}

//功能函数，注意它不是Block的方法，是一个零散的方法
function getAllBlocks(){
	return {
		"I" : [0x4444,0x0f00],
		"L" : [0x4460,0x0e80,0xc440,0x2e00],
		"J" : [0x44c0,0x8e00,0x6440,0x0e20],
		"Z" : [0x0c60,0x4c80],
		"S" : [0x06c0,0x8c40],
		"O" : [0x0660],
		"T" : [0x0e40,0x4c40,0x4e00,0x4640]
	}
}

//功能函数，薄润清大定理：一个方块0xabcd第m行第n个块的亮灭状态就是：
//(0xabcd >> (3 - m) * 4 & 0xf) >> (3-n) & 0x1
//请看笔记
function borunqing(fangkuai,hang,lie){
	return (fangkuai >> (3 - hang) * 4 & 0xf) >> (3 - lie) & 0x1;
}

export default Block;
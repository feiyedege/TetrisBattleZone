import React, { Component } from 'react';
import { connect } from 'react-redux';

class Help extends Component{

	componentDidMount(){

	}

	render(){
		return (
			<div id="main-content">
				<h2>游戏说明</h2>
				<ul className="helpme">
					<li>消除得分每满100会获得一次随机道具（1,2,3）</li>
					<li>对敌军使用道具，可使目标增加道具数字的行数的灰块</li>
					<li>对友军使用道具，可使目标减少道具数字的行数的灰块</li>
					<li>Tab键可以切换道具的顺序，</li>
					<li>按键盘上的数字1-6给对应的玩家使用道具栏最左边的道具，自己是1号玩家</li>
					<li>4个方向键控制方块，上箭头是旋转</li>
					<li>空格键方块直接沉底</li>
				</ul>
			</div>
		)
	}
}

//加工CounterContainer
Help = connect(
	(state)=>{
		return {
		}
	},{
	}
)(Help);

export default Help;
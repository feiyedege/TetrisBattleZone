import React, {Component} from "react";
import {connect} from 'react-redux';

class EnemyLi extends Component{

	componentDidMount(){

	}

	render(){
		return (
			<li style={{ "background": this.props.player.ready ? "#256A67" : "gray" }}>
				<h3 className="enInfo" style={{ "background": this.props.groupColor(this.props.player.group) }} >{ this.props.player.nickname } <i id={ this.props.player.nickname + "score" }>分数：0</i></h3>
				<table id={ this.props.player.nickname }></table>
			</li>
		)
	}
}

//加工CounterContainer
EnemyLi = connect(
	(state)=>{
		return {
		}
	},{

	}
)(EnemyLi);

export default EnemyLi;
import React, {Component} from "react";
import {connect} from 'react-redux';

class RoomLi extends Component{

	componentDidMount(){

	}

	render(){
		return (
			<li className="room">
				<ul>
					{ this.props.room.players.map((user, key) => <li key={ key }>{ user.nickname } <b style={{ "display" : user.ready ? "block" : "none" }}></b></li>)}
				</ul>
				<img src="/img/gears.gif" style={{"display" : this.props.room.start ? "block" : "none" }}/>
				<div className="roomMask" data-room={ this.props.name }>
					房间名: { this.props.name }
					<br/>
					人数: { this.props.room.length }
				</div>
			</li>
		)
	}
}

//加工CounterContainer
RoomLi = connect(
	(state)=>{
		return {
			rooms:state.indexReducer.rooms
		}
	},{

	}
)(RoomLi);

export default RoomLi;
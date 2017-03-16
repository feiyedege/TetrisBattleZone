import React, {Component} from "react";
import {connect} from 'react-redux';
import {Link} from 'react-router';

class Aside extends Component{

	componentDidMount(){
		var self=this;
		// 进入游戏后，点击侧边栏失效，只能先退出战斗房间
		$(".sideMenu").click(function(event){
			var t=event.target;
			if(self.props.room){
				return false
			}
		});
	}

	render(){
		return (
			<aside className="leftSide">
				<ul className="sideMenu">
					<li className="side-help">
						<Link to="help" activeClassName="active">
							游戏说明
						</Link>
					</li>
					<li className="side-rooms">
						<Link to="rooms" activeClassName="active">
							房间
						</Link>
					</li>
					<li className="side-alluser">
						<Link to="alluser" activeClassName="active">
							当前在线玩家
						</Link>
					</li>
					{ /*未进入房间时，即room为null时，战斗项不显示*/ }
					<li className="side-battle" style={{ display : this.props.room ? "block" : "none" }}>
						<Link to="battle" activeClassName="active">
							战斗
						</Link>
					</li>
				</ul>
			</aside>
		)
	}
}

//加工CounterContainer
Aside = connect(
	(state)=>{
		return {
			room:state.indexReducer.room
		}
	},{}
)(Aside);

export default Aside;
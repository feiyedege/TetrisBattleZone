import React, {Component} from "react";
import {connect} from 'react-redux';

class DaojuLi extends Component{

	componentDidMount(){

	}

	render(){
		return (
			<li className={ "djItem" + this.props.type }>
			</li>
		)
	}
}

//加工CounterContainer
DaojuLi = connect(
	(state)=>{
		return {
		}
	},{

	}
)(DaojuLi);

export default DaojuLi;
import React from "react";
import { connect } from 'react-redux';
import { Link } from 'react-router';
 
var Records = () => {

	//预备的东西，圆括号里面没有东西
	return (
		<div>
			<div id="main-content">
				<h2>个人战绩</h2>
			</div>
		</div>
	)
}

//加工CounterContainer
Records = connect(
	(state)=>{
		return {
		}
	},{
	}
)(Records);

export default Records;
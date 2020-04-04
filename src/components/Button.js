import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Button extends Component {
	render() {
		return (
			<div>
				<button onClick={this.props.onClick} className={this.props.large ? "button large" : "button"}>
					{this.props.label} {this.props.icon && <FontAwesomeIcon icon={this.props.icon} />}
				</button>
			</div>
		);
	}
}

export default Button;

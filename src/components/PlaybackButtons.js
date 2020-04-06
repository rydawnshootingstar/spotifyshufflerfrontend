import React, { Component, Fragment } from "react";
import Button from "./Button";
import { faBackward, faForward, faPauseCircle, faPlay } from "@fortawesome/free-solid-svg-icons";

/*
    pass onclicks to buttons 
*/

class PlaybackButtons extends Component {
	render() {
		return (
			<div className={"player-controls"}>
				<Button onClick={this.props.previous} large icon={faBackward} />
				<Button onClick={this.props.play} large icon={faPlay} />
				<Button onClick={this.props.next} large icon={faForward} />
			</div>
		);
	}
}

export default PlaybackButtons;

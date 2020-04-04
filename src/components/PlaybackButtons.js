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
				<Button large icon={faBackward} />
				<Button large icon={faPlay} />
				<Button large icon={faForward} />
			</div>
		);
	}
}

export default PlaybackButtons;

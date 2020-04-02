import React, { Component } from "react";

import PlayButton from "./PlayButton";
import NextButton from "./NextButton";
import PrevButton from "./PrevButton";
import ShuffleButton from "./ShuffleButton";

class Player extends Component {
	render() {
		const { tracks, loading } = this.props;
		return (
			<div className={"player-container"}>
				<div className={"player"}>
					<div className={"player-controls"}>
						<PrevButton />
						<PlayButton playing />
						<NextButton />
					</div>

					{loading ? (
						<div>loading...</div>
					) : (
						<div className={"track-list"}>
							{tracks.map((track, index) => (
								<p key={index}>{track}</p>
							))}
						</div>
					)}

					<div className={"player-footer"}></div>
				</div>
			</div>
		);
	}
}

export default Player;

import React, { Component } from "react";

class Player extends Component {
	render() {
		const { tracks, loading } = this.props;
		return (
			<div className={"player-container"}>
				<div className={"player"}>
					<div className={"player-controls"}>header</div>

					{loading ? (
						<div>loading...</div>
					) : (
						<div className={"track-list"}>
							{tracks.map(track => (
								<p>{track}</p>
							))}
						</div>
					)}

					<div className={"player-footer"}>footer</div>
				</div>
			</div>
		);
	}
}

export default Player;

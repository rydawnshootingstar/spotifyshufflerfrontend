import React, { Component } from "react";

import PlaybackButtons from "./PlaybackButtons";
import SongDetail from "./SongDetail";

class Player extends Component {
	state = {
		nowPlaying: {},
		playing: false
	};

	render() {
		const { tracks, loading } = this.props;
		console.log(this.state.nowPlaying);
		return (
			<div className={"player-container"}>
				{this.state.nowPlaying.id && <SongDetail song={this.state.nowPlaying} />}
				<div className={"player"}>
					<PlaybackButtons />

					{loading ? (
						<div>loading...</div>
					) : (
						<div className={"track-list"}>
							{tracks.map((track, index) => (
								<p key={index} onClick={() => this.setState({ nowPlaying: track })}>
									{track.title || "no title"} {track.artist || "unknown artist"}{" "}
									{track.duration / 1000 / 60 || "unknown length"}
								</p>
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

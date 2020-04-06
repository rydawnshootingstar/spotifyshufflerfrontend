import React, { Component } from "react";
import axios from "axios";

import PlaybackButtons from "./PlaybackButtons";
import SongDetail from "./SongDetail";

class Player extends Component {
	state = {
		nowPlaying: {},
		playing: false,
		user: this.props.user
	};

	playButton = () => {
		const authString = this.state.user.authString;
		//https://api.spotify.com/v1/me/player/devices

		axios
			.post(
				`https://api.spotify.com/v1/me/player/queue?uri=spotify:track:${this.state.nowPlaying.id}`,
				"noDataNecessary",
				{
					headers: { Authorization: authString }
				}
			)
			.then(res => console.log("response from added", res));
	};

	prevButton = () => {
		const authString = this.state.user.authString;
		axios
			.post(`https://api.spotify.com/v1/me/player/previous`, "noDataNecessary", {
				headers: { Authorization: authString }
			})
			.then(res => console.log("response from prev", res));
	};

	nextButton = () => {
		const authString = this.state.user.authString;
		axios
			.post(`https://api.spotify.com/v1/me/player/next`, "noDataNecessary", {
				headers: { Authorization: authString }
			})
			.then(res => console.log("response from next", res));
	};

	render() {
		const { tracks, loading } = this.props;
		console.log(this.state.nowPlaying);
		return (
			<div className={"player-container"}>
				{this.state.nowPlaying.id && <SongDetail song={this.state.nowPlaying} />}
				<div className={"player"}>
					<PlaybackButtons previous={this.prevButton} next={this.nextButton} play={this.playButton} />

					{loading ? (
						<div>loading...</div>
					) : (
						<div className={"track-list"}>
							{tracks.map((track, index) => (
								<p className={"track"} key={index} onClick={() => this.setState({ nowPlaying: track })}>
									<span className={"track-title"}>{track.title || "no title"}</span>{" "}
									<span className={"track-artist"}>{track.artist || "unknown artist"} </span>
									<span className={"track-duration"}>{track.duration / 1000 / 60 || "unknown length"}</span>
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

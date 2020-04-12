import React, { Component } from "react";
import axios from "axios";

import { faPlus, faMinus, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import PlaybackButtons from "./PlaybackButtons";
import SongDetail from "./SongDetail";

class Player extends Component {
	state = {
		nowPlaying: {},
		playing: false,
		user: this.props.user,
		nextTrack: ""
	};

	componentDidUpdate(prevProps, prevState) {}

	addTrackButton = () => {
		const authString = this.state.user.authString;
		const { nextTrack } = this.state;

		//https://api.spotify.com/v1/me/player/devices

		if (nextTrack === "") {
			setTimeout(
				this.addTrackButton,

				1000
			);
		}

		axios
			.post(`https://api.spotify.com/v1/me/player/queue?uri=spotify:track:${nextTrack}`, "noDataNecessary", {
				headers: { Authorization: authString }
			})
			.then(res => {
				this.setState = { nextTrack: "" };
			});
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

		return (
			<div className={"player-container"}>
				{this.state.nowPlaying.id && <SongDetail song={this.state.nowPlaying} />}
				<div className={"player"}>
					<PlaybackButtons previous={this.prevButton} next={this.nextButton} play={this.nextButton} />

					{loading ? (
						<div>loading...</div>
					) : (
						<div className={"track-list"}>
							{tracks.map((track, index) => (
								<p className={"track"} key={index}>
									<span className={"track-title"}>{track.title || "no title"}</span>{" "}
									<span className={"track-artist"}>{track.artist || "unknown artist"} </span>
									<span className={"track-duration"}>{track.duration / 1000 / 60 || "unknown length"}</span>
									<span>
										{" "}
										<FontAwesomeIcon
											style={{ cursor: "pointer" }}
											onClick={() => {
												this.setState({ nowPlaying: track, nextTrack: track.id });

												this.addTrackButton();
											}}
											icon={faPlus}
										/>
									</span>
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

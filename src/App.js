import React, { Component } from "react";
import "reset-css/reset.css";
import "./App.css";
import queryString from "query-string";
import axios from "axios";
import dummyData from "./dummydata";

import Player from "./components/Player";

const devMode = false;

// TODO: move authString to state, stop passing it
class App extends Component {
	constructor() {
		super();
		this.state = {
			likedTracks: devMode ? dummyData : [],
			wholeSongs: [],
			playlists: [],
			likedDone: devMode ? true : false,
			playlistsDone: devMode ? true : false,
			inProgressReqs: devMode ? false : true
		};
	}

	getLikedTracksAt = (url, authString) => {
		let allLikedTracks = this.state.likedTracks || [];
		let wholeSongs = this.state.wholeSongs || [];
		axios
			.get(url, { headers: { Authorization: authString } })
			.then(res => {
				res.data.items.forEach(({ track }) => {
					//console.log("liked track", track);
					wholeSongs.push({
						id: track.id,
						title: track.name,
						artist: track.artists[0].name,
						duration: track.duration_ms,
						images: track.album.images
					});
					//allLikedTracks.push(track.id);
				});
				if (res.data.next) {
					this.getLikedTracksAt(res.data.next, authString);
				}
				this.setState({ wholeSongs });
			})
			.catch(err => {
				console.error(err);
			});
	};

	getLikedAlbumsAt = (url, authString) => {
		let allLikedTracks = this.state.likedTracks || [];
		let wholeSongs = this.state.wholeSongs || [];
		axios
			.get(url, { headers: { Authorization: authString } })
			.then(res => {
				res.data.items.forEach(item => {
					//console.log("liked album", item);
					item.album.tracks.items.forEach(song => {
						//console.log(song.id, song.name, song.artists[0].name, song.duration, song.images);
						wholeSongs.push({
							id: song.id,
							title: song.name,
							artist: song.artists[0].name,
							duration: song.duration_ms,
							images: item.album.images
						});
					});
				});

				if (res.data.next) {
					this.getLikedAlbumsAt(res.data.next, authString);
				}
				this.setState({ wholeSongs, likedDone: true });
			})
			.catch(err => console.error(err));
	};

	getPlaylists = (url, authString) => {
		let playlists = this.state.playlists || [];
		axios
			.get(url, { headers: { Authorization: authString } })
			.then(res => {
				res.data.items.forEach(item => {
					playlists.push(item.id);
				});

				if (res.data.next) {
					this.getPlaylists(res.data.next, authString);
				}
				this.setState({ playlists });
				this.getTracksFromPlaylists(authString);
			})
			.catch(err => console.error(err));
	};

	getTracksFromPlaylists = authString => {
		this.state.playlists.forEach(playlist => {
			this.getPlaylistAt(`https://api.spotify.com/v1/playlists/${playlist}/tracks?offset=0&limit=100`, authString);
		});
	};

	// users with a lot of playlists may need to wait a while so that the rate limited requests can have time to resend
	// this isn't perfect, it would probably be a better idea to send them in batches, wait a while, then send more
	// to avoid failures in the first place
	getPlaylistAt = (url, authString) => {
		let allLikedTracks = this.state.likedTracks || [];
		let wholeSongs = this.state.wholeSongs || [];
		axios
			.get(url, {
				headers: { Authorization: authString }
			})
			.then(res => {
				res.data.items.forEach(({ track }) => {
					//console.log("liked playlist track", track);
					wholeSongs.push({
						id: track.id,
						title: track.name,
						artist: track.artists[0].name,
						duration: track.duration_ms,
						images: track.album.images
					});
				});
				if (res.data.next) {
					this.getPlaylistAt(res.data.next, authString);
				}
				if (this.state.inProgressReqs == false) {
					this.setState({ wholeSongs, playlistsDone: true });
				}
			})
			.catch(err => {
				if (err.response.status === 429) {
					this.setState({ inProgressReqs: true });
					const waitTime = parseInt(err.response.headers["retry-after"]) * 10000 + 1000;
					setTimeout(() => {
						this.getPlaylistAt(err.request.responseURL, authString);
						this.setState({ inProgressReqs: false });
					}, waitTime);
				}
			});
	};

	constructShufflePlaylists = () => {};

	async componentDidMount() {
		let parsed = queryString.parse(window.location.search);
		let accessToken = parsed.access_token;
		if (!accessToken) return;

		let authString = `Bearer ${accessToken}`;

		fetch("https://api.spotify.com/v1/me", {
			headers: { Authorization: authString }
		})
			.then(response => response.json())
			.then(data =>
				this.setState({
					user: {
						name: data.display_name,
						id: data.id,
						accessToken,
						authString
					}
				})
			);

		if (!devMode) {
			// TODO: change these to async, and setState HERE instead of inside the functions, aim to make these pure functions
			this.getLikedTracksAt("https://api.spotify.com/v1/me/tracks?offset=0&limit=50", authString);
			this.getLikedAlbumsAt("https://api.spotify.com/v1/me/albums?limit=50&offset=0", authString);
			this.getPlaylists("https://api.spotify.com/v1/me/playlists?offset=0&limit=50", authString);
		}
	}
	render() {
		//console.log(this.state.likedTracks.length);
		//console.log(this.state.playlists.length);
		const { user, likedDone, playlistsDone } = this.state;
		if (user && likedDone && playlistsDone) {
			//console.log(this.state.likedTracks);
			//console.log("total songs for this user=", this.state.wholeSongs.length);
			console.log("this should fire once");
		}

		return (
			<div className="App">
				{this.state.user && this.state.user.id ? (
					<div>
						<h1 style={{ fontSize: "54px", marginTop: "5px" }}>{this.state.user.name}</h1>
						<Player
							user={this.state.user}
							ready={this.state.playlistsDone && this.state.likedDone}
							tracks={this.state.wholeSongs}
						/>
					</div>
				) : (
					<button
						onClick={() => {
							window.location = window.location.href.includes("localhost")
								? "http://localhost:8888/login"
								: "https://spotoauthbridge.herokuapp.com/login";
						}}
						style={{ padding: "20px", fontSize: "50px", marginTop: "20px" }}
					>
						Sign in with Spotify
					</button>
				)}
			</div>
		);
	}
}

export default App;

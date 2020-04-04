import React, { Component } from "react";

class SongDetail extends Component {
	render() {
		console.log("song", this.props.song);
		return (
			<div className={"songDetailContainer"}>
				<div className={"boxShadow"}>
					<div className={"outline"}>
						<div className={"art"}>
							<img height={"300px"} width={"300px"} src={this.props.song.images[1].url} />
						</div>
					</div>
				</div>
				<span>
					<div className={"songTitle"}>{this.props.song.title}</div>
					<div className={"artistName"}>{this.props.song.artist}</div>
				</span>
				<div className={"progressBar"}>
					<span className={"fill"}></span>
				</div>
			</div>
		);
	}
}

export default SongDetail;

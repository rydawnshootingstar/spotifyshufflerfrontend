import React, {Component} from 'react';

class App extends Component{

    constructor() {
        super();
        this.state = {
          serverData: {},
          filterString: ''
        }
      }

      getProfile = ()=> {
        fetch('https://api.spotify.com/v1/me', {
            headers: {'Authorization': 'Bearer ' + accessToken}
          }).then(response => response.json())
          .then(data => this.setState({
            user: {
              name: data.display_name
            }
          }))
      }

      getPlaylists = ()=> {
          
      }

    componentDidMount(){
         // anything after the ? in our URL
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    
    if (!accessToken){
      return;
    }
  


    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(playlistData => {
      let playlists = playlistData.items
      let trackDataPromises = playlists.map(playlist => {
        let responsePromise = fetch(playlist.tracks.href, {
          headers: {'Authorization': 'Bearer ' + accessToken}
        })
        let trackDataPromise = responsePromise
          .then(response => response.json())
        return trackDataPromise
      })
      let allTracksDataPromises = 
        Promise.all(trackDataPromises)
      let playlistsPromise = allTracksDataPromises.then(trackDatas => {
        trackDatas.forEach((trackData, i) => {
          playlists[i].trackDatas = trackData.items
            .map(item => item.track)
            .map(trackData => ({
              name: trackData.name,
              duration: trackData.duration_ms / 1000
            }))
        })
        return playlists
      })
      return playlistsPromise
    })
    .then(playlists => this.setState({
      playlists: playlists.map(item => {
        return {
          name: item.name,
          imageUrl: item.images[0].url, 
          songs: item.trackDatas.slice(0,3)
        }
    })
    }))

    }

    render(){
        return (
            <div>

            </div>
        )
    }
}

export default App;
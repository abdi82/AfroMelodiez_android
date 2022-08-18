import { actionTypes } from "../actions/actionTypes";
import { SONGS_BASE_URL, VIDEOS_BASE_URL, SONGS_IMAGE_BASE_URL, PODCASTS_EPISODES_BASE_URL, PODCASTS_EPISODE_IMAGES_BASE_URL } from "../../constants/globalConstants";
import TrackPlayer, { RepeatMode, useProgress } from "react-native-track-player";
import { imagePath } from "../../constants/imagePath";

export const initialState = {
    userData: {},
    accessToken: '',
    advertisements: [],
    isPlayerMinimized: false,
    currentPlaylist: [],
    playCount: 0,
    currentTrackIndex: 0,
    isPlaying: false,
    likedSongsIds: [],
    likedPodcastsIds: [],
    userSettings: {},
    isShuffle: false,
    repeatMode: RepeatMode.Off,
    isInternetConnected: true,
    downloadedSongs: [],
}

const reducer = (state = initialState, action) => {
    let objState = { ...state }
    switch (action.type) {
        case actionTypes.USER_DATA:
            objState.userData = action.payload
            return objState;
        case actionTypes.ACCESS_TOKEN:
            objState.accessToken = action.payload
            return objState;
        case actionTypes.MINIMIZE_PLAYER:
            objState.isPlayerMinimized = action.payload
            if (action.payload == true) {
                objState.playCount = 2
            }
            return objState;
        case actionTypes.CHANGE_PLAYLIST:
            objState.playCount = 1
            let playlist = [...action.payload.playlist]
            let newIndex = action.payload.initialIndex
            let isDownload = action.payload.isDownload
            let tracks = []
            if (isDownload) {
                tracks = playlist.map((item, index) => {
                    return {
                        id: item.id,
                        url: item.url,
                        type: 'default',
                        title: item.name,
                        album: 'My Album',
                        artist: 'Not available',
                        image: imagePath.dummySong,
                        artwork: imagePath.dummySong,
                        isDownload: true
                    }
                })
            }
            else {
                tracks = playlist.map((item, index) => {
                    let artistName = (item && item.artist_id) ? item.artist_id.name : 'Dummy artist'
                    if (item.featuring && item.featuring.length > 0) {
                        console.log('Featuring artist is', item.featuring)
                        for (var iSong = 0; iSong < item.featuring.length; iSong++) {
                            console.log('This is the song', iSong)
                            console.log('Featured artist is', item.featuring[iSong])
                            if (item.featuring[iSong]) {
                                let featuredArtistName = item.featuring[iSong].name
                                if (iSong == 0) {
                                    artistName = artistName + ' feat. ' + featuredArtistName
                                }
                                else {
                                    artistName = artistName + ', ' + featuredArtistName
                                }
                            }
                        }
                    }
                    console.log('Item is ', item)
                    return {
                        id: item.id,
                        url: item.isPodcast ? PODCASTS_EPISODES_BASE_URL + item.episode : SONGS_BASE_URL + item.song,
                        videoURL: VIDEOS_BASE_URL + item.video,
                        type: 'default',
                        title: item.isPodcast ? item.title : (item.name || 'Song1'),
                        album: 'My Album',
                        artistDetails: typeof (item.artist_id) == 'number' ? {} : !item.isPodcast && item.artist_id ? { ...item.artist_id } : { name: item.name },
                        artist: !item.isPodcast && item.artist_id ? artistName : 'Dummy Artist',
                        image: item.isPodcast ? PODCASTS_EPISODE_IMAGES_BASE_URL + item.image : SONGS_IMAGE_BASE_URL + item.song_image,
                        artwork: item.isPodcast ? PODCASTS_EPISODE_IMAGES_BASE_URL + item.image : SONGS_IMAGE_BASE_URL + item.song_image,
                        lyrics: !item.isPodcast && item.lyrics && item.lyrics,
                        liked: !item.isPodcast && item.liked && [...item.liked],
                        isPodcast: item.isPodcast == 1 ? true : false,
                        isDownload: false,
                        duration: parseInt(item.duration)
                    }
                })
            }
            objState.isPlaying = true
            objState.currentPlaylist = tracks
            objState.currentTrackIndex = newIndex
            objState.isPlayerMinimized = false
            return objState;
        case actionTypes.SET_ADVERTISMENTS:
            if (action.payload) {
                objState.advertisements = [...action.payload]
            }
            return objState;
        case actionTypes.UPDATE_TRACK_INDEX:
            objState.currentTrackIndex = action.payload
            return objState;
        case actionTypes.CHANGE_PLAYER_STATE:
            objState.isPlaying = action.payload
            return objState;
        case actionTypes.LOGOUT_USER:
            TrackPlayer.destroy()
            let objResetState = Object.assign({}, {
                userData: {},
                accessToken: '',
                advertisements: [],
                isPlayerMinimized: false,
                currentPlaylist: [],
                playCount: 0,
                currentTrackIndex: 0,
                isPlaying: false
            })
            return objState = { ...objResetState }
        case actionTypes.ADD_SONG_TO_QUEUE:
            let currentSongList = [...objState.currentPlaylist]
            let song = action.payload
            currentSongList.push({
                id: song.id,
                url: song.isPodcast ? PODCASTS_EPISODES_BASE_URL + song.episode : SONGS_BASE_URL + song.song,
                videoURL: VIDEOS_BASE_URL + song.video,
                type: 'default',
                title: song.isPodcast ? song.title : (song.name || 'Song1'),
                album: 'My Album',
                artistDetails: typeof (song.artist_id) == 'number' ? {} : !song.isPodcast && song.artist_id ? { ...song.artist_id } : { name: song.name },
                artist: !song.isPodcast && song.artist_id ? song.artist_id.name : 'Dummy Artist',
                image: song.isPodcast ? PODCASTS_EPISODE_IMAGES_BASE_URL + song.image : SONGS_IMAGE_BASE_URL + song.song_image,
                artwork: song.isPodcast ? PODCASTS_EPISODE_IMAGES_BASE_URL + song.image : SONGS_IMAGE_BASE_URL + song.song_image,
                lyrics: !song.isPodcast && song.lyrics && song.lyrics,
                liked: !song.isPodcast && song.liked && [...song.liked],
                isPodcast: song.isPodcast == 1 ? true : false,
                isDownload: false,
                duration: parseInt(song.duration)
            })
            objState.currentPlaylist = currentSongList
            return objState;
        case actionTypes.SET_LIKED_SONGS:
            let arrServerSongs = [...action.payload]
            let arrIds = arrServerSongs.map((item, index) => {
                return item.id
            })
            objState.likedSongsIds = arrIds
            return objState;
        case actionTypes.LIKE_UNLIKE_SONG:
            let arrLikedSongsIds = [...objState.likedSongsIds]
            let idInPayload = action.payload
            if (arrLikedSongsIds.includes(idInPayload)) {
                arrLikedSongsIds = arrLikedSongsIds.filter((item, index) => {
                    return item != idInPayload
                })
            }
            else {
                arrLikedSongsIds.push(idInPayload)
            }
            objState.likedSongsIds = arrLikedSongsIds
            return objState;
        case actionTypes.SET_LIKED_PODCASTS:
            let serverPodcasts = [...action.payload]
            let arrPodcastIds = serverPodcasts.map((item, index) => {
                return item.id
            })
            objState.likedPodcastsIds = arrPodcastIds
            return objState;
        case actionTypes.LIKE_UNLIKE_PODCAST:
            let arrLikedPodcastsIds = [...objState.likedPodcastsIds]
            let payloadId = action.payload
            if (arrLikedPodcastsIds.includes(payloadId)) {
                arrLikedPodcastsIds = arrLikedPodcastsIds.filter((item, index) => {
                    return item != payloadId
                })
            }
            else {
                arrLikedPodcastsIds.push(payloadId)
            }
            objState.likedPodcastsIds = arrLikedPodcastsIds
            return objState;
        case actionTypes.SET_USER_SETTINGS:
            let userSettings = { ...action.payload }
            objState.userSettings = userSettings
            return objState;
        case actionTypes.EXTEND_PLAYLIST:
            let currentPlayingSongs = [...objState.currentPlaylist]
            let songsInPayload = [...action.payload]
            currentPlayingSongs = currentPlayingSongs.concat(songsInPayload)
            objState.currentPlaylist = currentPlayingSongs
            return objState;
        case actionTypes.TOGGLE_SHUFFLE:
            objState.isShuffle = action.payload
            return objState;
        case actionTypes.TOGGLE_REPEAT_MODE:
            objState.repeatMode = action.payload
            return objState;
        case actionTypes.SET_CURRENT_INTERNET_STATUS:
            objState.isInternetConnected = action.payload
            return objState;
        case actionTypes.SET_DOWNLOADED_SONGS:
            objState.downloadedSongs = action.payload
            return objState
        case actionTypes.ADD_DOWNLOADED_SONG:
            let downloadedSongsInState = [...objState.downloadedSongs]
            downloadedSongsInState.push(action.payload)
            objState.downloadedSongs = downloadedSongsInState
            return objState
        case actionTypes.REMOVE_DOWNLOADED_SONG:
            let allDownloadedSongs = [...objState.downloadedSongs]
            allDownloadedSongs = allDownloadedSongs.filter(iSong => {
                return iSong.name != action.payload.name
            })
            objState.downloadedSongs = allDownloadedSongs
            return objState
        default:
            return objState;
    }
};

export default reducer;
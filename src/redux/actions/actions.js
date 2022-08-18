import { actionTypes } from "./actionTypes";

export const setUserData = (data) => ({
    type: actionTypes.USER_DATA,
    payload: data
})

export const setAccessToken = (token) => ({
    type: actionTypes.ACCESS_TOKEN,
    payload: token
})

export const minimizePlayer = (isPlayerMinimized) => ({
    type: actionTypes.MINIMIZE_PLAYER,
    payload: isPlayerMinimized
})

export const changePlaylist = (playlist, initialIndex, isPodcast, isDownload) => ({
    type: actionTypes.CHANGE_PLAYLIST,
    payload: {
        playlist: playlist,
        initialIndex: initialIndex,
        isPodcast: isPodcast || false,
        isDownload: isDownload
    }
})

export const advertisments = (data) => ({
    type: actionTypes.SET_ADVERTISMENTS,
    payload: data
})

export const setTrackIndex = (index) => ({
    type: actionTypes.UPDATE_TRACK_INDEX,
    payload: index
})

export const logoutUser = (data) => ({
    type: actionTypes.LOGOUT_USER,
    payload: data
})

export const changePlayerState = (isPlaying) => ({
    type: actionTypes.CHANGE_PLAYER_STATE,
    payload: isPlaying
})

export const addSongToQueue = (song) => ({
    type: actionTypes.ADD_SONG_TO_QUEUE,
    payload: song
})

export const setLikedSongs = (songs) => ({
    type: actionTypes.SET_LIKED_SONGS,
    payload: songs
})

export const likeUnlikeSong = (songId) => ({
    type: actionTypes.LIKE_UNLIKE_SONG,
    payload: songId
})

export const likeUnlikePodcast = (podcastId) => ({
    type: actionTypes.LIKE_UNLIKE_PODCAST,
    payload: podcastId
})

export const setLikedPodcasts = (podcasts) => ({
    type: actionTypes.SET_LIKED_PODCASTS,
    payload: podcasts
})

export const playPausePodcast = (state) => ({
    type: actionTypes.PLAY_PAUSE_PODCAST,
    payload: state
})

export const setUserSettings = (settings) => ({
    type: actionTypes.SET_USER_SETTINGS,
    payload: settings
})

export const extendPlaylist = (songs) => ({
    type: actionTypes.EXTEND_PLAYLIST,
    payload: songs
})

export const toggleShuffle = (isShuffle) => ({
    type: actionTypes.TOGGLE_SHUFFLE,
    payload: isShuffle
})

export const changeRepeatMode = (repeatMode) => ({
    type: actionTypes.TOGGLE_REPEAT_MODE,
    payload: repeatMode
})

export const setCurrentInternetStatus = (status) => ({
    type: actionTypes.SET_CURRENT_INTERNET_STATUS,
    payload: status
})

export const setDownloadedSongs = (songs) => ({
    type: actionTypes.SET_DOWNLOADED_SONGS,
    payload: songs
})

export const addDownloadedSong = (song) => ({
    type: actionTypes.ADD_DOWNLOADED_SONG,
    payload: song
})

export const removeDownloadedSong = (song) => ({
    type: actionTypes.REMOVE_DOWNLOADED_SONG,
    payload: song
})
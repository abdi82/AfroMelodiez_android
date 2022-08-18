import React, { useState, useEffect } from 'react'
import { View, Share, StyleSheet, Modal, PermissionsAndroid, BackHandler } from 'react-native'
import { PlayControls } from '../Components/PlayControls';
import { useRoute } from '@react-navigation/native';
import { connect, useDispatch } from 'react-redux';
import { useBackButton, windowHeight, windowWidth, eSongListType, SONGS_BASE_URL } from '../constants/globalConstants';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { colors } from '../constants/colors';
import { navigationStrings } from '../navigation/navigationStrings';
import { minimizePlayer, playSong, setTrackIndex, changePlayerState, likeUnlikeSong } from '../redux/actions/actions';
import Feather from 'react-native-vector-icons/Feather'
import LinearGradient from 'react-native-linear-gradient';

const PlaySong = (props) => {
    const route = useRoute()
    const isPlaylist = route.params.isPlaylist ? route.params.isPlaylist : false
    const isVideo = route.params.isVideo ? route.params.isVideo : false

    const dispatch = useDispatch()

    const handleBackButton = () => {
        if (props.navigation.isFocused()) {
            if (!isVideo) {
                dispatch(minimizePlayer(true))
            }
            props.navigation.goBack()
            return true;
        }
    }

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            handleBackButton
        )
        // dispatch(minimizePlayer(false))
        return () => backHandler.remove();
    }, [])

    const changePlayerView = (bool) => {
        dispatch(minimizePlayer(bool))
    }

    const updateTrackIndex = (index) => {
        if (index) {
            dispatch(setTrackIndex(index))
        }
        else {
            dispatch(setTrackIndex(0))
        }
    }

    const updatePlayingState = (value) => {
        dispatch(changePlayerState(value))
    }

    const likeUnlikeSongPress = (id) => {
        dispatch(likeUnlikeSong(id))
    }

    return (
        <View style={styles.fullScreenContainer}>
            <PlayControls userPlaylists={props.userPlaylists} likeUnlikeSong={(id) => { likeUnlikeSongPress(id) }} likedSongs={props.likedSongs} header={route.params.header} isPlaying={props.isPlaying} setIsPlaying={(value) => { updatePlayingState(value) }} updateIndex={(index) => { updateTrackIndex(index) }} currentIndex={props.currentTrackIndex} playCount={props.playCount} isVideo={isVideo} changePlayerState={changePlayerView} currentPlaylist={props.currentPlaylist} isMinimized={props.isPlayerMinimized} userData={props.userData} isPlaylist={isPlaylist} token={props.accessToken} />
        </View>
    )
}

const mapStateToProps = (state) => {
    return { userData: state.userData, accessToken: state.accessToken, isPlayerMinimized: state.isPlayerMinimized, currentPlaylist: state.currentPlaylist, playCount: state.playCount, currentTrackIndex: state.currentTrackIndex, isPlaying: state.isPlaying, likedSongs: state.likedSongsIds, userPlaylists: state.userPlaylists }
}

export default connect(mapStateToProps)(PlaySong)

const styles = StyleSheet.create({
    fullScreenContainer: { flex: 1, backgroundColor: colors.black, alignItems: 'center', padding: 15, paddingTop: 0 },
    likeModalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0)' },
    likeModalInnerContainer: { height: windowHeight * 0.6, width: windowWidth, alignItems: 'center', justifyContent: 'flex-start', marginTop: 50 },
})

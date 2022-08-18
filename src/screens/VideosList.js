import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text, FlatList, Image, TextInput, TouchableOpacity, StyleSheet, ImageBackground, BackHandler } from 'react-native'
import { commonStyles } from '../constants/commonStyles';
import { navigationStrings } from '../navigation/navigationStrings';
import { imagePath } from '../constants/imagePath';
import { colors } from '../constants/colors';
import DropDownPicker from 'react-native-dropdown-picker'
import { MainHeader2 } from '../Components/MainHeader2';
import { apiHandler } from '../constants/apiHandler';
import { windowWidth, ARTISTS_IMAGE_BASE_URL, SONGS_IMAGE_BASE_URL, eSongListType, windowHeight } from '../constants/globalConstants';
import { connect, useDispatch } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { SingleSong } from '../Components/SingleSong';
import { minimizePlayer, changePlaylist, setTrackIndex, advertisments, changePlayerState, setUserData, setAccessToken, likeUnlikeSong } from '../redux/actions/actions';
import { PlayControls } from '../Components/PlayControls';
import LinearGradient from 'react-native-linear-gradient';

const VideosList = (props) => {


    const [videos, setVideos] = useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        const getInitialData = () => {
            const token = props.accessToken
            apiHandler.getPopularVideos(token).then(popularVideos => {
                setVideos(popularVideos)
            })
        }
        getInitialData()
    }, [])


    const handleBackButton = () => {
        if (props.navigation.canGoBack()) {
            props.navigation.goBack()
        }
    }

    const onSongPress = (index) => {
        dispatch(changePlaylist(videos, index, false, false))
        props.navigation.navigate(navigationStrings.PlaySong, { songDetails: videos, isPlaylist: true, isVideo: true, header: 'Popular Videos', initialIndex: index, video: 0 })
    }

    const renderSingleVideo = ({ item, index }) => {
        return <SingleSong isVideo={true} key={index} marginBottom={index == videos.length - 1 && props.isPlayerMinimized} songDetails={item} onSongPress={() => onSongPress(index)} rightIcon={false} />
    }

    const keyExtractor = useCallback((item) => { item.id.toString() }, [])

    const renderSongsList = () => {
        return <View style={styles.songsListFullContainer}>
            < FlatList
                data={videos}
                renderItem={renderSingleVideo}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false} />
        </View>
    }

    const onBackPress = () => {
        props.navigation.goBack()
    }

    const updatePlayingState = (value) => {
        dispatch(changePlayerState(value))
    }

    const maximizePlayer = () => {
        dispatch(minimizePlayer(false))
        props.navigation.navigate(navigationStrings.PlaySong, { songDetails: props.currentSong })
    }

    const updateTrackIndex = (index) => {
        dispatch(setTrackIndex(index))
    }

    const likeUnlikeSongPress = (id) => {
        dispatch(likeUnlikeSong(id))
    }

    return (
        <View style={commonStyles.fullScreenContainerBlack(props.isPlayerMinimized)}>
            <LinearGradient
                style={commonStyles.linearGradientStyle}
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                colors={['#0727ce77', '#0727ce55', '#0727ce33', '#0727ce11', '#0727ce11', '#0727ce22', '#0727ce44', '#0727ce66', '#0727ce99']}
            />
            <MainHeader2 leftImage={imagePath.backIcon} onLeftIconPress={onBackPress} headerPrimaryTitle={'Popular Videos'} />
            {/* <Image style={styles.songsContainerImage} source={{ uri: SONGS_IMAGE_BASE_URL + containerDetails.image }} /> */}
            <View style={commonStyles.flexFull}>
                {renderSongsList()}
            </View>
            {
                (props.isPlayerMinimized) && <PlayControls likeUnlikeSong={(id) => { likeUnlikeSongPress(id) }} likedSongs={props.likedSongs} isPlaying={props.isPlaying} setIsPlaying={(value) => { updatePlayingState(value) }} updateIndex={(index) => { updateTrackIndex(index) }} currentIndex={props.currentTrackIndex} currentPlaylist={props.currentPlaylist} playCount={props.playCount} changePlayerState={maximizePlayer} isMinimized={props.isPlayerMinimized} userData={props.userData} token={props.accessToken} />
            }
        </View>
    )
}

const mapStateToProps = (state) => {
    return { userData: state.userData, accessToken: state.accessToken, likedSongs: state.likedSongsIds, isPlayerMinimized: state.isPlayerMinimized, currentPlaylist: state.currentPlaylist, playCount: state.playCount, advertisements: state.advertisements, currentTrackIndex: state.currentTrackIndex, isPlaying: state.isPlaying }
}

export default connect(mapStateToProps)(VideosList)

const styles = StyleSheet.create({
    songsListFullContainer: { flex: 1, width: windowWidth, marginTop: 10 },
    songsContainerImage: { height: 200, width: windowWidth * 0.9, alignSelf: 'center' },
    singleSongFullContainer: { flexDirection: 'row', alignItems: 'center', width: windowWidth * 0.9, minHeight: 100, marginLeft: 10 },
    singleSongInnerContainer: { flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginLeft: 10 },
})

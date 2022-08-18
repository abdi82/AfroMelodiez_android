import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ImageBackground, Share, BackHandler } from 'react-native'
import { commonStyles } from '../constants/commonStyles';
import { navigationStrings } from '../navigation/navigationStrings';
import { imagePath } from '../constants/imagePath';
import { colors } from '../constants/colors';
import DropDownPicker from 'react-native-dropdown-picker'
import { MainHeader2 } from '../Components/MainHeader2';
import { apiHandler } from '../constants/apiHandler';
import { windowWidth, ARTISTS_IMAGE_BASE_URL, SONGS_IMAGE_BASE_URL, eSongListType, CATEGORIES_BASE_URL, SONGS_BASE_URL, VIDEOS_BASE_URL, windowHeight } from '../constants/globalConstants';
import { connect, useDispatch } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { SingleSong } from '../Components/SingleSong';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { minimizePlayer, changePlaylist, setTrackIndex, advertisments, changePlayerState, setUserData, setAccessToken, likeUnlikeSong, addSongToQueue } from '../redux/actions/actions';
import { PlayControls } from '../Components/PlayControls';
import SongOptionsModal from '../Components/SongOptionsModal';
import { LoadingComponent } from '../Components/LoadingComponent';
import LinearGradient from 'react-native-linear-gradient';

const SongsByPlaylist = (props) => {

    const route = useRoute()

    const playlistDetails = route?.params?.data ? route.params.data : {}
    const [isLiked, setIsLiked] = useState(false)
    const [showOptions, setShowOptions] = useState(false)
    const [currentSong, setCurrentSong] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useDispatch()

    const getInitialData = () => {
        setIsLoading(true)
        const playlistId = playlistDetails.id
        apiHandler.getFavouritePlaylists(props.accessToken, props.userData.id).then(favouritePlaylists => {
            if (favouritePlaylists.findIndex(val => {
                return val.id == playlistId
            }) != -1) {
                setIsLiked(true)
            }
            setIsLoading(false)
        })
    }

    useEffect(() => {
        // const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton)
        getInitialData()
        // return () => backHandler.remove()
    }, [])


    const handleBackButton = () => {
        if (props.navigation.canGoBack()) {
            props.navigation.goBack()
        }
    }

    const onSongPress = (index) => {
        dispatch(changePlaylist(playlistDetails.song, index, false, false))
        props.navigation.navigate(navigationStrings.PlaySong, { songDetails: playlistDetails.song, isPlaylist: true, header: `Songs for ${playlistDetails.name}`, initialIndex: index })
    }

    const onShowOptionsPress = (song) => {
        setCurrentSong(song)
        setShowOptions(true)
    }

    const renderSingleSong = ({ item, index }) => {
        return <SingleSong marginBottom={index == playlistDetails.song.length - 1 && props.isPlayerMinimized} key={index} onShowOptionsPress={(song) => { onShowOptionsPress(song) }} songDetails={item} onSongPress={() => onSongPress(index)} />
    }

    const keyExtractor = useCallback((item) => { item.id.toString() }, [])

    const renderSongsList = () => {
        return <View style={[styles.songsListFullContainer, { paddingVertical: 0 }]}>
            < FlatList
                data={playlistDetails.song}
                renderItem={renderSingleSong}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false} />
        </View>
    }

    const handleOptionsClick = async (id) => {
        setShowOptions(false)
        switch (id) {
            case 0:
                onLikePress()
                break;
            case 1:
                Share.share({
                    message: 'Share ' + currentTrack.title,
                    url: 'http://bam.tech',
                    title: 'Share songs via Afro Melodies'
                }, {
                    // Android only:
                    dialogTitle: 'Share BAM goodness',
                    // iOS only:
                    excludedActivityTypes: [
                        'com.apple.UIKit.activity.PostToTwitter'
                    ]
                })
                break;
            case 2:
                setShowPlaylists(true)
                break;
            case 3:
                requestToPermissions()
                break;
            case 4:
                navigation.navigate(navigationStrings.SongsList, { data: currentSong && currentSong.artist, songListType: eSongListType.Artist })
                break;
            case 5:
                await TrackPlayer.add({
                    id: currentSong.id,
                    url: SONGS_BASE_URL + currentSong.song,
                    // url: 'https://music.nvinfobase.com/storage/song/Ed-Sheeran-Photograph-Mybestfeelings.com_.mp3',
                    videoURL: VIDEOS_BASE_URL + currentSong.video,
                    type: 'default',
                    title: currentSong.name || 'Song1',
                    album: 'My Album',
                    artist: currentSong.artist_id ? { ...currentSong.artist_id } : {},
                    image: SONGS_IMAGE_BASE_URL + currentSong.song_image,
                    artwork: SONGS_IMAGE_BASE_URL + currentSong.song_image,
                    lyrics: currentSong.lyrics,
                    lrc: 'https://music.nvinfobase.com/storage/song/lrc/EdSheeran-PhotographbyEdSheeran.lrc'
                })
                dispatch(addSongToQueue(currentSong))
                break;
            default:
                break;
        }
    }

    const showHideOptions = () => {
        setShowOptions(!showOptions)
    }

    const onBackPress = () => {
        props.navigation.goBack()
    }

    const onLikeUnlikePlaylistPress = async () => {
        let reqObj = {
            user_id: props.userData.id,
            playlist_id: playlistDetails.id
        }
        switch (isLiked) {
            case true:
                await apiHandler.unlikePlaylist(props.accessToken, reqObj)
                setIsLiked(false)
                break;
            case false:
                await apiHandler.addFavoritePlaylist(props.accessToken, reqObj)
                setIsLiked(true)
                break;
            default:
                break;
        }
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
        isLoading ? <LoadingComponent isVisible={isLoading} />
            :
            <View style={commonStyles.fullScreenContainerBlack(props.isPlayerMinimized)}>
                <LinearGradient
                    style={commonStyles.linearGradientStyle}
                    start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                    colors={['#ffffff77', '#ffffff55', '#ffffff33', '#ffffff11', '#ffffff11', '#ffffff22', '#ffffff44', '#ffffff66', '#ffffff99']}
                />
                <MainHeader2 leftImage={imagePath.backIcon} onLeftIconPress={onBackPress} headerPrimaryTitle={''} />
                <View style={commonStyles.flexFull}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: windowWidth - 40, alignSelf: 'center', paddingVertical: 15 }}>
                        {/* <Text style={commonStyles.textLightNormal(18)}>
                        {'Listened ' + albumsDetails.played + ' times last month'}
                    </Text> */}
                        <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                            <Text style={commonStyles.textWhiteBold(24)}>
                                {playlistDetails.name}
                            </Text>
                            {/* <TouchableOpacity onPress={onPlayArtistPress} style={{ height: 40, width: 40, borderRadius: 20, marginRight: 10, backgroundColor: colors.green, justifyContent: 'center', alignItems: 'center' }}>
                                <Ionicons name='play' style={{ fontSize: 25, color: colors.black }} />
                            </TouchableOpacity> */}
                            {/* <TouchableOpacity onPress={onPlayArtistPress} style={{ height: 40, width: 40, borderRadius: 20, backgroundColor: colors.green, justifyContent: 'center', alignItems: 'center' }}> */}
                            <FontAwesome onPress={onLikeUnlikePlaylistPress} name={!isLiked ? 'heart-o' : 'heart'} style={{ fontSize: 25, color: isLiked ? colors.green : colors.white }} />
                            {/* </TouchableOpacity> */}
                        </View>
                    </View>
                    {renderSongsList()}
                </View>
                <SongOptionsModal isVisible={showOptions} closeModal={showHideOptions} onSingleIconPress={(title) => { handleOptionsClick(title) }} songDetails={currentSong} userId={props.userData.id} />
                {
                    (props.isPlayerMinimized) && <PlayControls likeUnlikeSong={(id) => { likeUnlikeSongPress(id) }} likedSongs={props.likedSongs} isPlaying={props.isPlaying} setIsPlaying={(value) => { updatePlayingState(value) }} updateIndex={(index) => { updateTrackIndex(index) }} currentIndex={props.currentTrackIndex} currentPlaylist={props.currentPlaylist} playCount={props.playCount} changePlayerState={maximizePlayer} isMinimized={props.isPlayerMinimized} userData={props.userData} token={props.accessToken} />
                }
            </View>
    )
}

const mapStateToProps = (state) => {
    return { userData: state.userData, accessToken: state.accessToken, likedSongs: state.likedSongsIds, isPlayerMinimized: state.isPlayerMinimized, currentPlaylist: state.currentPlaylist, playCount: state.playCount, advertisements: state.advertisements, currentTrackIndex: state.currentTrackIndex, isPlaying: state.isPlaying }
}

export default connect(mapStateToProps)(SongsByPlaylist)

const styles = StyleSheet.create({
    songsListFullContainer: { flex: 1, width: windowWidth - 40, marginTop: 20 },
    songsContainerImage: { height: 300, width: windowWidth, alignSelf: 'center' },
    singleSongFullContainer: { flexDirection: 'row', alignItems: 'center', width: windowWidth * 0.9, minHeight: 100, marginLeft: 10 },
    singleSongInnerContainer: { flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginLeft: 10, alignItems: 'center' },
})

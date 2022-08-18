import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text, FlatList, Image, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Modal, Share, BackHandler } from 'react-native'
import { commonStyles } from '../constants/commonStyles';
import { navigationStrings } from '../navigation/navigationStrings';
import { imagePath } from '../constants/imagePath';
import { colors } from '../constants/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { MainHeader2 } from '../Components/MainHeader2';
import { apiHandler } from '../constants/apiHandler';
import { windowWidth, ARTISTS_IMAGE_BASE_URL, SONGS_IMAGE_BASE_URL, eSongListType, windowHeight, VIDEOS_BASE_URL, SONGS_BASE_URL } from '../constants/globalConstants';
import { connect, useDispatch } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { SingleSong } from '../Components/SingleSong';
import { minimizePlayer, changePlaylist, setTrackIndex, advertisments, changePlayerState, setUserData, setAccessToken, addSongToQueue, likeUnlikeSong } from '../redux/actions/actions';
import { PlayControls } from '../Components/PlayControls';
import { LoadingComponent } from '../Components/LoadingComponent';
import SongOptionsModal from '../Components/SongOptionsModal';
import TrackPlayer from 'react-native-track-player';
import { Swipeable } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import LinearGradient from 'react-native-linear-gradient';

const MixSongs = (props) => {

    const route = useRoute()
    const dispatch = useDispatch()
    const [songs, setSongs] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [showOptions, setShowOptions] = useState(false)
    const [currentSong, setCurrentSong] = useState({})
    const [showLikeModal, setShowLikeModal] = useState(false)
    const headerTitle = route.params.headerTitle || 'Songs'

    const isMyPlaylist = route.params.isMyPlaylist || false
    const playlistSongs = route.params.playlistSongs || []
    const playlistDetails = route.params.playlistDetails || {}

    const handleBackButton = () => {
        if (props.navigation.canGoBack()) {
            props.navigation.goBack()
        }
    }

    const getInitialData = async () => {
        if (!isMyPlaylist) {
            setIsLoading(true)
            const token = props.accessToken
            const songs = headerTitle == 'Mix Songs' ? await apiHandler.getMixSongs(token)
                : headerTitle == 'Popular Songs' ? await apiHandler.getMostPlayedSongs(token)
                    : await apiHandler.getTrendingSongs(token)
            setSongs(songs)
            setIsLoading(false)
        }
        else {
            setSongs(playlistSongs)
        }
    }

    useEffect(() => {
        // const backHandler = BackHandler.addEventListener(
        // "hardwareBackPress",
        // handleBackButton
        // )
        getInitialData()
        // return () => backHandler.remove();
    }, [])

    const onSongPress = (index) => {
        dispatch(changePlaylist(songs, index, false, false))
        props.navigation.navigate(navigationStrings.PlaySong, { songDetails: songs, isPlaylist: true, header: 'Mix Songs', initialIndex: index })
    }

    const onShowOptionsPress = (song) => {
        setCurrentSong(song)
        setShowOptions(true)
    }

    const onRemoveSongPress = async (item) => {
        let reqObj = {
            songID: item.id,
            user_id: props.userData.id,
            playlistID: playlistDetails.id
        }
        let currentSongs = [...songs]
        currentSongs = currentSongs.filter(iSong => {
            return iSong.id !== item.id
        })
        setSongs(currentSongs)
        await apiHandler.deleteSongFromPlaylist(props.accessToken, reqObj)
    }

    const renderRightIcons = (item) => {
        return <TouchableOpacity style={{ height: 60, width: 60, justifyContent: 'center', alignItems: 'center', marginTop: 10 }} onPress={() => { onRemoveSongPress(item) }}>
            <MaterialCommunityIcons name='delete' style={{ color: '#ff0000', fontSize: 35 }} />
        </TouchableOpacity>
    }

    const renderSingleSong = ({ item, index }) => {
        return isMyPlaylist ?
            <Swipeable renderRightActions={() => {
                return renderRightIcons(item)
            }}>
                <SingleSong key={index} marginBottom={index == songs.length - 1 && props.isPlayerMinimized} onShowOptionsPress={(song) => { onShowOptionsPress(song) }} songDetails={item} onSongPress={() => onSongPress(index)} />
            </Swipeable>
            :
            <SingleSong key={index} marginBottom={index == songs.length - 1 && props.isPlayerMinimized} onShowOptionsPress={(song) => { onShowOptionsPress(song) }} songDetails={item} onSongPress={() => onSongPress(index)} />
    }

    const keyExtractor = useCallback((item) => { item.id.toString() }, [])

    const renderSongsList = () => {
        return <View style={styles.songsListFullContainer}>
            < FlatList
                data={songs}
                renderItem={renderSingleSong}
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

    const onLikePress = async () => {
        if (!currentSong.liked.includes(props.userData.id)) {
            let reqObj = {
                userID: props.userData.id,
                songID: currentSong.id
            }
            setShowLikeModal(true)
            setTimeout(() => {
                setShowLikeModal(false)
            }, 1000);
            const res = await apiHandler.saveLikedSong(props.accessToken, reqObj)
        }
        else {
            let reqObj = {
                userID: props.userData.id,
                songID: currentSong.id
            }
            const res = await apiHandler.unlikeSong(props.accessToken, reqObj)
        }
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
                <MainHeader2 leftImage={imagePath.backIcon} onLeftIconPress={onBackPress} headerPrimaryTitle={headerTitle} />
                {/* <Image style={styles.songsContainerImage} source={{ uri: SONGS_IMAGE_BASE_URL + containerDetails.image }} /> */}
                <View style={commonStyles.flexFull}>
                    {renderSongsList()}
                </View>
                {
                    (props.isPlayerMinimized) && <PlayControls likeUnlikeSong={(id) => { likeUnlikeSongPress(id) }} likedSongs={props.likedSongs} isPlaying={props.isPlaying} setIsPlaying={(value) => { updatePlayingState(value) }} updateIndex={(index) => { updateTrackIndex(index) }} currentIndex={props.currentTrackIndex} currentPlaylist={props.currentPlaylist} playCount={props.playCount} changePlayerState={maximizePlayer} isMinimized={props.isPlayerMinimized} userData={props.userData} token={props.accessToken} />
                }
                <SongOptionsModal isVisible={showOptions} closeModal={showHideOptions} onSingleIconPress={(title) => { handleOptionsClick(title) }} songDetails={currentSong} userId={props.userData.id} />
                <Modal transparent={true} visible={showLikeModal}>
                    <View style={styles.likeModalContainer}>
                        <View style={styles.likeModalInnerContainer}>
                            <FontAwesome name='heart' size={250} color={colors.green} />
                        </View>
                    </View>
                </Modal>
            </View>
    )
}

const mapStateToProps = (state) => {
    return { userData: state.userData, accessToken: state.accessToken, isPlayerMinimized: state.isPlayerMinimized, currentPlaylist: state.currentPlaylist, playCount: state.playCount, advertisements: state.advertisements, currentTrackIndex: state.currentTrackIndex, isPlaying: state.isPlaying, likedSongs: state.likedSongsIds }
}

export default connect(mapStateToProps)(MixSongs)

const styles = StyleSheet.create({
    songsListFullContainer: { flex: 1, width: windowWidth, marginTop: 10 },
    songsContainerImage: { height: 200, width: windowWidth * 0.9, alignSelf: 'center' },
    singleSongFullContainer: { flexDirection: 'row', alignItems: 'center', width: windowWidth * 0.9, minHeight: 100, marginLeft: 10 },
    singleSongInnerContainer: { flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginLeft: 10 },
    likeModalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0)' },
    likeModalInnerContainer: { height: windowHeight * 0.6, width: windowWidth, alignItems: 'center', justifyContent: 'flex-start', marginTop: 50 },
})

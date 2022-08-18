import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, FlatList, StyleSheet, Share } from 'react-native'
import { commonStyles } from '../constants/commonStyles';
import { navigationStrings } from '../navigation/navigationStrings';
import { imagePath } from '../constants/imagePath';
import { colors } from '../constants/colors';
import { apiHandler } from '../constants/apiHandler';
import { windowWidth, SONGS_IMAGE_BASE_URL, eSongListType, SONGS_BASE_URL, VIDEOS_BASE_URL, windowHeight } from '../constants/globalConstants';
import { connect, useDispatch } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { SingleSong } from '../Components/SingleSong';
import { minimizePlayer, changePlaylist, setTrackIndex, changePlayerState, likeUnlikeSong, addSongToQueue } from '../redux/actions/actions';
import { PlayControls } from '../Components/PlayControls';
import LinearGradient from 'react-native-linear-gradient'
import { LoadingComponent } from '../Components/LoadingComponent';
import TrackPlayer from 'react-native-track-player';
import SongOptionsModal from '../Components/SongOptionsModal';
import { MainHeader2 } from '../Components/MainHeader2';

const SongsByCategory = (props) => {

    const route = useRoute()

    const routeDetails = route.params.data
    // const [containerDetails, setContainerDetails] = useState({})
    const [songs, setSongs] = useState([])
    // const [isLiked, setIsLiked] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    // const [isFollowed, setIsFollowed] = useState(false)
    const [showOptions, setShowOptions] = useState(false)
    const [currentSong, setCurrentSong] = useState({})

    const backgroundColor = routeDetails.bg_color == '#000000' ? colors.green : routeDetails.bg_color

    const dispatch = useDispatch()

    const getInitialData = () => {
        setIsLoading(true)
        const categoryId = routeDetails.id
        apiHandler.getSongsByCategory(props.accessToken, categoryId).then(categorySongs => {
            setSongs(categorySongs.data)
            setIsLoading(false)
        })
    }

    useEffect(() => {
        // const backhandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton)
        getInitialData()
        // return () => backhandler.remove()
    }, [])

    const handleBackButton = () => {
        if (props.navigation.canGoBack()) {
            props.navigation.goBack()
        }
    }

    // const checkFollowStatus = (artistDetails) => {
    //     let userId = props.userData.id
    //     if (artistDetails.followers && artistDetails.followers.includes(userId.toString())) {
    //         return true
    //     }
    //     return false
    // }

    const onSongPress = (index) => {
        dispatch(changePlaylist(songs, index, false, false))
        props.navigation.navigate(navigationStrings.PlaySong, { songDetails: songs, isPlaylist: true, header: `Songs for ${routeDetails.name}`, initialIndex: index })
    }

    const onShowOptionsPress = (song) => {
        setCurrentSong(song)
        setShowOptions(true)
    }

    const renderSingleSong = ({ item, index }) => {
        return <SingleSong marginBottom={index == songs.length - 1 && props.isPlayerMinimized} onShowOptionsPress={(song) => { onShowOptionsPress(song) }} songDetails={item} onSongPress={() => onSongPress(index)} />
    }

    const keyExtractor = useCallback((item) => { item.id.toString() }, [])

    const renderSongsList = () => {
        return < FlatList
            data={songs}
            renderItem={renderSingleSong}
            ListEmptyComponent={() => (
                <View style={{ flex: 1, marginTop: windowHeight * 0.4, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={commonStyles.textWhiteBold(24)}>
                        No songs added for this category
                    </Text>
                </View>
            )}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
        />
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

    // const onPlayArtistPress = async () => {
    //     if (songs && songs.length > 0) {
    //         if (props.isPlaying) {
    //             if (!checkPlayingArtist()) {
    //                 dispatch(changePlaylist(songs, 0, false, false))
    //                 dispatch(changePlayerState(true))
    //                 props.navigation.navigate(navigationStrings.PlaySong, { isPlaylist: true, header: `${containerDetails.name}'s songs`, initialIndex: 0 })
    //             }
    //             else {
    //                 dispatch(changePlayerState(false))
    //                 await TrackPlayer.pause()
    //             }
    //         }
    //         else {
    //             if (checkPlayingArtist()) {
    //                 dispatch(changePlayerState(true))
    //                 await TrackPlayer.play()
    //             }
    //             else {
    //                 dispatch(changePlaylist(songs, 0, false, false))
    //                 dispatch(changePlayerState(true))
    //                 props.navigation.navigate(navigationStrings.PlaySong, { isPlaylist: true, header: `${containerDetails.name}'s songs`, initialIndex: 0 })
    //             }
    //         }
    //     }
    //     else {
    //         ToastAndroid.show('No songs available for this artist', 700)
    //     }
    // }

    // const onLikeArtistPress = async () => {
    //     switch (isLiked) {
    //         case true:
    //             //Handle the case for unliking the artist here
    //             break;
    //         case false:
    //             let reqObj = {
    //                 user_id: props.userData.id,
    //                 artist_id: containerDetails.id
    //             }
    //             const response = await apiHandler.likeArtist(reqObj, props.accessToken)
    //             setIsLiked(true)
    //             break;
    //         default:
    //             break;
    //     }
    // }

    // const maximizePlayer = () => {
    //     dispatch(minimizePlayer(false))
    //     props.navigation.navigate(navigationStrings.PlaySong, { songDetails: props.currentSong })
    // }

    // const updateTrackIndex = (index) => {
    //     dispatch(setTrackIndex(index))
    // }

    // const onFollowArtistPress = (type, link) => {
    // if (link) {
    // Linking.openURL(`${link}`);
    // switch (type) {
    //     case 'facebook':
    //         break;
    //         break;
    //     case 'instagram':
    //         Linking.openURL(`https://www.instagram.com/${link}`)
    //         break;
    //     case 'twitter':
    //         Linking.openURL(`https://www.twitter.com/${link}`);
    //         break;
    //     case 'youtube':
    //         Linking.openURL(`https://www.youtube.com/${link}`)
    //         break;
    //     case 'snapchat':
    //         Linking.openURL(`https://www.snapchat.com/${link}`)
    //         break;
    //     default:
    //         break;
    // }
    //     }
    //     else {
    //         ToastAndroid.show('Link unavailable', 700)
    //     }
    // }

    // const renderSocialMediaLinks = (type, link) => {
    //     return <TouchableOpacity onPress={() => onFollowArtistPress(type, link)} style={{ width: '100%', paddingVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
    //         <FontAwesome name={type} style={{ fontSize: 20, color: colors.white, alignSelf: 'center' }} />
    //         <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
    //             <Text style={commonStyles.textLightNormal(18, { marginLeft: 15 })}>
    //                 {type.toUpperCase()}
    //             </Text>
    //         </View>
    //     </TouchableOpacity>
    // }
    //Image source
    //source={containerDetails.image == null || containerDetails.image == '' ? imagePath.dummyArtist : { uri: isArtist ? ARTISTS_IMAGE_BASE_URL + containerDetails.image : CATEGORIES_BASE_URL + containerDetails.image }}

    const onPlayButtonPress = () => {

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

    // const checkPlayingArtist = () => {
    //     let currentArtistId = routeDetails.id
    //     if (props.currentPlaylist[props.currentTrackIndex] && props.currentPlaylist[props.currentTrackIndex].artist.id == currentArtistId) {
    //         return true
    //     }
    //     else {
    //         return false
    //     }
    // }

    // const onFollowButtonPress = async () => {
    //     setIsLoading(true)
    //     const artistId = containerDetails.id
    //     let reqObj = {
    //         artistID: containerDetails.id,
    //         userID: props.userData.id
    //     }
    //     if (!isFollowed) {
    //         let response = await apiHandler.followArtist(props.accessToken, reqObj)
    //         setIsFollowed(true)
    //     }
    //     else {
    //         let res = await apiHandler.unfollowArtist(props.accessToken, reqObj)
    //         console.log('Unfollow response', res)
    //         setIsFollowed(false)
    //     }
    //     const artistSongs = await apiHandler.getSongsByArtist(props.accessToken, artistId)
    //     const artistData = artistSongs.Artist[0]
    //     setContainerDetails(artistData)
    //     setIsLoading(false)
    // }

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
                    colors={[`${backgroundColor}88`, `${backgroundColor}66`, `${backgroundColor}44`, `${backgroundColor}22`, `${backgroundColor}11`, `${backgroundColor}33`, `${backgroundColor}55`, `${backgroundColor}77`, `${backgroundColor}99`]}
                />
                <View style={commonStyles.flexFull}>
                    <MainHeader2 leftImage={imagePath.backIcon} onLeftIconPress={onBackPress} headerPrimaryTitle={`Songs for ${routeDetails.name}`} />
                    {renderSongsList()}
                    <SongOptionsModal isVisible={showOptions} closeModal={showHideOptions} onSingleIconPress={(title) => { handleOptionsClick(title) }} songDetails={currentSong} userId={props.userData.id} />
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

export default connect(mapStateToProps)(SongsByCategory)

const styles = StyleSheet.create({
    songsListFullContainer: { flex: 1, paddingHorizontal: 10, backgroundColor: colors.black },
    songsContainerImage: { height: 300, width: windowWidth, justifyContent: 'space-between', alignItems: 'flex-start' },
    singleSongFullContainer: { flexDirection: 'row', alignItems: 'center', width: windowWidth * 0.9, minHeight: 100, marginLeft: 10 },
    singleSongInnerContainer: { flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginLeft: 10, alignItems: 'center' },
    screenContainer: { flex: 1, backgroundColor: colors.black },
    customButtonStyle: (isFollowed) => {
        return { backgroundColor: isFollowed ? colors.black : 'transparent', borderColor: isFollowed ? colors.white : colors.black, alignSelf: 'center', borderWidth: 1, width: 140 }
    },
    followButtonText: (isFollowed) => {
        return { color: isFollowed ? colors.white : colors.black, fontWeight: 'bold', fontSize: 14 }
    }
})

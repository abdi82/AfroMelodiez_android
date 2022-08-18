import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ImageBackground, PixelRatio, ScrollView, Linking, ToastAndroid, BackHandler, Share } from 'react-native'
import { commonStyles } from '../constants/commonStyles';
import { navigationStrings } from '../navigation/navigationStrings';
import { imagePath } from '../constants/imagePath';
import { colors } from '../constants/colors';
import { apiHandler } from '../constants/apiHandler';
import { windowWidth, ARTISTS_IMAGE_BASE_URL, SONGS_IMAGE_BASE_URL, eSongListType, CATEGORIES_BASE_URL, SONGS_BASE_URL, VIDEOS_BASE_URL } from '../constants/globalConstants';
import { connect, useDispatch } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { SingleSong } from '../Components/SingleSong';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { minimizePlayer, changePlaylist, setTrackIndex, advertisments, changePlayerState, setUserData, setAccessToken, likeUnlikeSong, addSongToQueue } from '../redux/actions/actions';
import { PlayControls } from '../Components/PlayControls';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import LinearGradient from 'react-native-linear-gradient'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { LoadingComponent } from '../Components/LoadingComponent';
import TextTicker from 'react-native-text-ticker';
import TrackPlayer from 'react-native-track-player';
import { CommonButton } from '../Components/CommonButton';
import SongOptionsModal from '../Components/SongOptionsModal';
import { getInputRangeFromIndexes } from 'react-native-snap-carousel';

const SongsList = (props) => {

    const route = useRoute()

    const isArtist = route.params.songListType == eSongListType.Artist
    const isFeatured = route.params.isFeatured || false
    const routeDetails = route.params.data
    const [containerDetails, setContainerDetails] = useState({})
    const [songs, setSongs] = useState([])
    const [isLiked, setIsLiked] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isFollowed, setIsFollowed] = useState(false)
    const [showOptions, setShowOptions] = useState(false)
    const [currentSong, setCurrentSong] = useState({})
    const [isButtonLoading, setIsButtonLoading] = useState(false)
    console.log('These are the route details', containerDetails)
    const dispatch = useDispatch()

    useEffect(() => {
        getInitialData()
        // props.navigation.addListener('focus', focusHandler)
        // props.navigation.addListener('blur', blurHandler)
    }, [])

    const getInitialData = () => {
        // switch (isArtist) {
        // case true:
        setIsLoading(true)
        // if (isFeatured) {
        //     setIsLoading(false)
        // }
        // else {
        const artistId = routeDetails.id
        apiHandler.getSongsByArtist(props.accessToken, artistId).then(artistSongs => {
            console.log('Artist songs are', artistSongs)
            if (artistSongs.success == false) {
                ToastAndroid.show('Artist Not Verified', 700)
                props.navigation.goBack()
            }
            else {
                const artistData = artistSongs.Artist
                let followStatus = checkFollowStatus(artistData)
                setIsFollowed(followStatus)
                setContainerDetails(artistData)
                setSongs(artistSongs.data)
                setIsLoading(false)
            }
        })
        // }
        // break;
        // case false:
        //     setIsLoading(true)
        //     const categoryId = containerDetails.id
        //     apiHandler.getSongsByCategory(props.accessToken, categoryId).then(categorySongs => {
        //         setSongs(categorySongs)
        //         setIsLoading(false)
        //     })
        //     break;
        // default:
        //     break;
        // }
    }

    const handleBackButton = () => {
        if (props.navigation.canGoBack()) {
            props.navigation.goBack()
        }
    }

    const focusHandler = () => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton)
    }

    const blurHandler = () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackButton)
    }

    const checkFollowStatus = (artistDetails) => {
        let userId = props.userData.id
        if (artistDetails.followers && artistDetails.followers.includes(userId.toString())) {
            return true
        }
        return false
    }

    const onSongPress = (index) => {
        dispatch(changePlaylist(songs, index, false, false))
        props.navigation.navigate(navigationStrings.PlaySong, { songDetails: songs, isPlaylist: true, header: `Songs for ${containerDetails.name}`, initialIndex: index })
    }

    const onShowOptionsPress = (song) => {
        setCurrentSong(song)
        setShowOptions(true)
    }

    const renderSingleSong = (item, index) => {
        return <SingleSong marginBottom={index == songs.length - 1 && props.isPlayerMinimized} key={index} onShowOptionsPress={(song) => { onShowOptionsPress(song) }} songDetails={item} onSongPress={() => onSongPress(index)} />
    }

    const renderSongsList = () => {
        return songs && songs.length > 0 ? songs.map((item, index) => {
            return renderSingleSong(item, index)
        })
            :
            <Text style={commonStyles.textWhiteBold(24, { marginTop: 24, alignSelf: 'center' })}>
                No songs added for this artist
            </Text>
        {/* < FlatList
                data={songs}
                renderItem={renderSingleSong}
                ListEmptyComponent={() => (
                    <View style={{ height: 250, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={commonStyles.textWhiteBold(24)}>
                            No songs added for this artist
                            </Text>
                    </View>
                )
                }
                // keyExtractor={(item, index) => { item.id.toString() }} 
                /> */}
        // </View>
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

    const onPlayArtistPress = async () => {
        if (songs && songs.length > 0) {
            if (props.isPlaying) {
                if (!checkPlayingArtist()) {
                    dispatch(changePlaylist(songs, 0, false, false))
                    dispatch(changePlayerState(true))
                    props.navigation.navigate(navigationStrings.PlaySong, { isPlaylist: true, header: `${containerDetails.name}'s songs`, initialIndex: 0 })
                }
                else {
                    dispatch(changePlayerState(false))
                    await TrackPlayer.pause()
                }
            }
            else {
                if (checkPlayingArtist()) {
                    dispatch(changePlayerState(true))
                    await TrackPlayer.play()
                }
                else {
                    dispatch(changePlaylist(songs, 0, false, false))
                    dispatch(changePlayerState(true))
                    props.navigation.navigate(navigationStrings.PlaySong, { isPlaylist: true, header: `${containerDetails.name}'s songs`, initialIndex: 0 })
                }
            }
        }
        else {
            ToastAndroid.show('No songs available for this artist', 700)
        }
    }

    const onLikeArtistPress = async () => {
        switch (isLiked) {
            case true:
                //Handle the case for unliking the artist here
                break;
            case false:
                let reqObj = {
                    user_id: props.userData.id,
                    artist_id: containerDetails.id
                }
                const response = await apiHandler.likeArtist(reqObj, props.accessToken)
                setIsLiked(true)
                break;
            default:
                break;
        }
    }

    // const maximizePlayer = () => {
    //     dispatch(minimizePlayer(false))
    //     props.navigation.navigate(navigationStrings.PlaySong, { songDetails: props.currentSong })
    // }

    // const updateTrackIndex = (index) => {
    //     dispatch(setTrackIndex(index))
    // }

    const onFollowArtistPress = (type, link) => {
        if (link) {
            Linking.openURL(`${link}`);
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
        }
        else {
            ToastAndroid.show('Link unavailable', 700)
        }
    }

    const renderSocialMediaLinks = (type, link) => {
        return <TouchableOpacity onPress={() => onFollowArtistPress(type, link)} style={{ width: '100%', paddingVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome name={type} style={{ fontSize: 20, color: colors.white, alignSelf: 'center' }} />
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={commonStyles.textLightNormal(18, { marginLeft: 15 })}>
                    {type.toUpperCase()}
                </Text>
            </View>
        </TouchableOpacity>
    }
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

    const checkPlayingArtist = () => {
        let currentArtistId = containerDetails.id
        if (props.currentPlaylist[props.currentTrackIndex] && props.currentPlaylist[props.currentTrackIndex].artist.id == currentArtistId) {
            return true
        }
        else {
            return false
        }
    }

    const onFollowButtonPress = async () => {
        setIsButtonLoading(true)
        const artistId = containerDetails.id
        let reqObj = {
            artistID: containerDetails.id,
            userID: props.userData.id
        }
        if (!isFollowed) {
            await apiHandler.followArtist(props.accessToken, reqObj)
            setIsFollowed(true)
        }
        else {
            await apiHandler.unfollowArtist(props.accessToken, reqObj)
            setIsFollowed(false)
        }
        const artistSongs = await apiHandler.getSongsByArtist(props.accessToken, artistId)
        const artistData = artistSongs.Artist
        setContainerDetails(artistData)
        setIsButtonLoading(false)
    }

    const likeUnlikeSongPress = (id) => {
        dispatch(likeUnlikeSong(id))
    }

    const getFollowersNumber = (number) => {
        if (number < 1000) {
            return number
        }
        else {
            return `${number / 1000} k`
        }
    }
    const onFollowersPress = () => {
        containerDetails.followers[0] !== null ? props.navigation.navigate(navigationStrings.ArtistFollowers, { data: containerDetails.followers, artistName: containerDetails.name })
            : ToastAndroid.show('No followers for this artist')
    }

    console.log('These are the container details', containerDetails)

    return (
        isLoading ? <LoadingComponent isVisible={isLoading} />
            :
            <View style={[commonStyles.fullScreenContainerBlack(props.isPlayerMinimized), { padding: 0 }]}>
                <View style={commonStyles.flexFull}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {isArtist &&
                            <View style={{ backgroundColor: colors.white }}>
                                <View style={{ backgroundColor: colors.white, padding: 20 }}>
                                    <View style={commonStyles.flexRow_CenterItems}>
                                        <TouchableOpacity onPress={onBackPress} style={{ height: 35, width: 35, borderRadius: 17.5, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white }}>
                                            <Ionicons name='arrow-back' style={{ fontSize: 28, color: colors.black }} />
                                        </TouchableOpacity>
                                        <View style={{ maxWidth: '80%', marginLeft: 15 }}>
                                            <TextTicker
                                                style={{ fontSize: 24, color: colors.black, fontWeight: 'bold' }}
                                                duration={8000}
                                                loop
                                                bounce={false}
                                                repeatSpacer={50}
                                            // marqueeDelay={1000}
                                            >
                                                {containerDetails.name}
                                            </TextTicker>
                                        </View>
                                        <MaterialIcons name='verified' style={{ fontSize: 15, marginLeft: 5, color: '#007700' }} />
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', width: windowWidth, alignItems: 'center', backgroundColor: colors.white, padding: 20, paddingTop: 0 }}>
                                    <View style={{ height: 80, width: 80, borderRadius: 40, overflow: 'hidden', borderWidth: 2, borderColor: colors.grey }}>
                                        <Image style={{ height: 80, width: 80, borderRadius: 40 }} resizeMode='stretch' source={containerDetails.image == null || containerDetails.image == '' ? imagePath.dummyArtist : { uri: isArtist ? ARTISTS_IMAGE_BASE_URL + containerDetails.image : CATEGORIES_BASE_URL + containerDetails.image }} >
                                        </Image>
                                    </View>
                                    <View style={{ marginLeft: 15, alignItems: 'center' }}>
                                        <Text style={commonStyles.textWhiteBold(24, { color: colors.black })}>
                                            {containerDetails.played ? containerDetails.played : 0}
                                        </Text>
                                        <Text style={commonStyles.textLightNormal(16, { color: '#7a7a7a' })}>
                                            Monthly Listeners
                                        </Text>
                                    </View>
                                    <View style={{ height: '60%', width: 1, backgroundColor: '#7a7a7a', marginLeft: 15 }} />
                                    <TouchableOpacity onPress={onFollowersPress} style={{ marginLeft: 15, alignItems: 'center' }}>
                                        <Text style={commonStyles.textWhiteBold(24, { color: colors.black })}>
                                            {containerDetails && containerDetails.followers ? (containerDetails.followers == '' ? 0 : getFollowersNumber(containerDetails.followers.length)) : 0}
                                        </Text>
                                        <Text style={commonStyles.textLightNormal(16, { color: '#7a7a7a' })}>
                                            Followers
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <LinearGradient start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} colors={['#ffffff99', '#ffffff77', '#ffffff55', '#ffffff33', '#ffffff10', '#ffffff01']} style={{ width: windowWidth, paddingHorizontal: 20, paddingVertical: 10, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: colors.black }}>
                                    <View>
                                        <CommonButton customTextStyles={styles.followButtonText(isFollowed)} buttonTitle={isFollowed ? 'Unfollow' : 'Follow'} onPress={onFollowButtonPress} isRounded={true} customStyles={styles.customButtonStyle(isFollowed)} isLoading={isButtonLoading} />
                                        <Text numberOfLines={1} style={commonStyles.textWhiteNormal(26, { marginTop: 10 })}>
                                            About
                                        </Text>
                                        <Text numberOfLines={3} style={commonStyles.textLightNormal(18, { marginTop: 5, alignSelf: 'center' })}>
                                            {containerDetails.description ? containerDetails.description : 'No info about for this artist yet'}
                                        </Text>
                                        <Text style={commonStyles.textWhiteNormal(26, { marginTop: 20 })}>
                                            Follow on :
                                        </Text>
                                        {renderSocialMediaLinks('facebook', containerDetails.facebook)}
                                        {renderSocialMediaLinks('instagram', containerDetails.instagram)}
                                        {renderSocialMediaLinks('snapchat', containerDetails.snapchat)}
                                        {renderSocialMediaLinks('twitter', containerDetails.twitter)}
                                        {renderSocialMediaLinks('youtube', containerDetails.youtube)}
                                    </View>
                                    <TouchableOpacity onPress={onPlayArtistPress} style={{ height: 40, width: 40, borderRadius: 20, backgroundColor: colors.green, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end' }}>
                                        <Ionicons name={!props.isPlaying ? 'play' : props.currentPlaylist[props.currentTrackIndex].artist.id == containerDetails.id ? 'pause' : 'play'} style={{ fontSize: 25, color: colors.black }} />
                                    </TouchableOpacity>
                                </LinearGradient>
                            </View>
                        }
                        <View style={styles.songsListFullContainer}>
                            {renderSongsList()}
                        </View>
                    </ScrollView>
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

export default connect(mapStateToProps)(SongsList)

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

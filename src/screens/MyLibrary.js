import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, Image, Modal, FlatList, StyleSheet, TouchableOpacity, ScrollView, Share, BackHandler } from 'react-native'
import { AuthHeader } from '../Components/AuthHeader';
import NetInfo from "@react-native-community/netinfo";
import { commonStyles } from '../constants/commonStyles';
import { navigationStrings } from '../navigation/navigationStrings';
import { imagePath } from '../constants/imagePath';
import { colors } from '../constants/colors';
import { MainHeader2 } from '../Components/MainHeader2';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { connect, useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { apiHandler } from '../constants/apiHandler';
import { SingleSong } from '../Components/SingleSong'
import { LoadingComponent } from '../Components/LoadingComponent';
import { windowHeight, windowWidth, SONGS_BASE_URL, VIDEOS_BASE_URL, SONGS_IMAGE_BASE_URL, downloadsPath } from '../constants/globalConstants';
import RNFetchBlob from 'rn-fetch-blob'
import { minimizePlayer, changePlaylist, setTrackIndex, advertisments, changePlayerState, setUserData, setAccessToken, likeUnlikeSong, addSongToQueue, setCurrentInternetStatus, setLikedPodcasts } from '../redux/actions/actions';
import { PlayControls } from '../Components/PlayControls';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SongOptionsModal from '../Components/SongOptionsModal';
import LinearGradient from 'react-native-linear-gradient';

const MyLibrary = (props) => {

    const eViewOptions = {
        None: 'None',
        Liked: 'Liked',
        Downloaded: 'Downloaded',
        Offline: 'Offline',
        MostPlayedSongs: 'MostPlayedSongs'
    }

    const isInternetConnected = useSelector((state) =>
        state.isInternetConnected)

    const [currentViewState, setCurrentViewState] = useState(eViewOptions.None)
    // const [mostPlayedSongs, setMostPlayedSongs] = useState([])
    const [likedSongs, setLikedSongs] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [downloadedSongs, setDownloadedSongs] = useState([])
    const [favouriteAlbums, setFavouriteAlbums] = useState([])
    const [favouritePlaylists, setFavouritePlaylists] = useState([])
    const [showOptions, setShowOptions] = useState(false)
    const [currentSong, setCurrentSong] = useState({})
    const [likedPodcasts, setLikedPodcasts] = useState([])
    // const [followedArtists, setFollowedArtists] = useState([])
    const [userPlaylists, setUserPlaylists] = useState([])
    const onDownloadPress = () => {
        setCurrentViewState(eViewOptions.Downloaded)
    }

    const onBackPress = () => {
        props.navigation.goBack()
    }

    const focusHandler = () => {
        BackHandler.addEventListener('hardwareBackPress', onBackPress)
    }

    const blurHandler = () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }

    // useEffect(() => {
    //     props.navigation.addListener('focus', focusHandler)
    //     props.navigation.addListener('blur', blurHandler)
    // }, [])


    useEffect(() => {
        getInitialData()
    }, [isInternetConnected])


    const getInitialData = async () => {
        let downloads = await RNFetchBlob.fs.ls(downloadsPath)
        downloads = downloads.filter(item => {
            return item.includes('mp3')
        })
        downloads = downloads.map((item, index) => {
            let name = item.split('.')[1].trim()
            return {
                id: index,
                url: downloadsPath + item,
                type: 'default',
                name: name,
                album: 'My Album',
                artist: 'Dummy artist',
                artswork: imagePath.dummySong,
                image: imagePath.dummySong,
            }
        })
        if (isInternetConnected) {
            setIsLoading(true)
            setDownloadedSongs(downloads)
            const token = props.accessToken
            const userId = props.userData.id
            const serverLikedSongs = await apiHandler.getLikedSongs(token, userId)
            setLikedSongs(serverLikedSongs)
            const favouriteAlbums = await apiHandler.getFavouriteAlbums(token, userId)
            setFavouriteAlbums(favouriteAlbums)
            const likedPodcasts = await apiHandler.getLikedPodcasts(token, userId)
            setLikedPodcasts(likedPodcasts)
            const userPlaylists = await apiHandler.getAllPlaylists(token, userId)
            setUserPlaylists(userPlaylists)
            const favouritePlaylists = await apiHandler.getFavouritePlaylists(token, userId)
            setFavouritePlaylists(favouritePlaylists)
            setCurrentViewState(eViewOptions.None)
            setIsLoading(false)
        }
        else {
            setIsLoading(true)
            setDownloadedSongs(downloads)
            setCurrentViewState(eViewOptions.Offline)
            setIsLoading(false)
        }
    }

    useFocusEffect(React.useCallback(() => {
        getInitialData()
    }, [isInternetConnected]))

    const dispatch = useDispatch()

    // const maximizePlayer = () => {
    //     dispatch(minimizePlayer(false))
    //     props.navigation.navigate(navigationStrings.PlaySong, { songDetails: props.currentSong })
    // }

    const onSongPress = (index) => {
        switch (currentViewState) {
            case eViewOptions.Liked:
                dispatch(changePlaylist(likedSongs, index, false, false))
                // dispatch(changePlayerState(true))
                // dispatch(minimizePlayer(false))
                props.navigation.navigate(navigationStrings.PlaySong, { songDetails: likedSongs, isPlaylist: true, header: 'Liked Songs', initialIndex: index })
                break;
            case eViewOptions.Downloaded:
                console.log('Dispatched with downloaded songs')
                dispatch(changePlaylist(downloadedSongs, index, false, true))
                // dispatch(changePlayerState(true))
                // dispatch(minimizePlayer(false))
                props.navigation.navigate(navigationStrings.PlaySong, { songDetails: downloadedSongs, isPlaylist: true, header: 'Downloads', initialIndex: index, isDownload: true })
                break;
            // case eViewOptions.MostPlayedSongs:
            //     dispatch(changePlaylist(mostPlayedSongs, index))
            //     props.navigation.navigate(navigationStrings.PlaySong, { songDetails: mostPlayedSongs, isPlaylist: true, header: 'Most Played', initialIndex: index })
            //     break;
            default:
                break;
        }
    }

    const onShowOptionsPress = (song) => {
        setCurrentSong(song)
        setShowOptions(true)
    }

    const renderSingleSong = ({ item, index }) => {
        return <SingleSong key={index} isDownload={currentViewState == eViewOptions.Downloaded} marginBottom={(currentViewState == eViewOptions.Liked ? index == likedSongs.length - 1 : currentViewState == eViewOptions.Downloaded ? index == downloadedSongs.length - 1 : index == mostPlayedSongs.length - 1) && props.isPlayerMinimized} onShowOptionsPress={(song) => { onShowOptionsPress(song) }} songDetails={item} onSongPress={() => onSongPress(index)} />
    }

    const keyExtractor = useCallback((item) => { item.id.toString() }, [])

    const renderSongsList = (songList) => {
        return <View style={styles.songsListContainer}>
            <FlatList
                data={songList}
                renderItem={renderSingleSong}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
            />
        </View>
    }

    const onGeneralViewOptionPress = (title) => {
        switch (title) {
            case 'Liked Songs':
                setCurrentViewState(eViewOptions.Liked)
                break;
            case 'Downloaded Songs':
                setCurrentViewState(eViewOptions.Downloaded)
                break;
            case 'Liked Podcasts':
                props.navigation.navigate(navigationStrings.PodcastEpisodes, { episodes: likedPodcasts, isLiked: true })
                break;
            case 'Add artists':
                break;
            case 'Most Played Songs':
                setCurrentViewState(eViewOptions.MostPlayedSongs)
                break;
            case 'Your favourite Albums':
                props.navigation.navigate(navigationStrings.AlbumsListing, { data: favouriteAlbums, isFavourite: true })
                break;
            case 'Your favourite Playlists':
                props.navigation.navigate(navigationStrings.FavouritePlaylists, { data: favouritePlaylists })
                break;
            case 'Add Playlist':
                onAddPlaylistPress()
                break;
            case 'Your followed Artists':
                props.navigation.navigate(navigationStrings.Artists, { data: followedArtists, isFollowed: true, headerTitle: 'Followed Artists' })
                break;
            default:
                break;
        }
    }

    const renderGeneralViewOption = (imageSource, title, number) => {
        return <TouchableOpacity key={title.toString()} style={{ width: '100%', minHeight: 60, alignItems: 'center', flexDirection: 'row', marginTop: 10, borderRadius: 12 }} onPress={() => {
            onGeneralViewOptionPress(title)
        }}>
            {imageSource && imageSource != null ? <Image source={imageSource} style={{ height: '90%', width: 60, resizeMode: 'stretch' }} />
                :
                <View style={styles.generalViewAddIconContainer(title === 'Add artists')}>
                    <Image source={imagePath.addIcon} style={styles.generalViewAddIcon} />
                </View>}
            <View style={styles.generalViewOptionInnerContainer}>
                <Text style={commonStyles.textWhiteNormal(20)}>
                    {title}
                </Text>
                {number != null ? <Text style={commonStyles.textLightNormal(16)}>
                    {number + ' ' + title.split(' ')[title.split(' ').length - 1]}
                </Text> : null}
            </View>
        </TouchableOpacity>
    }

    const onDeletePlaylistPress = async (item) => {
        setIsLoading(true)
        let token = props.accessToken
        await apiHandler.deletePlaylist(item.id, token)
        let userPlaylists = await apiHandler.getAllPlaylists(token, props.userData.id)
        setUserPlaylists(userPlaylists)
        setIsLoading(false)
    }

    const renderRightIcons = (item) => {
        return <TouchableOpacity style={{ height: 60, width: 60, justifyContent: 'center', alignItems: 'center', marginTop: 10 }} onPress={() => { onDeletePlaylistPress(item) }}>
            <MaterialCommunityIcons name='delete' style={{ color: '#ff0000', fontSize: 35 }} />
        </TouchableOpacity>
    }

    const onMyPlaylistPress = (item) => {
        props.navigation.navigate(navigationStrings.MixSongs, { headerTitle: item.playlist_name + ' Songs', isMyPlaylist: true, playlistSongs: item.song_ID, playlistDetails: item })
    }

    const renderSinglePlaylist = (item, index) => {
        return <Swipeable key={index} childrenContainerStyle={{ width: '100%', minHeight: 60, alignItems: 'center', flexDirection: 'row', marginTop: 10, backgroundColor: '#f4f4f421', borderRadius: 12, marginBottom: props.isPlayerMinimized && index == userPlaylists.length - 1 ? 70 : 0 }} renderRightActions={() => {
            return renderRightIcons(item)
        }}>
            <TouchableOpacity key={index} style={{ flexDirection: 'row', height: '100%', width: '100%' }} onPress={() => {
                onMyPlaylistPress(item)
            }}>
                {/* <TouchableOpacity style={{ width: '100%', minHeight: 60, alignItems: 'center', flexDirection: 'row', marginTop: 10, backgroundColor: '#f4f4f421', borderRadius: 12 }}> */}
                <Image source={imagePath.dummySong} style={{ height: '90%', width: 60, resizeMode: 'cover' }} />
                <View style={{ flex: 1, paddingVertical: 10, marginLeft: 10 }}>
                    <Text style={commonStyles.textWhiteNormal(20)}>
                        {item.playlist_name}
                    </Text>
                    <Text style={commonStyles.textLightNormal(16)}>
                        {props.userData.name}
                    </Text>
                </View>
            </TouchableOpacity>
        </Swipeable>
    }

    const renderGeneralView = () => {
        return (<View style={commonStyles.flexFull}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {renderGeneralViewOption(imagePath.heart, 'Liked Songs', likedSongs.length)}
                {renderGeneralViewOption(imagePath.heart, 'Liked Podcasts', likedPodcasts.length)}
                {renderGeneralViewOption(imagePath.download, 'Downloaded Songs', downloadedSongs.length)}
                {renderGeneralViewOption(imagePath.dummyArtist, 'Your favourite Albums', favouriteAlbums && favouriteAlbums.length)}
                {renderGeneralViewOption(imagePath.dummyArtist, 'Your favourite Playlists', favouritePlaylists && favouritePlaylists.length)}
                {/* {renderGeneralViewOption(imagePath.dummyArtist, 'Your followed Artists', followedArtists && followedArtists.length)} */}
                {renderGeneralViewOption(null, 'Add Playlist', null)}
                <View style={commonStyles.flexFull}>
                    {userPlaylists && userPlaylists.length > 0 ? userPlaylists.map((item, index) => {
                        return renderSinglePlaylist(item, index)
                    })
                        :
                        <Text style={commonStyles.textWhiteNormal(20, { marginTop: 10, alignSelf: 'center' })}>
                            No playlist added yet.
                        </Text>}
                    {/* // <FlatList
                    //     data={userPlaylists}
                    //     ListHeaderComponent={() => {
                    //         return <Text style={commonStyles.textWhiteNormal(20, { marginTop: 10 })}>
                    //             Your Playlists
                    //         </Text>
                    //     }}
                    //     renderItem={renderSinglePlaylist}
                    // // keyExtractor={(item, index) => { item.id.toString() }}
                    // /> */}
                </View>
            </ScrollView>
        </View>)
    }

    const renderOfflineView = () => {
        return <View style={styles.offlineViewContainer}>
            <Image source={imagePath.connectionUnavailable} style={styles.connectionUnavailableImage} />
            <Text style={commonStyles.textWhiteNormal(38)}>
                No Internet !!
            </Text>
            <Text style={commonStyles.textWhiteNormal(22, { marginTop: 10, textAlign: 'center' })}>
                No worries, you can still listen to your downloaded music offline
            </Text>
            <Text style={commonStyles.textWhiteNormal(32, { marginTop: 10 })}>
                Go to
                <Text onPress={onDownloadPress} style={commonStyles.textWhiteNormal(32, { color: colors.green, marginLeft: 4 })}>
                    {' '}Downloads
                </Text>
            </Text>
        </View>
    }

    const renderHeaderText = (text) => {
        return <Text style={commonStyles.textWhiteBold(19, { alignSelf: 'flex-start', marginVertical: 10 })}>
            {text}
        </Text>
    }

    const onSearchIconPress = () => {
        props.navigation.navigate(navigationStrings.Search)
    }

    const onAddPlaylistPress = () => {
        props.navigation.navigate(navigationStrings.AddPlaylist)
    }

    const rightSecondIcon = () => {
        return isInternetConnected && <Ionicons name='add-outline' style={styles.rightIconStyle(false)} onPress={onAddPlaylistPress} />
    }

    const rightFirstIcon = () => {
        return isInternetConnected && <Ionicons name='search-outline' style={styles.rightIconStyle(true)} onPress={onSearchIconPress} />
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

    return (
        isLoading ? <LoadingComponent isVisible={isLoading} />
            :
            <View style={commonStyles.fullScreenContainerBlack(props.isPlayerMinimized)}>
                <LinearGradient
                    style={commonStyles.linearGradientStyle}
                    start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                    colors={['#ffffff77', '#ffffff55', '#ffffff33', '#ffffff11', '#ffffff11', '#ffffff22', '#ffffff44', '#ffffff66', '#ffffff99']}
                />
                <View style={commonStyles.flexFull}>
                    {
                        currentViewState != eViewOptions.Offline &&
                        <MainHeader2 headerPrimaryTitle='My Library' rightFirstIcon={rightFirstIcon} rightSecondIcon={rightSecondIcon} />
                    }
                    {
                        currentViewState == eViewOptions.Downloaded ?
                            renderHeaderText('Downloaded Songs')
                            : currentViewState == eViewOptions.Liked ?
                                renderHeaderText('Liked Songs')
                                : null
                    }
                    {
                        currentViewState == eViewOptions.None ?
                            renderGeneralView() :
                            currentViewState == eViewOptions.Liked ?
                                renderSongsList(likedSongs) :
                                currentViewState == eViewOptions.Downloaded ?
                                    renderSongsList(downloadedSongs) :
                                    currentViewState == eViewOptions.MostPlayedSongs ?
                                        renderSongsList(mostPlayedSongs) :
                                        renderOfflineView()
                    }
                </View>
                {/* <Modal transparent={true} animationType='slide' visible={showAddPlaylistModal} onRequestClose={showHidePlaylistModal}>
                <View style={styles.playlistModalContainer}>
                    <View style={styles.playlistModalInnerContainer}>
                        <PrimaryTextInput placeholder='Add a playlist' onChangeText={(text) => {
                            setPlaylistName(text)
                        }} customStyles={styles.customPlaylistInputStyle} />
                        <View style={styles.deleteButtonsContainer}>
                            <TouchableOpacity onPress={addPlaylistToServer} style={styles.confirmButton}>
                                <Text style={commonStyles.textWhiteNormal(18)}>
                                    Done
                        </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={showHidePlaylistModal} style={styles.cancelButton}>
                                <Text style={commonStyles.textWhiteNormal(18, { color: colors.green })}>
                                    Cancel
                        </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal> */}
                <SongOptionsModal isVisible={showOptions} closeModal={showHideOptions} onSingleIconPress={(title) => { handleOptionsClick(title) }} songDetails={currentSong} userId={props.userData.id} />
                {
                    (props.isPlayerMinimized) && <PlayControls likeUnlikeSong={(id) => { likeUnlikeSongPress(id) }} likedSongs={props.likedSongs} isPlaying={props.isPlaying} setIsPlaying={(value) => { updatePlayingState(value) }} updateIndex={(index) => { updateTrackIndex(index) }} currentIndex={props.currentTrackIndex} currentPlaylist={props.currentPlaylist} playCount={props.playCount} changePlayerState={maximizePlayer} isMinimized={props.isPlayerMinimized} userData={props.userData} token={props.accessToken} />
                }
            </View>
    )
}

const mapStateToProps = (state) => {
    return { userData: state.userData, accessToken: state.accessToken, isPlayerMinimized: state.isPlayerMinimized, currentPlaylist: state.currentPlaylist, playCount: state.playCount, advertisements: state.advertisements, currentTrackIndex: state.currentTrackIndex, isPlaying: state.isPlaying, likedSongs: state.likedSongsIds, userPlaylists: state.userPlaylists, downloadedSongs: state.downloadedSongs }
}

export default connect(mapStateToProps)(MyLibrary)

const styles = StyleSheet.create({
    singleSearchResultFullContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', minHeight: 60, maxHeight: 80, marginBottom: 10 },
    searchResultImageStyle: { height: 60, width: 60, borderRadius: 30, resizeMode: 'contain' },
    singleSearchResultDetailsContainer: { flex: 1, marginLeft: 10 },
    offlineViewContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    connectionUnavailableImage: { height: 60, width: 60, resizeMode: 'contain' },
    songsListContainer: { flex: 1, width: '100%' },
    likeImage: { height: 8, width: 8, marginLeft: 5 },
    generalViewOptionContainer: { width: '100%', alignItems: 'center', flexDirection: 'row', marginVertical: 10, minHeight: 50 },
    generalViewImage: { height: 48, width: 48, resizeMode: 'contain' },
    generalViewAddIconContainer: (isArtists) => {
        return { height: 48, width: 48, borderRadius: isArtists ? 24 : 8, backgroundColor: colors.lightGrey, justifyContent: 'center', alignItems: 'center' }
    },
    generalViewAddIcon: { height: 20, width: 20, resizeMode: 'contain' },
    generalViewOptionInnerContainer: { flex: 1, padding: 8 },
    rightIconStyle: (margin) => {
        return { fontSize: margin ? 25 : 30, color: colors.white, marginRight: margin ? 10 : 0, marginTop: margin ? 2 : 0 }
    },
    playlistModalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    playlistModalInnerContainer: { height: windowHeight * 0.25, width: windowWidth * 0.9, borderRadius: 12, backgroundColor: colors.white, padding: 20, justifyContent: 'space-between' },
    customPlaylistInputStyle: { borderRadius: 12, borderWidth: 1, borderBottomColor: colors.green, borderColor: colors.green },
    deleteButtonsContainer: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
    confirmButton: { width: '40%', justifyContent: 'center', alignItems: 'center', padding: 10, borderRadius: 12, backgroundColor: colors.green },
    cancelButton: { width: '40%', justifyContent: 'center', alignItems: 'center', padding: 10, borderRadius: 12, backgroundColor: colors.white, borderColor: colors.green, borderWidth: 1 }
})

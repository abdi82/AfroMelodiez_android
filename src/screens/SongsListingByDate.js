import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Share, BackHandler } from 'react-native'
import { commonStyles } from '../constants/commonStyles';
import { navigationStrings } from '../navigation/navigationStrings';
import { imagePath } from '../constants/imagePath';
import { colors } from '../constants/colors';
import DropDownPicker from 'react-native-dropdown-picker'
import { MainHeader2 } from '../Components/MainHeader2';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { apiHandler } from '../constants/apiHandler';
import { windowWidth, ARTISTS_IMAGE_BASE_URL, SONGS_IMAGE_BASE_URL, eSongListType, SONGS_BASE_URL, VIDEOS_BASE_URL, windowHeight } from '../constants/globalConstants';
import { connect, useDispatch } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { SingleSong } from '../Components/SingleSong';
import { LoadingComponent } from '../Components/LoadingComponent';
import { minimizePlayer, changePlaylist, setTrackIndex, advertisments, changePlayerState, setUserData, setAccessToken, likeUnlikeSong, addSongToQueue } from '../redux/actions/actions';
import { PlayControls } from '../Components/PlayControls';
import SongOptionsModal from '../Components/SongOptionsModal';
import { ActivityIndicator } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

const SongsListingByDate = (props) => {
    const [listSongs, setListSongs] = useState([])
    const [allSongs, setAllSongs] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [showOptions, setShowOptions] = useState(false)
    const [currentSong, setCurrentSong] = useState({})
    const [isListLoading, setIsListLoading] = useState(false)

    useEffect(() => {
        const getInitialData = () => {
            setIsLoading(true)
            const token = props.accessToken
            const userID = props.userData.id
            apiHandler.getSongsListingByDate(token, userID).then(serverData => {
                let latestSongs = serverData.songs
                let arrGroupedSongs = []
                for (const property in latestSongs) {
                    let data = Object.values(latestSongs[property])
                    arrGroupedSongs.push({
                        date: property,
                        items: data
                    })
                }
                setListSongs(arrGroupedSongs)
                setIsLoading(false)
                // let arrServerSongs = Object.values(latestSongs)
                // const objSongsByDate = arrServerSongs.reduce((songs, song) => {
                //     const date = song.played_date;
                //     if (!songs[date]) {
                //         songs[date] = [];
                //     }
                //     songs[date].push(song);
                //     return songs;
                // }, {});
                // const arrSongsByDate = Object.keys(objSongsByDate)
                // const groupedSongs = arrSongsByDate.map((date) => {
                //     return {
                //         date: date,
                //         items: objSongsByDate[date]
                //     };
                // });
                // let arrData = []
                // groupedSongs.forEach(iSong => {
                //     iSong.items.forEach(iItem => {
                //         arrData.push(iItem)
                //     })
                // })
                // setAllSongs(arrData)
            })
        }
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton)
        getInitialData()
        return () => backHandler.remove()
    }, [])


    const handleBackButton = () => {
        if (props.navigation.canGoBack()) {
            props.navigation.goBack()
        }
    }

    const dispatch = useDispatch()

    const onSongPress = (index, songs) => {
        dispatch(changePlaylist(songs, index, false, false))
        dispatch(changePlayerState(true))
        dispatch(minimizePlayer(false))
        props.navigation.navigate(navigationStrings.PlaySong, { songDetails: songs, isPlaylist: true, header: 'Previously listened', initialIndex: index })
    }

    const onShowOptionsPress = (song) => {
        setCurrentSong(song)
        setShowOptions(true)
    }

    const renderSingleSong = (item, index, songs, outerIndex) => {
        return <SingleSong marginBottom={outerIndex == listSongs.length - 1 && index == songs.length - 1 && props.isPlayerMinimized} key={index} songDetails={item} onShowOptionsPress={(song) => { onShowOptionsPress(song) }} onSongPress={() => onSongPress(index, songs)} />
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

    // const getDisplayDate=(date)=>{
    //     return moment
    // }


    const renderSingleSongGroup = ({ item, index }) => {
        return <View>
            <Text style={commonStyles.textWhiteBold(20, { marginBottom: 15 })}>
                {item.date}
            </Text>
            {item.items.map((innerItem, innerIndex) => {
                return renderSingleSong(innerItem, innerIndex, item.items, index)
            })}
        </View>
    }

    const keyExtractor = useCallback((item) => { item.date.toString() }, [])

    const renderSongsList = () => {
        return <View style={styles.songsListFullContainer}>
            < FlatList
                data={listSongs}
                renderItem={renderSingleSongGroup}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
            // onEndReached={getInitialData}
            // onEndReachedThreshold={0.1}
            // refreshing={isListLoading}
            />
            {
                isListLoading &&
                <View style={{ height: 40, width: windowWidth }}>
                    <ActivityIndicator color={colors.green} size='large' />
                </View>
            }
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
        isLoading ? <LoadingComponent isVisible={isLoading} />
            :
            <View style={commonStyles.fullScreenContainerBlack(props.isPlayerMinimized)}>
                <LinearGradient
                    style={commonStyles.linearGradientStyle}
                    start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                    colors={['#ffffff77', '#ffffff55', '#ffffff33', '#ffffff11', '#ffffff11', '#ffffff22', '#ffffff44', '#ffffff66', '#ffffff99']}
                />
                <MainHeader2 leftImage={imagePath.backIcon} onLeftIconPress={onBackPress} headerPrimaryTitle="Recently Played" />
                {/* <Image style={styles.songsContainerImage} source={{ uri: SONGS_IMAGE_BASE_URL + containerDetails.image }} /> */}
                {
                    <View style={commonStyles.flexFull}>
                        {renderSongsList()}
                    </View>}
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

export default connect(mapStateToProps)(SongsListingByDate)

const styles = StyleSheet.create({
    songsListFullContainer: { flex: 1, width: windowWidth - 40, marginTop: 10 },
    songsContainerImage: { height: 200, width: windowWidth * 0.5, alignSelf: 'center' },
    singleSongFullContainer: { flexDirection: 'row', alignItems: 'center', width: windowWidth * 0.9, minHeight: 100, marginLeft: 10 },
    singleSongInnerContainer: { flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginLeft: 10, alignItems: 'center' },
})

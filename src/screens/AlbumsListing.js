import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ImageBackground, BackHandler } from 'react-native'
import { commonStyles } from '../constants/commonStyles';
import { navigationStrings } from '../navigation/navigationStrings';
import { imagePath } from '../constants/imagePath';
import { colors } from '../constants/colors';
import { MainHeader2 } from '../Components/MainHeader2';
import { apiHandler } from '../constants/apiHandler';
import { windowWidth, ARTISTS_IMAGE_BASE_URL, SONGS_IMAGE_BASE_URL, eSongListType, CATEGORIES_BASE_URL, windowHeight } from '../constants/globalConstants';
import { connect, useDispatch } from 'react-redux';
import { useRoute, useFocusEffect, useNavigation, useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { minimizePlayer, changePlaylist, setTrackIndex, advertisments, changePlayerState, setUserData, setAccessToken, likeUnlikeSong } from '../redux/actions/actions';
import { PlayControls } from '../Components/PlayControls';
import { LoadingComponent } from '../Components/LoadingComponent';
import LinearGradient from 'react-native-linear-gradient';

const AlbumsListing = (props) => {
    const route = useRoute()
    const isFavourite = route.params.isFavourite || false

    const [albums, setAlbums] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()

    const navigation = useNavigation()

    const handleBackButton = () => {
        console.log('Back pressed', props.navigation.canGoBack())
        if (navigation.canGoBack()) {
            navigation.goBack()
            return true;
        }
    }

    const getInitialData = async () => {
        setIsLoading(true)
        if (!isFavourite) {
            const token = props.accessToken
            const albums = await apiHandler.getAlbums(token)
            setAlbums(albums)
            setIsLoading(false)
        }
        else {
            setIsLoading(true)
            const favouriteAlbums = await apiHandler.getFavouriteAlbums(props.accessToken, props.userData.id)
            setAlbums(favouriteAlbums)
        }
        setIsLoading(false)
    }

    useFocusEffect(
        useCallback(() => {
            // BackHandler.addEventListener(
            // "hardwareBackPress",
            // handleBackButton
            // )
            getInitialData()
            // return () => BackHandler.removeEventListener("hardwareBackPress", handleBackButton)
        }, [])
    )

    const onAlbumPress = (item) => {
        // dispatch(changePlaylist(albums, index))
        props.navigation.navigate(navigationStrings.Albums, { data: item })
    }

    const renderSingleAlbum = ({ item, index }) => {
        return <TouchableOpacity style={[styles.singleSongFullContainer, { marginBottom: index == albums.length - 1 && props.isPlayerMinimized ? 60 : 0 }]} onPress={() => { onAlbumPress(item) }}>
            <Image source={imagePath.dummyArtist} style={{ height: '100%', width: 70, borderRadius: 8 }} resizeMode='stretch' />
            <View style={styles.singleSongInnerContainer}>
                <View style={commonStyles.flexFull}>
                    <Text style={commonStyles.textWhiteNormal(20)}>
                        {item.name}
                    </Text>
                    {/* <Text style={commonStyles.textLightNormal(12)}>
                        {songDetails.played ? 'Listened ' + songDetails.played + ' times' : 'Not listened yet'}
                    </Text> */}
                </View>
                {/* <Ionicons name='arrow-forward' style={{ color: colors.white, fontSize: 20 }} onPress={() => { onShowOptionsPress(songDetails) }} /> */}
            </View>
        </TouchableOpacity>
    }

    const keyExtractor = useCallback((item) => { item.id.toString() }, [])

    const renderAlbumsList = () => {
        return <View style={{ flex: 1, marginTop: 20 }}>
            < FlatList
                data={albums}
                renderItem={renderSingleAlbum}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
            />
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
                <MainHeader2 leftImage={imagePath.backIcon} onLeftIconPress={onBackPress} headerPrimaryTitle={isFavourite ? 'Your favourite albums' : 'All albums'} />
                <View style={commonStyles.flexFull}>
                    {renderAlbumsList()}
                </View>
                {
                    (props.isPlayerMinimized) && <PlayControls likeUnlikeSong={(id) => { likeUnlikeSongPress(id) }} likedSongs={props.likedSongs} isPlaying={props.isPlaying} setIsPlaying={(value) => { updatePlayingState(value) }} updateIndex={(index) => { updateTrackIndex(index) }} currentIndex={props.currentTrackIndex} currentPlaylist={props.currentPlaylist} playCount={props.playCount} changePlayerState={maximizePlayer} isMinimized={props.isPlayerMinimized} userData={props.userData} token={props.accessToken} />
                }
            </View>
    )
}

const mapStateToProps = (state) => {
    return { userData: state.userData, accessToken: state.accessToken, isPlayerMinimized: state.isPlayerMinimized, currentPlaylist: state.currentPlaylist, playCount: state.playCount, advertisements: state.advertisements, currentTrackIndex: state.currentTrackIndex, isPlaying: state.isPlaying, likedSongs: state.likedSongsIds }
}

export default connect(mapStateToProps)(AlbumsListing)

const styles = StyleSheet.create({
    songsListFullContainer: { flex: 1, width: windowWidth - 40, marginTop: 20 },
    songsContainerImage: { height: 300, width: windowWidth, alignSelf: 'center' },
    singleSongFullContainer: { flexDirection: 'row', alignItems: 'center', width: windowWidth * 0.9, minHeight: 60, marginLeft: 10, marginTop: 10 },
    singleSongInnerContainer: { flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginLeft: 10, alignItems: 'center' },
})

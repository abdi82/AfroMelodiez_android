import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { commonStyles } from '../constants/commonStyles';
import { navigationStrings } from '../navigation/navigationStrings';
import { imagePath } from '../constants/imagePath';
import { MainHeader2 } from '../Components/MainHeader2';
import { apiHandler } from '../constants/apiHandler';
import { windowWidth } from '../constants/globalConstants';
import { connect, useDispatch } from 'react-redux';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { minimizePlayer, changePlaylist, setTrackIndex, advertisments, changePlayerState, setUserData, setAccessToken, likeUnlikeSong } from '../redux/actions/actions';
import { PlayControls } from '../Components/PlayControls';
import { LoadingComponent } from '../Components/LoadingComponent';
import LinearGradient from 'react-native-linear-gradient';

const FavouritePlaylists = (props) => {

    const route = useRoute()

    const [favouritePlaylists, setFavouritePlaylists] = useState(route?.params?.data ? route.params.data : [])
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()

    const handleBackButton = () => {
        if (props.navigation.canGoBack()) {
            props.navigation.goBack()
        }
    }

    useFocusEffect(React.useCallback(() => {
        async function getPlaylists() {
            setIsLoading(true)
            apiHandler.getFavouritePlaylists(props.accessToken, props.userData.id).then(favouritePlaylists => {
                setFavouritePlaylists(favouritePlaylists)
                setIsLoading(false)
            })
        }
        // const backHandler = BackHandler.addEventListener(
        //     "hardwareBackPress",
        //     handleBackButton
        // )
        getPlaylists()
        // return () => backHandler.remove();
    }, []))

    const onPlaylistPress = (item) => {
        props.navigation.navigate(navigationStrings.SongsByPlaylist, { data: item })
    }

    const renderSinglePlaylist = ({ item, index }) => {
        return <TouchableOpacity style={[styles.singleSongFullContainer, { marginBottom: index == favouritePlaylists.length - 1 && props.isPlayerMinimized ? 80 : 10 }]} onPress={() => { onPlaylistPress(item) }}>
            <Image source={imagePath.dummyArtist} style={{ height: 70, width: 70 }} resizeMode='cover' />
            <View style={styles.singleSongInnerContainer}>
                <View style={commonStyles.flexFull}>
                    <Text style={commonStyles.textWhiteNormal(20)}>
                        {item.name}
                    </Text>
                    <View style={commonStyles.flexRow_CenterItems}>
                        <View style={{ backgroundColor: '#c7c7c7', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2, borderRadius: 3 }}>
                            <Text style={commonStyles.textWhiteNormal(10, { fontWeight: 'bold', color: '#555555' })}>
                                Artist
                            </Text>
                        </View>
                        <Text style={commonStyles.textLightNormal(12, { marginLeft: 5 })}>
                            {'Dummy artist'}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    }

    const keyExtractor = useCallback((item) => { item.id.toString() }, [])

    const renderPlaylistsList = () => {
        return <View style={{ flex: 1, marginTop: 20 }}>
            < FlatList
                data={favouritePlaylists}
                renderItem={renderSinglePlaylist}
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
        isLoading ? <LoadingComponent isVisible={isLoading} />
            :
            <View style={commonStyles.fullScreenContainerBlack(props.isPlayerMinimized)}>
                <LinearGradient
                    style={commonStyles.linearGradientStyle}
                    start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                    colors={['#ffffff77', '#ffffff55', '#ffffff33', '#ffffff11', '#ffffff11', '#ffffff22', '#ffffff44', '#ffffff66', '#ffffff99']}
                />
                <MainHeader2 leftImage={imagePath.backIcon} onLeftIconPress={onBackPress} headerPrimaryTitle={'Your favourite Playlists'} />
                <View style={commonStyles.flexFull}>
                    {renderPlaylistsList()}
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

export default connect(mapStateToProps)(FavouritePlaylists)

const styles = StyleSheet.create({
    songsListFullContainer: { flex: 1, width: windowWidth - 40, marginTop: 20 },
    songsContainerImage: { height: 300, width: windowWidth, alignSelf: 'center' },
    singleSongFullContainer: { flexDirection: 'row', alignItems: 'center', width: windowWidth * 0.9, minHeight: 60, marginLeft: 10, marginTop: 10 },
    singleSongInnerContainer: { flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginLeft: 10, alignItems: 'center' },
})

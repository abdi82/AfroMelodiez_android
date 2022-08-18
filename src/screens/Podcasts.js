import React, { useState } from 'react'
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet, BackHandler } from 'react-native'
import { commonStyles } from '../constants/commonStyles';
import { navigationStrings } from '../navigation/navigationStrings';
import { imagePath } from '../constants/imagePath';
import { MainHeader2 } from '../Components/MainHeader2';
import { connect, useDispatch } from 'react-redux';
import { PlayControls } from '../Components/PlayControls';
import { minimizePlayer, changePlaylist, setTrackIndex, advertisments, changePlayerState, setUserData, setAccessToken, likeUnlikeSong } from '../redux/actions/actions';
import { useEffect } from 'react';
import { apiHandler } from '../constants/apiHandler';
import { PODCASTS_IMAGE_BASE_URL, windowWidth, windowHeight } from '../constants/globalConstants'
import LinearGradient from 'react-native-linear-gradient';

const Podcasts = (props) => {

    const [podcasts, setPodcasts] = useState([]);

    const getInitialData = async () => {
        let token = props.accessToken
        let allPodcasts = await apiHandler.getAllPodcasts(token)
        setPodcasts(allPodcasts)
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


    const onEpisodePress = (item) => {
        props.navigation.navigate(navigationStrings.PodcastEpisodes, { title: item.name, episodes: item.episodes })
    }

    const dispatch = useDispatch()

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

    const onBackPress = () => {
        props.navigation.goBack()
    }


    return (
        <View style={commonStyles.fullScreenContainerBlack(props.isPlayerMinimized)}>
            <LinearGradient
                style={commonStyles.linearGradientStyle}
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                colors={['#ffffff77', '#ffffff55', '#ffffff33', '#ffffff11', '#ffffff11', '#ffffff22', '#ffffff44', '#ffffff66', '#ffffff99']}
            />
            <MainHeader2 leftImage={imagePath.backIcon} onLeftIconPress={onBackPress} />
            <View style={commonStyles.flexFull}>
                <Text style={commonStyles.textWhiteBold(36, { alignSelf: 'flex-start', marginLeft: 15 })}>
                    All Podcasts
                </Text>
                <View style={{ flex: 1, alignSelf: 'center' }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {
                            podcasts && podcasts.length > 0 && podcasts.map((item, index, self) => {
                                return <TouchableOpacity key={index} style={[styles.singleOptionContainer, { marginBottom: marginBottom = index == self.length - 1 && props.isPlayerMinimized ? 70 : 0 }]} onPress={() => {
                                    onEpisodePress(item)
                                }}>
                                    <Image style={styles.singleImageStyle} source={item.image == '' ? imagePath.dummyArtist : { uri: PODCASTS_IMAGE_BASE_URL + item.image }} resizeMode='stretch' />
                                    <View style={{ flex: 1, marginLeft: 10, justifyContent: 'center' }}>
                                        <Text style={commonStyles.textWhiteBold(20)}>
                                            {item.name}
                                        </Text>
                                        <Text style={commonStyles.textLightNormal(16)}>
                                            {item.episodes.length + ' Episodes'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            })
                        }
                    </ScrollView>
                </View>
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

export default connect(mapStateToProps)(Podcasts)

const styles = StyleSheet.create({
    singleOptionContainer: { flexDirection: 'row', width: windowWidth - 40, alignSelf: 'center', marginTop: 10 },
    singleImageStyle: { height: 80, width: 100 }
})

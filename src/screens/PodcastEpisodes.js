import React, { useState } from 'react'
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet, FlatList, BackHandler } from 'react-native'
import { commonStyles } from '../constants/commonStyles';
import { navigationStrings } from '../navigation/navigationStrings';
import { imagePath } from '../constants/imagePath';
import { MainHeader2 } from '../Components/MainHeader2';
import { connect, useDispatch } from 'react-redux';
import { PlayControls } from '../Components/PlayControls';
import { minimizePlayer, setTrackIndex, changePlayerState, setUserData, setAccessToken, likeUnlikeSong, changePlaylist, playPausePodcast } from '../redux/actions/actions';
import { useEffect } from 'react';
import { windowWidth, PODCASTS_EPISODE_IMAGES_BASE_URL, windowHeight } from '../constants/globalConstants'
import { useRoute } from '@react-navigation/native';
import { colors } from '../constants/colors';
import LinearGradient from 'react-native-linear-gradient';

const PodcastEpisodes = (props) => {

    const route = useRoute()
    const dispatch = useDispatch()
    const isLiked = route.params.isLiked || false
    const [episodes, setEpisodes] = useState(route.params.episodes);

    const podcastName = route.params.title
    useEffect(() => {
        // const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton)
        // return () => backHandler.remove()
        // getInitialData()
    }, [])

    // const getInitialData = async () => {
    //     let token = props.accessToken
    //     let allPodcasts = await apiHandler.getAllPodcasts(token)
    //     setPodcasts(allPodcasts)
    // }

    const handleBackButton = () => {
        if (props.navigation.canGoBack()) {
            props.navigation.goBack()
        }
    }

    const onSongPress = (item) => {
        dispatch(changePlaylist(episodes, 0, true, false))
        dispatch(changePlayerState(true))
        dispatch(minimizePlayer(false))
        props.navigation.navigate(navigationStrings.PlaySong, { header: podcastName })
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

    const onBackPress = () => {
        props.navigation.goBack()
    }

    const renderEpisode = (item, index) => {
        return <TouchableOpacity key={index} style={[styles.singleSongFullContainer, { marginBottom: marginBottom = index == episodes.length - 1 && props.isPlayerMinimized ? 70 : 0 }]} onPress={onSongPress}>
            <Image source={item.image && item.image != '' ? { uri: PODCASTS_EPISODE_IMAGES_BASE_URL + item.image } : imagePath.dummySong} style={{ height: '100%', width: 70 }} resizeMode='cover' />
            <View style={styles.singleSongInnerContainer}>
                <Text style={commonStyles.textWhiteNormal(16)}>
                    {item.title}
                </Text>
                <Text numberOfLines={1} style={commonStyles.textLightNormal(12, { marginLeft: 5, fontFamily: 'Roboto' })}>
                    {item.description}
                </Text>
            </View>
        </TouchableOpacity>
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
                <ScrollView>
                    <Text style={commonStyles.textWhiteBold(24, { alignSelf: 'flex-start' })}>
                        {!isLiked ? 'Episodes for ' + route.params.title : 'Liked Podcast Episodes'}
                    </Text>
                    {episodes.map((item, index) => {
                        return renderEpisode(item, index)
                    })}
                    {/* <FlatList
                        data={episodes}
                        renderItem={renderEpisode}
                        keyExtractor={(item, index) => item.id.toString()} /> */}
                </ScrollView>
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

export default connect(mapStateToProps)(PodcastEpisodes)

const styles = StyleSheet.create({
    singlePlaylistContainer: { marginTop: 10 },
    singleOptionContainer: (isLastElement) => {
        return { marginRight: isLastElement ? 0 : 10 }
    },
    singleImageStyle: { height: 160, width: 160 },
    singleSongFullContainer: { flexDirection: 'row', marginTop: 15, alignItems: 'center', width: windowWidth * 0.9, height: 60 },
    singleSongInnerContainer: { flex: 1, alignItems: 'flex-start', marginLeft: 10 },
})
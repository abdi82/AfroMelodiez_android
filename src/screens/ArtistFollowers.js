import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, Image, StyleSheet, FlatList, BackHandler } from 'react-native'
import { commonStyles } from '../constants/commonStyles';
import { navigationStrings } from '../navigation/navigationStrings';
import { imagePath } from '../constants/imagePath';
import { MainHeader2 } from '../Components/MainHeader2';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { windowWidth, ARTISTS_IMAGE_BASE_URL, eSongListType, windowHeight } from '../constants/globalConstants';
import { connect, useDispatch } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PlayControls } from '../Components/PlayControls';
import { minimizePlayer, changePlaylist, setTrackIndex, advertisments, changePlayerState, setUserData, setAccessToken, likeUnlikeSong } from '../redux/actions/actions';
import { LoadingComponent } from '../Components/LoadingComponent';
import { apiHandler } from '../constants/apiHandler';
import { ActivityIndicator } from 'react-native-paper';
import { colors } from '../constants/colors';
import LinearGradient from 'react-native-linear-gradient';

const ArtistFollowers = (props) => {

    const route = useRoute()
    const [followers, setFollowers] = useState(route.params.data)
    const [isLoading, setIsLoading] = useState(false)
    const artistName = route.params.artistName

    const handleBackButton = () => {
        if (props.navigation.canGoBack()) {
            props.navigation.goBack()
        }
    }

    useEffect(() => {
        // const backHandler = BackHandler.addEventListener(
        //     "hardwareBackPress",
        //     handleBackButton
        // )
        // return () => backHandler.remove();
    }, [])

    useFocusEffect(React.useCallback(() => {
        // async function getArtists() {
        //         setIsLoading(true)
        //         const favouriteArtists = await apiHandler.getFollowedArtists(props.accessToken, props.userData.id)
        //         setArtists(favouriteArtists)
        //         setIsLoading(false)
        // }
        // getArtists()
    }, []))

    const renderSingleFollower = useCallback(({ item, index }) => {
        return <TouchableOpacity key={index} style={[styles.singleSearchResultFullContainer, { marginBottom: index == followers.length - 1 && props.isPlayerMinimized ? 60 : 10 }]} onPress={() => {
            onSingleArtistPress(item)
        }}>
            <Image source={item.profile_photo_url == '' ? imagePath.dummyArtist : { uri: item.profile_photo_url }} style={styles.searchResultImageStyle} />
            <View style={styles.singleSearchResultDetailsContainer}>
                <Text style={commonStyles.textWhiteBold(18)}>
                    {item.name}
                </Text>
                <Text style={commonStyles.textLightNormal(14)}>
                    {item.email}
                </Text>
            </View>
        </TouchableOpacity>
    }, [])

    const keyExtractor = useCallback((item) => { item.id.toString() }, [])

    const renderFollowersList = () => {
        return <FlatList
            data={followers}
            renderItem={renderSingleFollower}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
        // maxToRenderPerBatch={15}
        />
    }

    const onLeftIconPress = () => {
        props.navigation.goBack()
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

    return (
        isLoading ? <LoadingComponent isVisible={isLoading} />
            :
            <View style={commonStyles.fullScreenContainerBlack(props.isPlayerMinimized)}>
                <LinearGradient
                    style={commonStyles.linearGradientStyle}
                    start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                    colors={['#ffffff77', '#ffffff55', '#ffffff33', '#ffffff11', '#ffffff11', '#ffffff22', '#ffffff44', '#ffffff66', '#ffffff99']}
                />
                <MainHeader2 onLeftIconPress={onLeftIconPress} leftImage={imagePath.backIcon} headerPrimaryTitle={`Followers`} rightIcon={imagePath.threeDotsIcon} />
                <View style={commonStyles.flexFull}>
                    {followers && followers.length > 0 && renderFollowersList()}
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

export default connect(mapStateToProps)(ArtistFollowers)

const styles = StyleSheet.create({
    singleSearchResultFullContainer: { flexDirection: 'row', alignItems: 'center', width: windowWidth - 30, minHeight: 70, marginBottom: 10 },
    searchResultImageStyle: { height: '100%', width: 70, resizeMode: 'stretch' },
    singleSearchResultDetailsContainer: { flex: 1, marginLeft: 10 },
    nextIconImage: { height: 12, width: 12 }
})

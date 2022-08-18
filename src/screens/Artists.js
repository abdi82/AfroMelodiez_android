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

const Artists = (props) => {

    const route = useRoute()
    const isFollowed = route.params.isFollowed || false
    const [artists, setArtists] = useState(isFollowed ? route.params.data : [])
    const [isLoading, setIsLoading] = useState(false)
    const [skip, setSkip] = useState(0)
    const [isListLoading, setIsListLoading] = useState(false)
    const headerTitle = route.params.headerTitle

    const allArtists = headerTitle == 'All Artists'


    const handleBackButton = () => {
        if (props.navigation.canGoBack()) {
            props.navigation.goBack()
        }
    }

    const getInitialData = async () => {
        if (!isFollowed) {
            setIsLoading(true)
            const token = props.accessToken
            const artists = allArtists ? await apiHandler.getArtists(token, skip)
                :
                await apiHandler.getBestArtists(token)
            setArtists(artists)
            let currentSkip = skip
            currentSkip += 15
            setSkip(currentSkip)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        // const backHandler = BackHandler.addEventListener(
        //     "hardwareBackPress",
        //     handleBackButton
        // )
        getInitialData()
        // return () => backHandler.remove();
    }, [])

    useFocusEffect(React.useCallback(() => {
        async function getArtists() {
            if (isFollowed) {
                setIsLoading(true)
                const favouriteArtists = await apiHandler.getFollowedArtists(props.accessToken, props.userData.id)
                setArtists(favouriteArtists)
                setIsLoading(false)
            }
        }
        getArtists()
    }, []))

    const getMoreData = async () => {
        if (allArtists && !isFollowed) {
            setIsListLoading(true)
            let currentSkip = skip
            currentSkip += 15
            const token = props.accessToken
            let newArtists = await apiHandler.getArtists(token, currentSkip)
            setArtists([...artists, ...newArtists])
            setSkip(currentSkip)
            setIsListLoading(false)
        }
    }

    const onSingleArtistPress = (item) => {
        props.navigation.navigate(navigationStrings.SongsList, { data: item, songListType: eSongListType.Artist })
    }

    const renderSingleArtist = useCallback(({ item, index }) => {
        console.log('This is the single artist', item)
        return <TouchableOpacity key={index} style={[styles.singleSearchResultFullContainer, { marginBottom: index == artists.length - 1 && props.isPlayerMinimized ? 80 : 10 }]} onPress={() => {
            onSingleArtistPress(item)
        }}>
            <Image source={item.image == '' ? imagePath.dummyArtist : { uri: ARTISTS_IMAGE_BASE_URL + item.image }} style={styles.searchResultImageStyle} />
            <View style={styles.singleSearchResultDetailsContainer}>
                <View style={{ flex: 1, alignSelf: 'flex-start', justifyContent: 'flex-start' }}>
                    <Text style={commonStyles.textWhiteNormal(16)}>
                        {item.name}
                    </Text>
                </View>
                <Image source={imagePath.nextIcon} style={styles.nextIconImage} resizeMode='contain' />
            </View>
        </TouchableOpacity>
    }, [])

    const keyExtractor = useCallback((item) => { item.id.toString() }, [])

    const renderArtistsList = () => {
        return <FlatList
            data={artists}
            renderItem={renderSingleArtist}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            onEndReached={() => { getMoreData() }}
            onEndReachedThreshold={0.1}
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
                <MainHeader2 onLeftIconPress={onLeftIconPress} leftImage={imagePath.backIcon} headerPrimaryTitle={headerTitle} rightIcon={imagePath.threeDotsIcon} />
                <View style={commonStyles.flexFull}>
                    {renderArtistsList()}
                    {isListLoading && <View style={commonStyles.listLoaderComponent}>
                        <ActivityIndicator color={colors.green} size={'large'} />
                    </View>}
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

export default connect(mapStateToProps)(Artists)

const styles = StyleSheet.create({
    singleSearchResultFullContainer: { flexDirection: 'row', alignItems: 'center', width: windowWidth - 30, minHeight: 70, marginBottom: 10 },
    searchResultImageStyle: { height: '100%', width: 70, resizeMode: 'stretch' },
    singleSearchResultDetailsContainer: { flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginLeft: 10, alignItems: 'center' },
    nextIconImage: { height: 12, width: 12 }
})

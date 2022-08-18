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
import LinearGradient from 'react-native-linear-gradient';

const FeaturedArtists = (props) => {

    const route = useRoute()
    const [featuredArtists, setFeaturedArtists] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const getInitialData = async () => {
        setIsLoading(true)
        const token = props.accessToken
        const featuredArtists = await apiHandler.getAllFeaturedArtists(token)
        console.log('These are the featured artists', featuredArtists)
        setFeaturedArtists(featuredArtists)
        setIsLoading(false)
    }

    useEffect(() => {
        getInitialData()
    }, [])

    const onSingleArtistPress = (item) => {
        props.navigation.navigate(navigationStrings.SongsList, { data: item.Artist, songListType: eSongListType.Artist, isFeatured: true, songs: item.Song })
    }

    const renderSingleArtist = useCallback(({ item, index }) => {
        return <TouchableOpacity key={index} style={[styles.singleSearchResultFullContainer, { marginBottom: index == featuredArtists.length - 1 && props.isPlayerMinimized ? 80 : 10 }]} onPress={() => {
            onSingleArtistPress(item)
        }}>
            <Image source={item.Artist.image == '' ? imagePath.dummyArtist : { uri: ARTISTS_IMAGE_BASE_URL + item.Artist.image }} style={styles.searchResultImageStyle} />
            <View style={styles.singleSearchResultDetailsContainer}>
                <View style={{ flex: 1, alignSelf: 'flex-start', justifyContent: 'flex-start' }}>
                    <Text style={commonStyles.textWhiteNormal(16)}>
                        {item.Artist.name}
                    </Text>
                </View>
                <Image source={imagePath.nextIcon} style={styles.nextIconImage} resizeMode='contain' />
            </View>
        </TouchableOpacity>
    }, [])

    const keyExtractor = useCallback((item) => { item.Artist.id.toString() }, [])

    const renderArtistsList = () => {
        return <FlatList
            data={featuredArtists}
            renderItem={renderSingleArtist}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
        // onEndReached={() => { getMoreData() }}
        // onEndReachedThreshold={0.1}
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
                <MainHeader2 onLeftIconPress={onLeftIconPress} leftImage={imagePath.backIcon} headerPrimaryTitle={'Featured Artists'} rightIcon={imagePath.threeDotsIcon} />
                <View style={commonStyles.flexFull}>
                    {renderArtistsList()}
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

export default connect(mapStateToProps)(FeaturedArtists)

const styles = StyleSheet.create({
    singleSearchResultFullContainer: { flexDirection: 'row', alignItems: 'center', width: windowWidth - 30, minHeight: 70, marginBottom: 10 },
    searchResultImageStyle: { height: '100%', width: 70, resizeMode: 'stretch' },
    singleSearchResultDetailsContainer: { flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginLeft: 10, alignItems: 'center' },
    nextIconImage: { height: 12, width: 12 }
})

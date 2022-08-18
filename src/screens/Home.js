import React, { useState, useRef, useEffect, useCallback } from 'react'
import { View, Text, Image, ScrollView, FlatList, TouchableOpacity, StyleSheet, BackHandler } from 'react-native'
import { commonStyles } from '../constants/commonStyles';
import { navigationStrings } from '../navigation/navigationStrings';
import { imagePath } from '../constants/imagePath';
import { colors } from '../constants/colors';
import { MainHeader2 } from '../Components/MainHeader2';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { LoadingComponent } from '../Components/LoadingComponent';
import { apiHandler } from '../constants/apiHandler';
import { ARTISTS_IMAGE_BASE_URL, eSongListType, SONGS_IMAGE_BASE_URL, windowWidth, CATEGORIES_BASE_URL, windowHeight, downloadsPath, FEATURED_PLAYLISTS_BASE_URL, ALBUMS_BASE_URL } from '../constants/globalConstants';
import { connect, useDispatch } from 'react-redux';
import AppIntroSlider from 'react-native-app-intro-slider'
import { PlayControls } from '../Components/PlayControls';
import { minimizePlayer, changePlaylist, setTrackIndex, advertisments, changePlayerState, setLikedSongs, likeUnlikeSong, setLikedPodcasts, setUserSettings, setDownloadedSongs, setUserData } from '../redux/actions/actions';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient'
import { PressableImage } from '../Components/PressableImage';
import RNFetchBlob from 'rn-fetch-blob';

const Home = (props) => {

    const [homeData, setHomeData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isListLoading, setIsListLoading] = useState(false)
    const [advertisements, setAdvertisements] = useState([])

    const dispatch = useDispatch()

    const onBackPress = () => {
        if (props.navigation.isFocused()) {
            BackHandler.exitApp()
        }
    }

    const focusHandler = () => {
        BackHandler.addEventListener('hardwareBackPress', onBackPress)
    }

    const blurHandler = () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }

    useEffect(() => {
        // props.navigation.addListener('focus', focusHandler)
        // props.navigation.addListener('blur', blurHandler)
        getInitialData()
    }, [])

    const getHeader = () => {
        let time = new Date().getHours()
        if (time < 12) {
            return 'Good morning'
        }
        else if (time < 18) {
            return 'Good afternoon'
        }
        else {
            return 'Good evening'
        }
    }

    const getInitialData = () => {
        setIsLoading(true)
        const token = props.accessToken
        console.log('Token is', token)
        apiHandler.getUserData(token).then((userDataResponse) => {
            let userData = userDataResponse.data
            dispatch(setUserData(userData))
            apiHandler.getAdvertisements(token).then((advertisements) => {
                dispatch(advertisments(advertisements))
                advertisements = advertisements.filter((item) => {
                    return item.banner_type == 'l' && item.type == 'video'
                })
                setAdvertisements(advertisements)
                // dispatch(setDownloadedSongs(downloads))
                apiHandler.getLikedSongs(token, userData.id).then((serverLikedSongs) => {
                    dispatch(setLikedSongs(serverLikedSongs))
                    apiHandler.getUserSettings(token, userData.id).then((userSettings) => {
                        let settings = {
                            userID: userData.id,
                            dataSaver: 0,
                            downloadOnly: 0,
                            StreamOnly: 0,
                            crossfade: 0,
                            gapless: 0,
                            automix: 0,
                            autoplay: 0,
                        }
                        if (typeof (userSettings.data.data) !== 'string') {
                            userSettings = userSettings.data.data[0]
                            settings.StreamOnly = userSettings.StreamOnly
                            settings.automix = userSettings.automix
                            settings.autoplay = userSettings.autoplay
                            settings.crossfade = userSettings.crossfade
                            settings.dataSaver = userSettings.dataSaver
                            settings.downloadOnly = userSettings.downloadOnly
                            settings.gapless = userSettings.gapless
                        }
                        console.log('Settings are', settings)
                        dispatch(setUserSettings(settings))
                        apiHandler.getLikedPodcasts(token, userData.id).then((likedPodcasts) => {
                            dispatch(setLikedPodcasts(likedPodcasts))
                            apiHandler.getHomeData(token, userData.id).then((homeListing) => {
                                let homeData = []
                                homeData = Object.keys(homeListing).map((item, index) => {
                                    return {
                                        id: index,
                                        title: item,
                                        items: Array.isArray(homeListing[item]) ? homeListing[item] : []
                                    }
                                })
                                homeData.push({
                                    title: 'Popular Music',
                                    items: [{
                                        id: 0,
                                        name: 'Popular Videos',
                                        backgroundColor: '#0727ce'
                                    }]
                                })
                                setHomeData(homeData)
                                setIsLoading(false)
                            })
                        })
                    })
                })
            })
        })
    }

    const adRef = useRef()

    // let i = 0;

    const changeAdvertisementBanner = (index) => {
        let newIndex = index + 1
        if (index == props.advertisements.length - 1) {
            adRef.current.goToSlide(0, true);
        }
        else {
            adRef.current.goToSlide(newIndex, true);
        }
    }

    const onSettingsIconPress = () => {
        props.navigation.navigate(navigationStrings.Settings)
    }

    const rightFirstIcon = () => {
        return <FontAwesome name='bell-o' style={styles.rightIconStyle(true)} onPress={onLatestSongsPress} />
    }

    const onLatestSongsPress = () => {
        props.navigation.navigate(navigationStrings.NewSongsListing)
    }

    const onHistoryPress = () => {
        props.navigation.navigate(navigationStrings.SongsListingByDate)
    }

    const rightSecondIcon = () => {
        return <FontAwesome name='history' style={styles.rightIconStyle(true)} onPress={onHistoryPress} />
    }

    const rightThirdIcon = () => {
        return <FontAwesome name='gear' style={styles.rightIconStyle(false)} onPress={onSettingsIconPress} />
    }

    const onSingleAdvertisementPress = async (item) => {
        let reqObj = {
            user_id: props.userData.id,
            ad_id: item.id
        }
        await apiHandler.storeAdvertisementData(props.accessToken, reqObj)
        props.navigation.navigate(navigationStrings.AppWebView, { source: item.url })
    }

    const renderBannerItem = ({ item, index }) => {
        // if (item.type == 'image') {
        //     if (index < props.advertisements.length - 1) {
        //         setTimeout(() => {
        //             console.log('Called for', index)
        //             adRef.current.goToSlide(index + 1, true)
        //         },
        //             3000)
        //     }
        //     else {
        //         setTimeout(() => {
        //             console.log('Called')
        //             adRef.current.goToSlide(0, true)
        //         },
        //             3000)
        //         // adRef.goToSlide(index + 1, true);
        //     }
        // }
        return (
            item.type == 'video' ?
                <TouchableOpacity key={index} style={commonStyles.flexFull} onPress={() => { onSingleAdvertisementPress(item) }}>
                    <Video
                        source={{ uri: 'https://api.afromelodiez.com/storage/ad/' + item.attachment }}
                        muted={true}
                        resizeMode='cover'
                        style={{ height: 180 }}
                        onLoadStart={() => {
                            console.log('Loading start')
                            // setShowImage(true)
                        }}
                        onLoad={() => {
                            console.log('Loaded')
                            // setShowImage(false)
                        }}
                        // poster={'https://st3.depositphotos.com/11963282/14669/v/600/depositphotos_146690125-stock-illustration-progress-loading-bar.jpg'}
                        onEnd={() => { changeAdvertisementBanner(index) }} />
                </TouchableOpacity>
                :
                <PressableImage onPress={() => { onSingleAdvertisementPress(item) }} imageStyle={{ flex: 1, resizeMode: 'stretch' }} imageSource={{ uri: 'https://api.afromelodiez.com/storage/ad/' + item.attachment }}>
                </PressableImage>
        );
    }

    const getMoreData = () => {
        let data = [{
            id: 4,
            title: 'All Categories',
            items: categories
        },
        {
            id: 5,
            title: 'Mix Songs',
            items: mixSongs
        },
        {
            id: 6,
            title: 'Most Played Songs',
            items: mostPlayedSongs
        },
        {
            id: 7,
            title: 'Artists',
            items: artists
        }]
        setHomeData([...homeData, ...data])
    }

    const onScrollEnd = () => {
        const token = props.accessToken
        setIsListLoading(true)
        setTimeout(() => {
            setIsListLoading(false)
        }, 800)
    }

    const onItemPress = (item, innerItem, innerIndex) => {
        let title = item.title
        switch (title) {
            case 'Artists':
                props.navigation.navigate(navigationStrings.SongsList, { data: innerItem, songListType: eSongListType.Artist })
                break;
            case 'Best of Artists':
                props.navigation.navigate(navigationStrings.SongsList, { data: innerItem, songListType: eSongListType.Artist })
                break;
            case 'Albums':
                props.navigation.navigate(navigationStrings.Albums, { data: innerItem })
                break;
            case 'Mix Songs':
                dispatch(changePlaylist(item.items, innerIndex, false, false))
                // dispatch(changePlayerState(true))
                dispatch(minimizePlayer(false))
                // dispatch(setIsPlaying())
                props.navigation.navigate(navigationStrings.PlaySong, { songDetails: item.items, isPlaylist: true, header: 'Mix Songs', initialIndex: innerIndex })
                break;
            case 'Trending Songs':
                dispatch(changePlaylist(item.items, innerIndex, false, false))
                // dispatch(changePlayerState(true))
                dispatch(minimizePlayer(false))
                // dispatch(setIsPlaying())
                props.navigation.navigate(navigationStrings.PlaySong, { songDetails: item.items, isPlaylist: true, header: 'Trending Songs', initialIndex: innerIndex })
                break;
            case 'Categories':
                if (innerItem.name == 'Podcast') {
                    props.navigation.navigate(navigationStrings.Podcasts)
                }
                else {
                    props.navigation.navigate(navigationStrings.SongsByCategory, { data: innerItem, songListType: eSongListType.Category })
                }
                break;
            case 'Popular Songs':
                dispatch(changePlaylist(item.items, innerIndex, false, false))
                dispatch(changePlayerState(true))
                dispatch(minimizePlayer(false))
                props.navigation.navigate(navigationStrings.PlaySong, { songDetails: item.items, isPlaylist: true, header: 'Popular Songs', initialIndex: innerIndex })
                break;
            case 'Latest Songs':
                dispatch(changePlaylist(item.items, innerIndex, false, false))
                dispatch(changePlayerState(true))
                dispatch(minimizePlayer(false))
                props.navigation.navigate(navigationStrings.PlaySong, { songDetails: item.items, isPlaylist: true, header: 'Latest Songs', initialIndex: innerIndex })
                // dispatch(setIsPlaying())
                break;
            case 'Selected Playlists':
                props.navigation.navigate(navigationStrings.SongsByPlaylist, { data: innerItem })
                break;
            case 'Featured Artists':
                props.navigation.navigate(navigationStrings.SongsList, { data: innerItem.Artist, songListType: eSongListType.Artist, isFeatured: true, songs: innerItem.Song })
                break;
            default:
                break;
        }
    }

    const onViewAllPress = (item) => {
        const title = item.title
        switch (title) {
            case 'Artists':
                props.navigation.navigate(navigationStrings.Artists, { headerTitle: 'All Artists' })
                break;
            case 'Mix Songs':
                props.navigation.navigate(navigationStrings.MixSongs, { headerTitle: 'Mix Songs' })
                break;
            case 'Categories':
                props.navigation.navigate(navigationStrings.Categories)
                break;
            case 'Popular Songs':
                props.navigation.navigate(navigationStrings.MixSongs, { headerTitle: 'Popular Songs' })
                break;
            case 'Trending Songs':
                props.navigation.navigate(navigationStrings.MixSongs, { headerTitle: 'Trending Songs' })
                break;
            case 'Best of Artists':
                props.navigation.navigate(navigationStrings.Artists, { headerTitle: 'Best Artists' })
                break;
            case 'Albums':
                props.navigation.navigate(navigationStrings.AlbumsListing, { isFavourite: false })
                break;
            case 'Latest Songs':
                props.navigation.navigate(navigationStrings.NewSongsListing)
                break;
            case 'Featured Artists':
                props.navigation.navigate(navigationStrings.FeaturedArtists)
                break;
            default:
                break;
        }
    }

    const onPopularVideosPress = (id) => {
        switch (id) {
            case 0:
                props.navigation.navigate(navigationStrings.VideosList)
                break;
            case 1:
                props.navigation.navigate(navigationStrings.Podcasts)
                break;
            case 2:

                break;
            default:
                break;
        }
    }

    const renderSingleView = ({ item, index }) => {
        return item.items && item.items.length > 0 && item.title !== 'success' && (item.title == 'Popular Music' ?
            <View key={index} style={{ marginTop: 50, borderRadius: 12, marginBottom: props.isPlayerMinimized ? 70 : 0 }}>
                <View style={styles.listTextContainer}>
                    <Text style={commonStyles.textWhiteBold(22)}>
                        {item.title}
                    </Text>
                </View>
                {
                    item && item.items && item.items.length > 0 && item.items.map((innerItem, innerIndex, self) => {
                        const isLastElement = (innerIndex == self.length - 1)
                        return innerIndex < 5 && <TouchableOpacity key={innerIndex} onPress={() => { onPopularVideosPress(innerIndex) }} style={{ width: windowWidth - 30, borderRadius: 12, height: 130, justifyContent: "center", backgroundColor: innerItem.backgroundColor, alignItems: 'center', marginRight: isLastElement ? 0 : 15 }} >
                            <Text style={commonStyles.textWhiteNormal(24)}>
                                {innerItem.name}
                            </Text>
                        </TouchableOpacity>
                    })
                }
            </View>
            :
            <View key={index} style={styles.singlePlaylistContainer}>
                <View style={styles.listTextContainer}>
                    <Text style={commonStyles.textWhiteBold(22)}>
                        {item.title}
                    </Text>
                    {item.title !== 'Selected Playlists' && <Text style={commonStyles.textWhiteNormal(18, { color: colors.green })} onPress={() => { onViewAllPress(item) }}>
                        View All
                    </Text>}
                </View>
                <View style={commonStyles.flexFull}>
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                        {
                            item && item.items && item.items.length > 0 && item.items.map((innerItem, innerIndex, self) => {
                                const isLastElement = (innerIndex == self.length - 1)
                                return innerIndex < 10 && (
                                    item.title == 'Categories' ?
                                        <TouchableOpacity key={innerIndex} onPress={() => { onItemPress(item, innerItem, innerIndex) }} style={styles.singleOptionContainer(isLastElement, index)} >
                                            <View style={{ height: 130, width: 140, borderRadius: 30, backgroundColor: innerItem.bg_color, justifyContent: 'center' }} >
                                                <Text numberOfLines={1} style={commonStyles.textWhiteNormal(14, { marginLeft: 10 })}>
                                                    {innerItem.name}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                        :
                                        item.title == 'Featured Artists' ?
                                            <TouchableOpacity key={innerIndex} onPress={() => { onItemPress(item, innerItem, innerIndex) }} style={styles.singleOptionContainer(isLastElement, index)} >
                                                <Image style={{ height: 140, width: 140, borderRadius: 70, resizeMode: 'cover' }} thumbnailSource={imagePath.dummyArtist} source={innerItem.Artist.image == '' ? imagePath.dummyArtist : { uri: ARTISTS_IMAGE_BASE_URL + innerItem.Artist.image }} />
                                                <Text numberOfLines={1} style={commonStyles.textLightNormal(14, { alignSelf: 'center', marginTop: 5 })}>
                                                    {innerItem.Artist.name}
                                                </Text>
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity key={innerIndex} onPress={() => { onItemPress(item, innerItem, innerIndex) }} style={styles.singleOptionContainer(isLastElement, index)} >
                                                <Image style={{ height: 140, width: 140, borderRadius: (index == 2 || index == 4 || index == 7) ? 70 : index == 2 ? 20 : 0, resizeMode: 'cover' }} thumbnailSource={imagePath.dummyArtist} source={(item.title.trim() == 'Albums') ? (innerItem.image == '' ? imagePath.dummyArtist : { uri: ALBUMS_BASE_URL + innerItem.image }) : (item.title == 'Selected Playlists') ? (innerItem.image == '' ? imagePath.dummyArtist : { uri: FEATURED_PLAYLISTS_BASE_URL + innerItem.image }) : (item.title == 'Artists' || item.title == 'Best of Artists') ? (innerItem.image == '' ? imagePath.dummyArtist : { uri: ARTISTS_IMAGE_BASE_URL + innerItem.image }) : item.title == 'All Categories' ? (innerItem.image == '' ? imagePath.dummyArtist : { uri: CATEGORIES_BASE_URL + innerItem.image }) : (innerItem.song_image == '' || innerItem.song_image == null ? imagePath.dummySong : { uri: SONGS_IMAGE_BASE_URL + innerItem.song_image })} />
                                                <Text numberOfLines={1} style={commonStyles.textLightNormal(14, { alignSelf: (index == 2 || index == 4 || index == 7) ? 'center' : 'flex-start', marginTop: 5 })}>
                                                    {innerItem.name}
                                                </Text>
                                            </TouchableOpacity>)
                            })
                        }
                    </ScrollView>
                </View>
            </View>)
    }

    // const maximizePlayer = () => {
    //     dispatch(minimizePlayer(false))
    //     props.navigation.navigate(navigationStrings.PlaySong, { songDetails: props.currentSong })
    // }

    // const updateTrackIndex = (index) => {
    //     dispatch(setTrackIndex(index))
    // }

    const handleInfinityScroll = (event) => {
        let mHeight = event.nativeEvent.layoutMeasurement.height;
        let cSize = event.nativeEvent.contentSize.height;
        let Y = event.nativeEvent.contentOffset.y;
        if (Math.ceil(mHeight + Y) >= cSize) {
            return true;
        }
        return false;
    }

    // const showHideLogoutModal = () => {
    //     setShowLogoutModal(!showLogoutModal)
    // }

    // const onLogoutPress = () => {
    //     AsyncStorageFunctions.removeItem('token').then((res) => {
    //         props.navigation.dispatch(
    //             CommonActions.reset({
    //                 index: 1,
    //                 routes: [
    //                     { name: navigationStrings.Splash },
    //                 ],
    //             })
    //         );
    //     })
    //     setShowLogoutModal(false)
    // }

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

    const onScroll = (event) => {
        // setHeight(event.nativeEvent.contentOffset.y)
        // let mHeight = event.nativeEvent.layoutMeasurement.height;
        // let cSize = event.nativeEvent.contentSize.height;
        // let Y = event.nativeEvent.contentOffset.y;
        // if (Math.ceil(mHeight + Y) >= cSize) {
        //     return true;
        // }
        // return false;
    }

    const likeUnlikeSongPress = (id) => {
        dispatch(likeUnlikeSong(id))
    }

    const keyExtractor = useCallback((item) => { item.title.toString() }, [])

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
                    <MainHeader2 headerPrimaryTitle={getHeader() + ' ' + props?.userData?.name?.split(' ')[0] + '!'} rightFirstIcon={rightFirstIcon} rightSecondIcon={rightSecondIcon} rightThirdIcon={rightThirdIcon} />
                    <View style={commonStyles.flexFull}>
                        <FlatList
                            // ref={listRef}
                            data={homeData}
                            renderItem={renderSingleView}
                            showsVerticalScrollIndicator={false}
                            removeClippedSubviews={true}
                            keyExtractor={keyExtractor}
                            ListHeaderComponent={() => {
                                return <View style={styles.bannerContainer}>
                                    <AppIntroSlider
                                        renderItem={renderBannerItem}
                                        data={advertisements ? advertisements : []}
                                        showNextButton={false}
                                        renderPagination={() => null}
                                        showDoneButton={false}
                                        ref={(ref) => (adRef.current = ref)}
                                    // onSlideChange={(index,lastIndex)=>{adRef.current.goToSlide(lastIndex)}}
                                    />
                                </View>
                            }}
                        />
                    </View>
                </View>
                {
                    (props.isPlayerMinimized) &&
                    <PlayControls likeUnlikeSong={(id) => { likeUnlikeSongPress(id) }} likedSongs={props.likedSongs} isPlaying={props.isPlaying} setIsPlaying={(value) => { updatePlayingState(value) }} changePlayerState={maximizePlayer} updateIndex={(index) => { updateTrackIndex(index) }} currentIndex={props.currentTrackIndex} currentPlaylist={props.currentPlaylist} playCount={props.playCount} isMinimized={props.isPlayerMinimized} userData={props.userData} token={props.accessToken} />
                }
            </View>
    )
}

const mapStateToProps = (state) => {
    return { userData: state.userData, accessToken: state.accessToken, isPlayerMinimized: state.isPlayerMinimized, currentPlaylist: state.currentPlaylist, playCount: state.playCount, advertisements: state.advertisements, currentTrackIndex: state.currentTrackIndex, isPlaying: state.isPlaying, likedSongs: state.likedSongsIds }
}

export default connect(mapStateToProps)(Home)

const styles = StyleSheet.create({
    singlePlaylistContainer: { marginTop: 50 },
    singleOptionContainer: (isLastElement, index) => {
        return { width: 140, borderRadius: index == 1 || index == 4 ? 60 : 0, marginRight: isLastElement ? 0 : 15 }
    },
    singleImageStyle: { height: 120, width: '100%', resizeMode: 'stretch' },
    rightIconStyle: (margin) => {
        return { fontSize: 22, color: colors.white, marginRight: margin ? 20 : 0 }
    },
    bannerContainer: { height: 180, width: windowWidth - 20, backgroundColor: colors.black, },
    listTextContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 10, justifyContent: 'space-between' }
})

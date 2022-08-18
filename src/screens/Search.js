import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ImageBackground, ScrollView, FlatList, KeyboardAvoidingView, PixelRatio, Keyboard, BackHandler, ActivityIndicator } from 'react-native'
import { commonStyles } from '../constants/commonStyles';
import { navigationStrings } from '../navigation/navigationStrings';
import { imagePath } from '../constants/imagePath';
import { PrimarySearchBar } from '../Components/PrimarySearchBar';
import { colors } from '../constants/colors';
import DropDownPicker from 'react-native-dropdown-picker'
import { MainHeader2 } from '../Components/MainHeader2';
import { apiHandler } from '../constants/apiHandler';
import { windowWidth, eSongListType, ARTISTS_IMAGE_BASE_URL, SONGS_IMAGE_BASE_URL, windowHeight } from '../constants/globalConstants';
import { connect, useDispatch } from 'react-redux';
import AppIntroSlider from 'react-native-app-intro-slider'
import { LoadingComponent } from '../Components/LoadingComponent';
import { minimizePlayer, changePlaylist, setTrackIndex, advertisments, changePlayerState, setUserData, setAccessToken, likeUnlikeSong } from '../redux/actions/actions';
import { PlayControls } from '../Components/PlayControls';
import { useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
import { PressableImage } from '../Components/PressableImage';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign'

const Search = (props) => {

    const getHeight = (number) => {
        return 110 * (Math.ceil(number / 2))
    }

    const [searchValue, setSearchValue] = useState('')
    const [showSearchResults, setShowSearchResults] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const [songCategories, setSongCategories] = useState([])
    const [topGenres, setTopGenres] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [advertisements, setAdvertisements] = useState([])
    const textInputRef = useRef()



    const onBackPress = () => {
        if (props.navigation.isFocused()) {
            props.navigation.goBack()
        }
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
    // }, [props.navigation])

    useEffect(() => {
        getInitialData()
    }, [])

    const adRef = useRef()

    const changeAdvertisementBanner = (index) => {
        if (index) {
            if (index == props.advertisements.length - 1) {
                adRef.current.goToSlide(0, true);
            }
            else {
                adRef.current.goToSlide(index, true);
            }
        }
    }

    const getInitialData = async () => {
        setIsLoading(true)
        const token = props.accessToken
        let res = await apiHandler.getSongCategories(token)
        setSongCategories(res)
        let advertisements = []
        advertisements = props.advertisements.filter((item) => {
            return item.banner_type == "l" && item.type == 'video'
        })
        let topGenres = await apiHandler.getTopGenres(token, props.userData.id)
        setTopGenres(topGenres)
        setAdvertisements(advertisements)
        setIsLoading(false)
    }

    const onValueSearch = async (text) => {
        setSearchValue(text)
        if (text !== '') {
            setShowSearchResults(true)
            setIsSearching(true)
            const token = props.accessToken
            const res = await apiHandler.getSearchItems(token, text)
            let arrArtists = []
            let arrSongs = []
            let arrData = []
            let arrAlbums = []
            arrArtists = res.Artist.map((item, index) => {
                return {
                    type: 'artist',
                    details: item
                }
            })
            arrAlbums = res.Album.map((item, index) => {
                return {
                    type: 'album',
                    details: item
                }
            })
            arrSongs = res.Song.map((item, index) => {
                return {
                    type: 'song',
                    details: item
                }
            })
            arrData = arrArtists.concat(arrSongs, arrAlbums)
            setSearchResults(arrData)
            setTimeout(() => {
                setIsSearching(false)
            }, 600)
            // textInputRef.current.focus()
        }
        else {
            // textInputRef.current.blur()
            setShowSearchResults(false)
        }
    }

    const onCategoryPress = (item) => {
        if (item.name == 'Podcast') {
            props.navigation.navigate(navigationStrings.Podcasts)
        }
        else {
            props.navigation.navigate(navigationStrings.SongsByCategory, { data: item, songListType: eSongListType.Category })
        }
    }

    const renderMusicCategories = () => {
        return (<ScrollView style={commonStyles.fullWidth} showsVerticalScrollIndicator={false}>
            <View style={styles.bannerContainer}>
                <AppIntroSlider
                    renderItem={renderBannerItem}
                    data={advertisements}
                    showNextButton={false}
                    showDoneButton={false}
                    renderPagination={() => null}
                    ref={(ref) => (adRef.current = ref)}
                />
            </View>
            {topGenres && topGenres.length > 0 && <View style={{ minHeight: getHeight(topGenres.length), width: '100%', marginTop: 20 }}>
                <Text style={commonStyles.textWhiteBold(20, { alignSelf: 'flex-start', fontWeight: '600', marginBottom: 10 })}>
                    Your Top Genres
                </Text>
                <View style={commonStyles.flexFull_Row}>
                    <View style={commonStyles.flexFull}>
                        {
                            topGenres.map((item, index) => {
                                return index % 2 == 0 &&
                                    <TouchableOpacity key={index} style={styles.singleGenreContainer(item.bg_color)} onPress={() => { onCategoryPress(item) }}>
                                        <Text style={commonStyles.textWhiteNormal(18)}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                            })
                        }
                    </View>
                    <View style={[commonStyles.flexFull, { marginLeft: 15 }]}>
                        {
                            topGenres.map((item, index) => {
                                return index % 2 != 0 &&
                                    <TouchableOpacity key={index} style={styles.singleGenreContainer(item.bg_color)} onPress={() => { onCategoryPress(item) }}>
                                        <Text style={commonStyles.textWhiteNormal(18)}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                            })
                        }
                    </View>
                </View>
            </View>}
            <View style={{ minHeight: getHeight(songCategories.length), width: '100%' }}>
                <Text style={commonStyles.textWhiteBold(20, { alignSelf: 'flex-start', fontWeight: '600', marginBottom: 10 })}>
                    Browse All
                </Text>
                <View style={commonStyles.flexFull_Row}>
                    <View style={commonStyles.flexFull}>
                        {
                            songCategories.map((item, index, self) => {
                                return index % 2 == 0 &&
                                    <TouchableOpacity key={index} style={[styles.singleGenreContainer(item.bg_color), { marginBottom: props.isPlayerMinimized && index == self.length - 1 ? 60 : 15 }]} onPress={() => { onCategoryPress(item) }}>
                                        <Text style={commonStyles.textWhiteNormal(18)}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                            })
                        }
                    </View>
                    <View style={[commonStyles.flexFull, { marginLeft: 15 }]}>
                        {
                            songCategories.map((item, index, self) => {
                                return index % 2 != 0 &&
                                    <TouchableOpacity key={index} style={[styles.singleGenreContainer(item.bg_color), { marginBottom: props.isPlayerMinimized && index == self.length - 1 ? 60 : 15 }]} onPress={() => { onCategoryPress(item) }}>
                                        <Text style={commonStyles.textWhiteNormal(18)}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                            })
                        }
                    </View>
                </View>
            </View>
        </ScrollView>)
    }

    const dispatch = useDispatch()

    const onSearchItemPress = (item) => {
        const type = item.type
        switch (type) {
            case 'artist':
                props.navigation.navigate(navigationStrings.SongsList, { data: item.details, songListType: eSongListType.Artist })
                break;
            case 'song':
                dispatch(changePlaylist([item.details], 0, false, false))
                dispatch(changePlayerState(true))
                dispatch(minimizePlayer(false))
                // props.navigation.navigate(navigationStrings.PlaySong, { songDetails: newSongs, isPlaylist: true, header: 'Latest Songs' })
                props.navigation.navigate(navigationStrings.PlaySong, { songDetails: [item.details], isPlaylist: false })
                break;
            case 'album':
                props.navigation.navigate(navigationStrings.Albums, { data: item.details })
                break;
        }
    }

    const renderSearchItem = ({ item, index }) => {
        return (<TouchableOpacity onPress={() => { onSearchItemPress(item) }} style={styles.singleSearchResultFullContainer}>
            <Image source={item.type == 'artist' ? (item.details.image == '' || item.details.image == null ? imagePath.dummyArtist : { uri: ARTISTS_IMAGE_BASE_URL + item.details.image }) : (item.details.song_image == '' || item.details.song_image == null ? imagePath.dummySong : { uri: SONGS_IMAGE_BASE_URL + item.details.song_image })} style={styles.searchResultImageStyle(item.type)} />
            <View style={styles.singleSearchResultDetailsContainer}>
                <View>
                    <View style={commonStyles.flexRow_CenterItems}>
                        <Text style={commonStyles.textWhiteNormal(15)}>
                            {item.details.name}
                        </Text>
                    </View>
                    <Text style={commonStyles.textLightNormal(12)}>
                        {item.type == 'artist' ? 'Artist' : item.type == 'song' ? 'Song' : 'Album'}
                    </Text>
                </View>
                {item.type != 'song' && <Image source={imagePath.nextIcon} />}
            </View>
        </TouchableOpacity>
        )
    }

    const keyExtractor = useCallback((item) => { item.details.id.toString() }, [])

    const renderSearchResults = () => {
        return <KeyboardAvoidingView behavior='padding'>
            <View style={styles.searchResultsListContainer}>
                < FlatList
                    data={searchResults}
                    renderItem={renderSearchItem}
                    keyExtractor={keyExtractor}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </KeyboardAvoidingView>
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
        return (
            item.type == 'video' ? <TouchableOpacity key={index} style={commonStyles.flexFull} onPress={() => { onSingleAdvertisementPress(item) }}>
                <Video
                    source={{ uri: 'https://api.afromelodiez.com/storage/ad/' + item.attachment }}
                    muted={true}
                    resizeMode='stretch'
                    style={{ height: 140 }}
                    // poster={'https://st3.depositphotos.com/11963282/14669/v/600/depositphotos_146690125-stock-illustration-progress-loading-bar.jpg'}
                    onEnd={() => { changeAdvertisementBanner(index) }} />
            </TouchableOpacity>
                :
                <PressableImage onPress={() => { onSingleAdvertisementPress(item) }} imageStyle={{ flex: 1, resizeMode: 'stretch' }} imageSource={{ uri: 'https://api.afromelodiez.com/storage/ad/' + item.attachment }}>
                </PressableImage>
        );
    }

    const renderNoResultsView = () => {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={commonStyles.textWhiteBold(24, { color: colors.green })}>
                OOPS
            </Text>
            <Text style={commonStyles.textLightNormal(20)}>
                No results found..!!!
            </Text>
        </View>
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
        isLoading ?
            <LoadingComponent />
            :
            <View style={commonStyles.fullScreenContainerBlack(props.isPlayerMinimized)}>
                <MainHeader2 headerPrimaryTitle='Search' />
                <LinearGradient
                    style={commonStyles.linearGradientStyle}
                    start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                    colors={['#ffffff77', '#ffffff55', '#ffffff33', '#ffffff11', '#ffffff11', '#ffffff22', '#ffffff44', '#ffffff66', '#ffffff99']}
                />
                <View style={styles.fullContainer}>
                    <AntDesign name={'search1'} style={styles.iconStyle} />
                    <TextInput
                        // ref={textInputRef}
                        style={styles.textInputStyle}
                        value={searchValue}
                        onChangeText={(text) => onValueSearch(text)}
                        placeholder={'Artists, songs or podcasts'}
                        placeholderTextColor='rgba(0,0,0,1)'
                    />
                    {searchValue != '' && <AntDesign name='close' onPress={() => onValueSearch('')} style={styles.iconStyle} />}
                </View>
                <View style={commonStyles.flexFull}>
                    {
                        isSearching ?
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator size={'large'} color={colors.green} />
                            </View>
                            :
                            !showSearchResults ?
                                renderMusicCategories()
                                :
                                (
                                    searchResults.length == 0 ?
                                        renderNoResultsView() :
                                        renderSearchResults())
                    }
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

export default connect(mapStateToProps)(Search)

const styles = StyleSheet.create({
    singleGenreContainer: (color) => {
        return { height: 100, marginBottom: 15, backgroundColor: color && color !== '' && color !== '#000000' && color !== 'Grey' ? color : colors.green, padding: 8, borderRadius: 6 }
    },
    searchResultsListContainer: { flex: 1, width: '100%', marginTop: 20 },
    singleSearchResultFullContainer: { flexDirection: 'row', alignItems: 'center', width: windowWidth - 50, alignSelf: 'center', minHeight: 60, maxHeight: 80 },
    searchResultImageStyle: (type) => {
        return { height: '80%', width: 60, borderRadius: type == 'Artist' ? 30 : 0, resizeMode: 'stretch' }
    },
    singleSearchResultDetailsContainer: { flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginLeft: 10, alignItems: 'center' },
    bannerContainer: { height: 120, width: windowWidth - 20, backgroundColor: colors.white, },
    fullContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, borderRadius: 8, backgroundColor: colors.white, marginBottom: 10 },
    imageStyle: { height: 16, width: 16 },
    textInputStyle: { flex: 1, fontWeight: 'bold', opacity: 0.7 },
    iconStyle: { fontSize: 18, color: colors.lightText }
})

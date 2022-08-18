import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ScrollView, View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ImageBackground, FlatList, BackHandler } from 'react-native'
import { commonStyles } from '../constants/commonStyles';
import { navigationStrings } from '../navigation/navigationStrings';
import { imagePath } from '../constants/imagePath';
import { PrimarySearchBar } from '../Components/PrimarySearchBar';
import { colors } from '../constants/colors';
import DropDownPicker from 'react-native-dropdown-picker'
import { MainHeader2 } from '../Components/MainHeader2';
import { apiHandler } from '../constants/apiHandler';
import AppIntroSlider from 'react-native-app-intro-slider';
import { windowWidth, eSongListType, windowHeight } from '../constants/globalConstants';
import { connect, useDispatch } from 'react-redux';
import { LoadingComponent } from '../Components/LoadingComponent';
import { PlayControls } from '../Components/PlayControls';
import { minimizePlayer, changePlaylist, setTrackIndex, advertisments, changePlayerState, setUserData, setAccessToken, likeUnlikeSong } from '../redux/actions/actions';
import LinearGradient from 'react-native-linear-gradient';

const Categories = (props) => {

    const getHeight = (number) => {
        return 110 * (Math.ceil(number / 2))
    }

    const [songCategories, setSongCategories] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const handleBackButton = () => {
        if (props.navigation.canGoBack()) {
            props.navigation.goBack()
        }
    }

    const getInitialData = async () => {
        setIsLoading(true)
        const token = props.accessToken
        const categories = await apiHandler.getSongCategories(token)
        setSongCategories(categories)
        setIsLoading(false)
    }

    useEffect(() => {
        // const backHandler = BackHandler.addEventListener(
        //     "hardwareBackPress",
        //     handleBackButton
        // )
        getInitialData()
        // return () => backHandler.remove();
    }, [])

    const onCategoryPress = (item) => {
        if (item.name == 'Podcast') {
            props.navigation.navigate(navigationStrings.Podcasts)
        }
        else {
            props.navigation.navigate(navigationStrings.SongsByCategory, { data: item, songListType: eSongListType.Category })
        }
    }

    const renderMusicCategories = () => {
        return
        // <View style={commonStyles.flexFull}>
        //         <Text style={commonStyles.textWhiteBold(24, { alignSelf: 'flex-start' })}>
        //             All Categories
        //             </Text>
        //         <View style={commonStyles.flexFull_Row}>
        //             <View style={commonStyles.flexFull}>
        //                 {
        //                     songCategories.map((item, index) => {
        //                         return index % 2 == 0 &&

        //                     })
        //                 }
        //             </View>
        //             <View style={[commonStyles.flexFull, { marginLeft: 10 }]}>
        //                 {
        //                     songCategories.map((item, index) => {
        //                         return index % 2 != 0 &&
        //                             <TouchableOpacity key={index} style={styles.singleGenreContainer(item.bg_color)} onPress={() => { onCategoryPress(item) }}>
        //                                 <Text style={commonStyles.textWhiteBold(18)}>
        //                                     {item.name}
        //                                 </Text>
        //                             </TouchableOpacity>
        //                     })
        //                 }
        //             </View>
        //         </View>
        // </View>
    }

    const renderBannerItem = ({ item, index }) => {
        return (
            <ImageBackground style={commonStyles.fullScreenContainer} resizeMode='cover' source={{ uri: 'https://music.nvinfobase.com/storage/ad/1642510570_blog-1.jpg' }}>
                <Text style={commonStyles.textWhiteBold(18)}>{item.title}</Text>
            </ImageBackground>
        );
    }

    const onBackPress = () => {
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

    const keyExtractor = useCallback((item) => { item.id.toString() }, [])

    return (
        isLoading ? <LoadingComponent isVisible={isLoading} />
            :
            <View style={commonStyles.fullScreenContainerBlack(props.isPlayerMinimized)}>
                <LinearGradient
                    style={{ position: 'absolute', top: 0, width: windowWidth, alignSelf: 'center', height: 1.5 * windowHeight }}
                    start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                    colors={['#ffffff77', '#ffffff55', '#ffffff33', '#ffffff11', '#ffffff11', '#ffffff22', '#ffffff44', '#ffffff66', '#ffffff99']}
                />
                <MainHeader2 leftImage={imagePath.backIcon} onLeftIconPress={onBackPress} headerPrimaryTitle='All categories' />
                <View style={commonStyles.flexFull}>
                    <FlatList
                        data={songCategories}
                        renderItem={({ item, index }) => {
                            return <TouchableOpacity key={index} style={[styles.singleGenreContainer(item.bg_color, index), { marginBottom: index == songCategories.length - 1 && props.isPlayerMinimized ? 80 : 10 }]} onPress={() => { onCategoryPress(item) }}>
                                <Text style={commonStyles.textWhiteBold(18)}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        }
                        }
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={keyExtractor} />
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

export default connect(mapStateToProps)(Categories)

const styles = StyleSheet.create({
    singleGenreContainer: (color, index) => {
        return { height: 100, marginTop: 10, backgroundColor: color && color !== '' ? color : colors.green, padding: 8, width: '48%', alignSelf: 'center', borderRadius: 6, marginLeft: index % 2 == 0 ? 0 : 10 }
    },
    searchResultsListContainer: { flex: 1, width: '100%', marginTop: 20 },
    singleSearchResultFullContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', minHeight: 60, maxHeight: 80 },
    searchResultImageStyle: (type) => {
        return { height: 60, width: 60, borderRadius: type == 'Artist' ? 30 : 0, resizeMode: 'contain' }
    },
    singleSearchResultDetailsContainer: { flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginLeft: 10, alignItems: 'center' },
    bannerContainer: { minHeight: 150, maxHeight: 200, width: '100%', backgroundColor: colors.white, marginVertical: 10 }
})

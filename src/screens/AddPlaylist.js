import React, { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet, FlatList, BackHandler } from 'react-native'
import { commonStyles } from '../constants/commonStyles';
import { imagePath } from '../constants/imagePath';
import { MainHeader2 } from '../Components/MainHeader2';
import { windowWidth, ARTISTS_IMAGE_BASE_URL, eSongListType, windowHeight } from '../constants/globalConstants';
import { connect, useDispatch } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { colors } from '../constants/colors';
import { PrimaryTextInput } from '../Components/PrimaryTextInput';
import { MainHeader1 } from '../Components/MainHeader1';
import { apiHandler } from '../constants/apiHandler';
import { PlayControls } from '../Components/PlayControls';
import { minimizePlayer, changePlaylist, setTrackIndex, advertisments, changePlayerState, setUserData, setAccessToken, likeUnlikeSong } from '../redux/actions/actions';
import { navigationStrings } from '../navigation/navigationStrings';
import { LoadingComponent } from '../Components/LoadingComponent';
import LinearGradient from 'react-native-linear-gradient';


const AddPlaylist = (props) => {

    const [playlistName, setPlaylistName] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const addPlaylistToServer = async () => {
        setIsLoading(true)
        const token = props.accessToken
        const userId = props.userData.id
        let reqObj = {
            userID: userId,
            playlistName: playlistName
        }
        await apiHandler.addNewPlaylist(token, reqObj)
        setIsLoading(false)
        props.navigation.goBack()
    }

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

    const onCancelPress = () => {
        props.navigation.goBack()
    }

    const getFontSize = () => {
        let currentText = playlistName
        currentText = currentText.trim()
        let length = currentText.length
        if (length < 20) {
            return (40 - (length * 1.2))
        }
        else {
            return 20
        }
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
                <View style={commonStyles.flexFull}>
                    <View style={styles.screenInnerContainer}>
                        <Text style={commonStyles.textWhiteBold(24, { alignSelf: 'center', marginTop: 50 })}>
                            Give your playlist a name
                    </Text>
                        <PrimaryTextInput placeholder='Add a playlist' value={playlistName} onChangeText={(text) => {
                            setPlaylistName(text)
                        }} customStyles={styles.customPlaylistInputStyle} customTextStyles={{ fontSize: getFontSize(), color: colors.white }} />
                        <View style={styles.buttonsContainer}>
                            <Text onPress={onCancelPress} style={commonStyles.textWhiteNormal(18)}>
                                CANCEL
                        </Text>
                            <Text onPress={addPlaylistToServer} style={commonStyles.textWhiteNormal(18, { color: colors.green })}>
                                CREATE
                   </Text>
                        </View>
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

export default connect(mapStateToProps)(AddPlaylist)

const styles = StyleSheet.create({
    screenInnerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    customPlaylistInputStyle: { borderRadius: 12, borderBottomWidth: 1, borderBottomColor: colors.green, borderColor: colors.green, width: windowWidth * 0.8, alignSelf: 'center' },
    buttonsContainer: { flexDirection: 'row', marginTop: 40, width: windowWidth * 0.5, alignSelf: 'center', justifyContent: 'space-between' },
    doneButton: { width: '40%', justifyContent: 'center', alignItems: 'center', padding: 10, borderRadius: 12, backgroundColor: colors.green },
    skipButton: { width: '40%', justifyContent: 'center', alignItems: 'center', padding: 10, borderRadius: 12, backgroundColor: colors.white, borderColor: colors.green, borderWidth: 1 }
})
import React, { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, BackHandler, ToastAndroid } from 'react-native'
import { commonStyles } from '../constants/commonStyles';
import { navigationStrings } from '../navigation/navigationStrings';
import { imagePath } from '../constants/imagePath';
import { MainHeader1 } from '../Components/MainHeader1';
import { colors } from '../constants/colors';
import { CommonButton } from '../Components/CommonButton';
import { Checkbox } from '../Components/Checkbox';
import { AsyncStorageFunctions } from '../constants/asyncStorage';
import { CommonActions } from '@react-navigation/native'
import { connect, useDispatch } from 'react-redux';
import { apiHandler } from '../constants/apiHandler';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { LoadingComponent } from '../Components/LoadingComponent';
import { windowWidth, downloadsPath, windowHeight } from '../constants/globalConstants';
import Slider from "react-native-slider";
import { PlayControls } from '../Components/PlayControls';
import { minimizePlayer, changePlaylist, setTrackIndex, advertisments, changePlayerState, setUserData, setAccessToken, logoutUser, likeUnlikeSong, setUserSettings } from '../redux/actions/actions';
import clear from 'react-native-clear-app-cache'
import RNFetchBlob from 'rn-fetch-blob';
import LinearGradient from 'react-native-linear-gradient';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const Settings = (props) => {
    const [userSettings, setuserSettings] = useState(props.userSettings)
    const [settingsData, setSettingsData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        const getInitialData = () => {
            let data = [
                {
                    id: 0,
                    name: 'Data Saver',
                    options: [{
                        title: 'Audio Quality',
                        description: 'Set your audio quality to low (equivalent to 24kbit/s) and disables artist canvases.',
                        isSelected: userSettings.dataSaver == 1 ? true : false
                    }]
                },
                // {
                //     id: 1,
                //     name: 'Video Podcasts',
                //     options: [{
                //         title: 'Download Audio Only',
                //         description: 'Save video podcasts as audio only.',
                //         isSelected: userSettings.downloadOnly == 1 ? true : false
                //     },
                //     {
                //         title: 'Stream Audio Only',
                //         description: 'Play video podcasts as audio only when not on Wifi.',
                //         isSelected: userSettings.StreamOnly == 1 ? true : false
                //     }]
                // },
                {
                    id: 2,
                    name: 'Playback',
                    options: [
                        {
                            title: 'Gapless',
                            description: 'Allow gapless playback.',
                            isSelected: userSettings.gapless == 1 ? true : false
                        },
                        {
                            title: 'Automix',
                            description: 'Allow smooth transitions between songs in a playlist.',
                            isSelected: userSettings.automix == 1 ? true : false
                        },
                        {
                            title: 'Crossfade',
                            description: 'Allows you to crossfade between songs.',
                            value: userSettings.crossfade
                        },
                        {
                            title: 'Autoplay',
                            description: 'Keep on listening to similar tracks when your music ends.',
                            isSelected: userSettings.autoplay == 1 ? true : false
                        }]
                },
                {
                    id: 3,
                    name: 'Language',
                    options: [{
                        title: 'Language For Music',
                        description: 'Choose your preferred languages for music.'
                    }]
                },
                {
                    id: 4,
                    name: 'Audio Quality',
                    options: [{
                        title: 'Equalizer',
                        description: 'Open the equalizer control panel.'
                    }]
                },
                {
                    id: 5,
                    name: 'Storage',
                    options: [{
                        title: 'Remove All Downloads',
                        description: 'Remove all of the AfroMelodiez content you have downloaded for offline use.'
                    },
                    {
                        title: 'Clear Cache',
                        description: "You can free up storage by clearing your cache. Your downloads won't be removed."
                    }]
                },
                {
                    id: 6,
                    name: 'About',
                    options: [{ title: 'Version Number', description: '1.0.0' }, { title: 'Logout', description: 'You are logged in as ' }]
                }
            ]
            setSettingsData(data)
        }
        // const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton)
        getInitialData()
        // return () => backHandler.remove()
    }, [])

    const onSavePress = async () => {
        setIsLoading(true)
        await apiHandler.saveUserSettings(props.accessToken, userSettings)
        // await getInitialData()
        let serverSettings = await apiHandler.getUserSettings(props.accessToken, props.userData.id)
        serverSettings = serverSettings.data.data[0]
        let settings = {
            userID: props.userData.id,
            dataSaver: 0,
            downloadOnly: 0,
            StreamOnly: 0,
            crossfade: 0,
            gapless: 0,
            automix: 0,
            autoplay: 0,
        }
        settings.StreamOnly = userSettings.StreamOnly
        settings.automix = userSettings.automix
        settings.autoplay = userSettings.autoplay
        settings.crossfade = userSettings.crossfade
        settings.dataSaver = userSettings.dataSaver
        settings.downloadOnly = userSettings.downloadOnly
        settings.gapless = userSettings.gapless
        dispatch(setUserSettings(settings))
        setIsLoading(false)
    }

    const handleBackButton = () => {
        if (props.navigation.canGoBack()) {
            props.navigation.goBack()
        }
    }

    const onOptionPress = async (item) => {
        let data = [...settingsData]
        let currentSettings = Object.assign({}, userSettings)
        switch (item.title) {
            case "Logout":
                setIsLoading(true)
                dispatch(logoutUser('Logout'))
                AsyncStorageFunctions.removeItem('token')
                dispatch(setAccessToken(null))
                const isSignedIn = await GoogleSignin.isSignedIn();
                // let value = await AsyncStorageFunctions.getItem('isGoogleLogin')
                if (isSignedIn) {
                    GoogleSignin.configure({
                        androidClientId: '469412287743-d4d05h0kg42l3s3538vsk8u19e5fqvee.apps.googleusercontent.com',
                        iosClientId: '469412287743-9iql75f7tijnrodc6m1p684s38bggu62.apps.googleusercontent.com',
                    })
                    await GoogleSignin.revokeAccess();
                    await GoogleSignin.signOut();
                    dispatch(logoutUser('Logout'))
                    AsyncStorageFunctions.removeItem('token')
                    dispatch(setAccessToken(null))
                    setIsLoading(false)
                }
                else {
                    dispatch(logoutUser('Logout'))
                    AsyncStorageFunctions.removeItem('token')
                    dispatch(setAccessToken(null))
                    setIsLoading(false)
                }
                // .then((res) => {
                //     props.navigation.dispatch(
                //         CommonActions.reset({
                //             index: 1,
                //             routes: [
                //                 { name: navigationStrings.Splash },
                //             ],
                //         })
                //     );
                // })
                break;
            case 'Clear Cache':
                // clear.getAppCacheSize((value, unit) => {
                //     console.log("Cache value is", value)
                //     console.log("Cache size is", unit)
                //  })
                clear.clearAppCache(() => {
                    ToastAndroid.show('Cleared App Cache', 700)
                })
                break;
            case 'Remove All Downloads':
                const downloads = await RNFetchBlob.fs.ls(downloadsPath)
                if (downloads.length == 0) {
                    ToastAndroid.show('No downloaded songs to', 700)
                }
                else {
                    downloads.forEach((item, index, self) => {
                        RNFetchBlob.fs.unlink(downloadsPath + item).then((res) => {
                            if (index == self.length - 1) {
                                ToastAndroid.show('Downloads cleared successfully', 700)
                            }
                        })
                    })
                }
                break
            case 'Language For Music':
                props.navigation.navigate(navigationStrings.SelectCountryAndLanguage)
                break;
            case 'Audio Quality':
                data[0].options[0].isSelected = !data[0].options[0].isSelected
                currentSettings.dataSaver == 1 ? currentSettings.dataSaver = 0 : currentSettings.dataSaver = 1
                setSettingsData(data)
                setuserSettings(currentSettings)
                break;
            case 'Download Audio Only':
                data[1].options[0].isSelected = !data[1].options[0].isSelected
                currentSettings.downloadOnly == 1 ? currentSettings.downloadOnly = 0 : currentSettings.downloadOnly = 1
                setSettingsData(data)
                setuserSettings(currentSettings)
                break;
            case 'Stream Audio Only':
                data[1].options[1].isSelected = !data[1].options[1].isSelected
                currentSettings.StreamOnly == 1 ? currentSettings.StreamOnly = 0 : currentSettings.StreamOnly = 1
                setSettingsData(data)
                setuserSettings(currentSettings)
                break;
            case 'Crossfade':
                // data[2].options[0] = !data[0].options[0].isSelected
                // currentSettings.dataSaver == 1 ? currentSettings.dataSaver = 0 : currentSettings.dataSaver = 1
                // setSettingsData(data)
                // setUserSettings(currentSettings)
                break;
            case 'Gapless':
                data[1].options[0].isSelected = !data[1].options[0].isSelected
                currentSettings.gapless == 1 ? currentSettings.gapless = 0 : currentSettings.gapless = 1
                setSettingsData(data)
                setuserSettings(currentSettings)
                break;
            case 'Automix':
                data[1].options[1].isSelected = !data[1].options[1].isSelected
                currentSettings.automix == 1 ? currentSettings.automix = 0 : currentSettings.automix = 1
                setSettingsData(data)
                setuserSettings(currentSettings)
                break;
            case 'Autoplay':
                data[1].options[3].isSelected = !data[1].options[3].isSelected
                currentSettings.autoplay == 1 ? currentSettings.autoplay = 0 : currentSettings.autoplay = 1
                setSettingsData(data)
                setuserSettings(currentSettings)
                break;
            default:
                break;
        }
    }

    const onContinuePress = () => {
        props.navigation.navigate(navigationStrings.Home)
    }

    const onViewProfilePress = () => {
        props.navigation.navigate(navigationStrings.ViewProfile)
    }

    const onBackPress = () => {
        props.navigation.goBack()
    }

    const renderLeftIcon = () => {
        return <Ionicons name='arrow-back' onPress={onBackPress} style={{ fontSize: 25, color: colors.white }} />
    }

    const setCrossfade = (value) => {
        let objSettings = { ...userSettings }
        objSettings.crossfade = value
        setuserSettings(objSettings)
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
            : <View style={commonStyles.fullScreenContainerBlack(props.isPlayerMinimized)}>
                <LinearGradient
                    style={commonStyles.linearGradientStyle}
                    start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                    colors={['#ffffff77', '#ffffff55', '#ffffff33', '#ffffff11', '#ffffff11', '#ffffff22', '#ffffff44', '#ffffff66', '#ffffff99']}
                />
                <MainHeader1 headerPrimaryTitle='Settings' rightText='Save' onRightIconPress={onSavePress} leftIcon={renderLeftIcon} />
                <View style={commonStyles.flexFull}>
                    <Text style={commonStyles.textWhiteBold(17, { alignSelf: 'center' })}>
                        Free account
                </Text>
                    <CommonButton buttonTitle='Go Premium' onPress={onContinuePress} isRounded={true} customStyles={{ width: 120, alignSelf: 'center' }} />
                    <View style={styles.profileDetailsFullContainer}>
                        <Image source={{ uri: props.userData.profile_photo_url }} style={styles.profileImage} />
                        <TouchableOpacity onPress={onViewProfilePress} style={styles.profileDetailsInnerContainer}>
                            <View>
                                <Text style={commonStyles.textWhiteBold(19)}>
                                    {props.userData.name}
                                </Text>
                                <Text style={commonStyles.textWhiteNormal(17)}>
                                    View Profile
                            </Text>
                            </View>
                            <Image source={imagePath.nextIcon} style={{ height: 25, width: 25 }} resizeMode='contain' />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.screenInnerContainer}>
                        {
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {settingsData.map((item, index) => {
                                    return <View key={index} style={styles.fullOptionContainer}>
                                        <Text style={commonStyles.textWhiteBold(19)}>
                                            {item.name}
                                        </Text>
                                        {item.options.map((innerItem, innerIndex) => {
                                            return <TouchableOpacity activeOpacity={innerItem.title == 'Crossfade' ? 1 : 0} onPress={() => { onOptionPress(innerItem) }} key={innerIndex} style={styles.innerOptionContainer(innerItem.title == 'Logout' && props.isPlayerMinimized)}>
                                                <Text style={commonStyles.textWhiteNormal(19)}>
                                                    {innerItem.title}
                                                </Text>
                                                <View style={styles.innerOptionDescriptionContainer}>
                                                    <View style={commonStyles.flexFull}>
                                                        <Text style={commonStyles.textLightNormal(17, { textAlign: 'left', marginRight: 20 })}>
                                                            {innerItem.title == 'Logout' ? innerItem.description + props.userData.name : innerItem.description}
                                                        </Text>
                                                    </View>
                                                    {innerItem.isSelected !== undefined && <Checkbox isSelected={innerItem.isSelected} />}
                                                </View>
                                                {innerItem.title == 'Crossfade' &&
                                                    <Slider
                                                        value={parseInt(userSettings.crossfade)}
                                                        onValueChange={value => setCrossfade(value)}
                                                        maximumTrackTintColor={'#9696a8'}
                                                        minimumTrackTintColor={colors.green}
                                                        style={{ alignSelf: 'center', justifyContent: 'center', width: windowWidth - 30 }}
                                                        trackStyle={{ height: 3, width: windowWidth - 40 }}
                                                        // thumbStyle={styles.thumbMoverStyle}
                                                        maximumValue={6}
                                                        step={1} />
                                                }
                                            </TouchableOpacity>
                                        })}
                                    </View>
                                })}
                            </ScrollView>}
                    </View>
                </View>
                {
                    (props.isPlayerMinimized) && <PlayControls likeUnlikeSong={(id) => { likeUnlikeSongPress(id) }} likedSongs={props.likedSongs} isPlaying={props.isPlaying} setIsPlaying={(value) => { updatePlayingState(value) }} updateIndex={(index) => { updateTrackIndex(index) }} currentIndex={props.currentTrackIndex} currentPlaylist={props.currentPlaylist} playCount={props.playCount} changePlayerState={maximizePlayer} isMinimized={props.isPlayerMinimized} userData={props.userData} token={props.accessToken} />
                }
            </View>
    )
}

const mapStateToProps = (state) => {
    return { userData: state.userData, userSettings: state.userSettings, accessToken: state.accessToken, likedSongs: state.likedSongsIds, isPlayerMinimized: state.isPlayerMinimized, currentPlaylist: state.currentPlaylist, playCount: state.playCount, advertisements: state.advertisements, currentTrackIndex: state.currentTrackIndex, isPlaying: state.isPlaying }
}

export default connect(mapStateToProps)(Settings)

const styles = StyleSheet.create({
    profileDetailsFullContainer: { flexDirection: 'row', width: '100%', paddingVertical: 10, minHeight: 50, borderBottomWidth: 1, borderBottomColor: colors.darkGrey, marginTop: 10 },
    profileImage: { height: 60, width: 60, borderRadius: 19, resizeMode: 'contain' },
    profileDetailsInnerContainer: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 10 },
    screenInnerContainer: { flex: 1, marginBottom: 10 },
    fullOptionContainer: { width: '100%', alignItems: 'flex-start', marginTop: 15, marginBottom: 5 },
    innerOptionContainer: (bool) => {
        return { width: '100%', marginTop: 5, marginBottom: bool ? 65 : 0 }
    },
    innerOptionDescriptionContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' },
    trackStyle: {
        height: 4,
    },
    thumbMoverStyle: {
        width: 8,
        height: 8,
        backgroundColor: colors.white,
        borderRadius: 4,
    },
})
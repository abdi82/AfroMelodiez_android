import React, { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet, BackHandler } from 'react-native'
import { commonStyles } from '../constants/commonStyles';
import { navigationStrings } from '../navigation/navigationStrings';
import { imagePath } from '../constants/imagePath';
import { MainHeader1 } from '../Components/MainHeader1';
import { colors } from '../constants/colors';
import { connect, useDispatch } from 'react-redux';
import { PressableImage } from '../Components/PressableImage';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { PlayControls } from '../Components/PlayControls';
import { minimizePlayer, setTrackIndex, changePlayerState, likeUnlikeSong } from '../redux/actions/actions';
import LinearGradient from 'react-native-linear-gradient';

const ViewProfile = (props) => {

    const data = [
        {
            id: 0,
            title: 'PLAYLISTS',
            number: 0
        },
        {
            id: 1,
            title: 'FOLLOWERS',
            number: 0,
        },
        {
            id: 2,
            title: 'FOLLOWING',
            number: 0,
        },
    ]

    const [showEditOptions, setShowEditOptions] = useState(false)

    const onBackPress = () => {
        props.navigation.goBack()
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
    }, [])

    const onButtonPress = () => {
        props.navigation.navigate(navigationStrings.EditProfile)
        setShowEditOptions(false)
    }

    const renderRightIcon = () => {
        return <PressableImage onPress={showHideEditModal} imageSource={imagePath.threeDotsIcon} imageStyle={{ height: 20, width: 20, resizeMode: 'contain' }} />
    }

    const showHideEditModal = () => {
        setShowEditOptions(!showEditOptions)
    }

    const renderLeftIcon = () => {
        return <Ionicons name='arrow-back' onPress={onBackPress} style={{ fontSize: 25, color: colors.white }} />
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
        <View style={commonStyles.fullScreenContainerBlack(props.isPlayerMinimized)}>
            <LinearGradient
                style={commonStyles.linearGradientStyle}
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                colors={['#ffffff77', '#ffffff55', '#ffffff33', '#ffffff11', '#ffffff11', '#ffffff22', '#ffffff44', '#ffffff66', '#ffffff99']}
            />
            <MainHeader1 headerPrimaryTitle='' />
            <View style={commonStyles.flexFull}>
                <View style={styles.profileDetailsContainer}>
                    {/* <Modal visible={showEditOptions} transparent={true} onRequestClose={showHideEditModal}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0)' }}> */}
                    {/* <TouchableWithoutFeedback onPress={onButtonPress} style={{ borderRadius: 12, backgroundColor: colors.green, padding: 15, position: 'absolute', top: 35, right: 20 }}> */}
                    {/* <TouchableOpacity onPress={onButtonPress} style={{ borderRadius: 12, backgroundColor: colors.green, padding: 15, position: 'absolute', top: 35, right: 20 }}>
                            <Text style={commonStyles.textWhiteBold(14)}>
                                Edit Profile
                                    </Text>
                        </TouchableOpacity> */}
                    {/* </TouchableWithoutFeedback> */}
                    {/* <Pressable style={commonStyles.flexFull} onPress={showHideEditModal} /> */}
                    {/* </View>
                    </Modal> */}
                    {/* <Ionicons name='md-pencil-sharp' style={{ fontSize: 35, color: colors.green, position: 'absolute', top: 0,right:0 }} /> */}
                    <Image source={{ uri: props.userData.profile_photo_url }} style={styles.profileImage} />
                    <View style={commonStyles.flexRow_CenterItems}>
                        <Text style={commonStyles.textWhiteBold(25, { marginTop: 10 })}>
                            {props.userData.name}
                        </Text>
                    </View>
                </View>
                {/* <CommonButton buttonTitle='Follow' onPress={onButtonPress} isRounded={true} customStyles={styles.customButtonStyle} /> */}
                <View style={styles.userDetailsContainer}>
                    {data.map((item, index) => {
                        return <View key={index} style={styles.singleDetailContainer}>
                            <Text style={commonStyles.textLightNormal(11)}>
                                {item.number}
                            </Text>
                            <View style={styles.singleDetailBorder} />
                            <Text style={commonStyles.textLightNormal(11)}>
                                {item.title}
                            </Text>
                        </View>
                    })}
                </View>
            </View>
            {
                (props.isPlayerMinimized) && <PlayControls likeUnlikeSong={(id) => { likeUnlikeSongPress(id) }} likedSongs={props.likedSongs} isPlaying={props.isPlaying} setIsPlaying={(value) => { updatePlayingState(value) }} updateIndex={(index) => { updateTrackIndex(index) }} currentIndex={props.currentTrackIndex} currentPlaylist={props.currentPlaylist} playCount={props.playCount} changePlayerState={maximizePlayer} isMinimized={props.isPlayerMinimized} userData={props.userData} token={props.accessToken} />
            }
        </View>
    )
}

const mapStateToProps = (state) => {
    return { userData: state.userData, accessToken: state.accessToken, likedSongs: state.likedSongsIds, isPlayerMinimized: state.isPlayerMinimized, currentPlaylist: state.currentPlaylist, playCount: state.playCount, advertisements: state.advertisements, currentTrackIndex: state.currentTrackIndex, isPlaying: state.isPlaying }
}

export default connect(mapStateToProps)(ViewProfile)

const styles = StyleSheet.create({
    profileDetailsContainer: { marginTop: 40, alignItems: 'center' },
    profileImage: { height: 120, width: 120, borderRadius: 60, resizeMode: 'contain' },
    customButtonStyle: { backgroundColor: colors.black, borderColor: colors.white, borderWidth: 1, width: 140 },
    userDetailsContainer: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 40 },
    singleDetailContainer: { width: 80, alignItems: 'center' },
    singleDetailBorder: { width: 40, height: 1, backgroundColor: colors.lightText, marginVertical: 4 },
    verifiedProfileIcon: { height: 14, padding: 5, width: 14 }
})

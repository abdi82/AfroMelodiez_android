import React, { useState } from 'react'
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import { commonStyles } from '../constants/commonStyles';
import { navigationStrings } from '../navigation/navigationStrings';
import { imagePath } from '../constants/imagePath';
import { MainHeader1 } from '../Components/MainHeader1';
import { colors } from '../constants/colors';
import DropDownPicker from 'react-native-dropdown-picker'
import { CommonButton } from '../Components/CommonButton';
import { connect, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { PlayControls } from '../Components/PlayControls';
import { minimizePlayer, changePlaylist, setTrackIndex, advertisments, changePlayerState, setUserData, setAccessToken, likeUnlikeSong } from '../redux/actions/actions';

const EditProfile = (props) => {

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

    const [showChooseOptionsModal, setShowChooseOptionsModal] = useState(false)
    const [imageSource, setImageSource] = useState('')

    const onButtonPress = () => {
        props.navigation.navigate(navigationStrings.EditProfile)
    }

    const onBackPress = () => {
        props.navigation.goBack()
    }

    const renderLeftIcon = () => {
        return <Ionicons name='arrow-back' onPress={onBackPress} style={{ fontSize: 25, color: colors.white }} />
    }

    const showHideChooseOptionsModal = () => {
        setShowChooseOptionsModal(!showChooseOptionsModal)
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
            <MainHeader1 headerPrimaryTitle='Edit Profile' leftIcon={renderLeftIcon} rightText='Save' />
            <View style={commonStyles.flexFull}>
                <View style={{ marginTop: 40 }}>
                    <Image source={{ uri: props.userData.profile_photo_url }} style={{ height: 120, width: 120, borderRadius: 60, resizeMode: 'contain' }} />
                </View>
                <Text style={commonStyles.textWhiteBold(25, { marginTop: 40 })}>
                    Name
            </Text>
                <View style={{ width: '80%', height: 1, backgroundColor: colors.darkGrey, marginTop: 5, marginBottom: 10 }} />

                <Text style={commonStyles.textLightNormal(11)}>
                    This could be your first name or a nickname.
            </Text>
                <Text style={commonStyles.textLightNormal(11, { marginTop: 2 })}>
                    It's how you'll appear on Afro Melodies
            </Text>
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

export default connect(mapStateToProps)(EditProfile)

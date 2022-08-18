import React, { useState } from 'react'
import { View, StyleSheet, ToastAndroid } from 'react-native'
import { AuthHeader } from '../Components/AuthHeader';
import { PrimaryTextInput } from '../Components/PrimaryTextInput';
import { CommonButton } from '../Components/CommonButton';
import { navigationStrings } from '../navigation/navigationStrings';
import { imagePath } from '../constants/imagePath';
import { connect, useDispatch } from 'react-redux';
import { PlayControls } from '../Components/PlayControls';
import { minimizePlayer, changePlaylist, setTrackIndex, advertisments, changePlayerState, setUserData, setAccessToken } from '../redux/actions/actions';
import { apiHandler } from '../constants/apiHandler';

const ForgotPassword = (props) => {

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false)

    const onButtonPress = async () => {
        setLoading(true)
        let reqObj = {
            email: email
        }
        await apiHandler.forgotPassword(reqObj)
        setLoading(false)
        props.navigation.replace(navigationStrings.VerifyCode, { email: email })
        // if (response.status == true) {
        // ToastAndroid.show('A veriication code has been sent  password',700)
        // }
    }

    const dispatch = useDispatch()

    const maximizePlayer = () => {
        dispatch(minimizePlayer(false))
        props.navigation.navigate(navigationStrings.PlaySong, { songDetails: props.currentSong })
    }

    const updateTrackIndex = (index) => {
        dispatch(setTrackIndex(index))
    }

    return (
        <View style={styles.screenContainer}>
            <AuthHeader headerTitle='FORGOT PASSWORD' />
            <View style={styles.cardView}>
                <PrimaryTextInput placeholder='Email Address' value={email} secureEntry={false} onChangeText={(text) => {
                    setEmail(text)
                }} imageSource={imagePath.mailIcon} />
            </View>
            <CommonButton isLoading={loading} buttonTitle='Get Link' onPress={onButtonPress} customStyles={{ width: 298, marginTop: 30 }} />
            {
                (props.isPlayerMinimized) && <PlayControls updateIndex={(index) => { updateTrackIndex(index) }} currentIndex={props.currentTrackIndex} currentPlaylist={props.currentPlaylist} playCount={props.playCount} changePlayerState={maximizePlayer} isMinimized={props.isPlayerMinimized} userData={props.userData} token={props.accessToken} />
            }
        </View>
    )
}

const mapStateToProps = (state) => {
    return { userData: state.userData, accessToken: state.accessToken, isPlayerMinimized: state.isPlayerMinimized, currentPlaylist: state.currentPlaylist, playCount: state.playCount, advertisements: state.advertisements, currentTrackIndex: state.currentTrackIndex }
}

export default connect(mapStateToProps)(ForgotPassword)

const styles = StyleSheet.create({
    screenContainer: { flex: 1, alignItems: 'center' },
    cardView: { backgroundColor: 'white', width: 298, minHeight: 100, elevation: 4, borderRadius: 20, padding: 20, paddingTop: 0, marginTop: 40 }
})




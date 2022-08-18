import React, { useState } from 'react'
import { View, StyleSheet, ToastAndroid } from 'react-native'
import { AuthHeader } from '../Components/AuthHeader';
import { PrimaryTextInput } from '../Components/PrimaryTextInput';
import { CommonButton } from '../Components/CommonButton';
import { imagePath } from '../constants/imagePath';
import { connect, useDispatch } from 'react-redux';
import { PlayControls } from '../Components/PlayControls';
import { minimizePlayer, setTrackIndex } from '../redux/actions/actions';
import { navigationStrings } from '../navigation/navigationStrings';
import { useRoute } from '@react-navigation/native';
import { apiHandler } from '../constants/apiHandler';

const ChangePassword = (props) => {

    const [confirmPassword, setConfirmPassword] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    const route = useRoute()

    const token = route?.params?.token
    const email = route?.params?.email

    const onChangePasswordPress = async () => {
        setIsLoading(true)
        if (password == confirmPassword) {
            let reqObj = {
                email: email,
                password: password
            }
            await apiHandler.resetPassword(token, reqObj)
            props.navigation.replace(navigationStrings.Login)
        }
        else {
            ToastAndroid.show('Both passwords does not match', 700)
        }
        setIsLoading(false)
    }

    return (
        <View style={styles.screenContainer}>
            <AuthHeader headerTitle='CHANGE PASSWORD' />
            <View style={styles.cardView}>
                <PrimaryTextInput placeholder='New Password' value={password} secureEntry={true} onChangeText={(text) => {
                    setPassword(text)
                }} imageSource={imagePath.lockIcon} />
                <PrimaryTextInput placeholder='Confirm Password' value={confirmPassword} secureEntry={true} onChangeText={(text) => {
                    setConfirmPassword(text)
                }} imageSource={imagePath.lockIcon} />
            </View>
            <CommonButton isLoading={isLoading} buttonTitle='Update' onPress={onChangePasswordPress} customStyles={{ width: 298, marginTop: 30 }} />
        </View>
    )
}

const mapStateToProps = (state) => {
    return { userData: state.userData, accessToken: state.accessToken, isPlayerMinimized: state.isPlayerMinimized, currentPlaylist: state.currentPlaylist, playCount: state.playCount, advertisements: state.advertisements, currentTrackIndex: state.currentTrackIndex, isPlaying: state.isPlaying }
}

export default connect(mapStateToProps)(ChangePassword)

const styles = StyleSheet.create({
    screenContainer: { flex: 1, alignItems: 'center' },
    cardView: { backgroundColor: 'white', width: 298, minHeight: 200, elevation: 4, borderRadius: 20, padding: 20, paddingTop: 0, marginTop: 40 }
})

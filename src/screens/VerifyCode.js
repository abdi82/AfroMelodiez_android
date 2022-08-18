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
import axios from 'axios';
import { apiHandler } from '../constants/apiHandler';
import { useRoute } from '@react-navigation/native';

const VerifyCode = (props) => {

    const route = useRoute()
    const email = route.params.email
    const [password, setPassword] = useState('');
    const [isLoading,setIsLoading]=useState(false)

    const onVerifyButtonPress = async () => {
        setIsLoading(true)
        let reqObj = { email: email, code: password }
        let response = await apiHandler.verifyCode(reqObj)
        if (response.status == true) {
            props.navigation.replace(navigationStrings.ChangePassword, { token: response.Token, email: email })
        }
        else {
            ToastAndroid.show(response.message, 700)
        }
        setIsLoading(false)
    }

    return (
        <View style={styles.screenContainer}>
            <AuthHeader headerTitle='CONFIRM VERIFICATION CODE' />
            <View style={styles.cardView}>
                <PrimaryTextInput placeholder='Enter Verification Code' value={password} secureEntry={true} onChangeText={(text) => {
                    setPassword(text)
                }} imageSource={imagePath.lockIcon} />
            </View>
            <CommonButton isLoading={isLoading} buttonTitle='Verify' onPress={onVerifyButtonPress} customStyles={{ width: 298, marginTop: 30 }} />
        </View>
    )
}

const mapStateToProps = (state) => {
    return { userData: state.userData, accessToken: state.accessToken, isPlayerMinimized: state.isPlayerMinimized, currentPlaylist: state.currentPlaylist, playCount: state.playCount, advertisements: state.advertisements, currentTrackIndex: state.currentTrackIndex, isPlaying: state.isPlaying }
}

export default connect(mapStateToProps)(VerifyCode)

const styles = StyleSheet.create({
    screenContainer: { flex: 1, alignItems: 'center' },
    cardView: { backgroundColor: 'white', width: 298, height: 120, elevation: 4, borderRadius: 20, padding: 20, paddingTop: 0, marginTop: 40 }
})

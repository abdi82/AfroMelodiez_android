import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Platform, ToastAndroid } from 'react-native'
import { AuthHeader } from '../Components/AuthHeader';
import { PrimaryTextInput } from '../Components/PrimaryTextInput';
import { CommonButton } from '../Components/CommonButton';
import { commonStyles } from '../constants/commonStyles';
import { navigationStrings } from '../navigation/navigationStrings';
import { imagePath } from '../constants/imagePath';
import { apiHandler } from '../constants/apiHandler';
import ErrorToast from '../Components/ErrorToast';
import { AsyncStorageFunctions } from '../constants/asyncStorage';
import { colors } from '../constants/colors';
import { useDispatch, connect } from 'react-redux';
import { setUserData, setAccessToken } from '../redux/actions/actions';

const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useDispatch()

    const onLoginPress = async () => {
        if (email == '') {
            setEmailError(true)
            setTimeout(() => {
                setEmailError(false)
            }, 1000);
        }
        else if (password == '') {
            setPasswordError(true)
            setTimeout(() => {
                setPasswordError(false)
            }, 1000);
        }
        else {
            setIsLoading(true)
            let fcmToken = await AsyncStorageFunctions.getItem('fcmToken')
            const loginData = {
                email: email,
                password: password,
                device_token: 'android',
                device_type: Platform.OS,
                fcm_token: fcmToken
            }
            let loginFormData = apiHandler.createFormData(loginData)
            const response = await apiHandler.login(loginFormData)
            setIsLoading(false)
            if (response.data.success) {
                const token = response.data.token
                await AsyncStorageFunctions.setItem('token', token)
                await AsyncStorageFunctions.setItem('isGoogleLogin', 'false')
                let userData = await apiHandler.getUserData(token)
                userData = userData.data
                dispatch(setUserData(userData))
                dispatch(setAccessToken(token))
            }
            else {
                ToastAndroid.show('Please enter valid credentials', 1000)
            }
        }
    }

    const onForgotPasswordPress = () => {
        props.navigation.replace(navigationStrings.ForgotPassword)
    }

    const onSignUpPress = () => {
        props.navigation.navigate(navigationStrings.SignUp)
    }

    return (
        <View style={styles.screenContainer}>
            <AuthHeader headerTitle='LOGIN' />
            <View style={styles.cardView}>
                <PrimaryTextInput placeholder='johndoe@gmail.com' value={email} secureEntry={false} onChangeText={(text) => {
                    setEmail(text)
                }} imageSource={imagePath.mailIcon} />
                <PrimaryTextInput placeholder='Password' value={password} secureEntry={true} onChangeText={(text) => {
                    setPassword(text)
                }} imageSource={imagePath.lockIcon} />
                <Text onPress={onForgotPasswordPress} style={commonStyles.textWhiteNormal(13, { marginLeft: 20, color: colors.black, textAlign: 'center', right: 20, position: 'absolute', bottom: 20 })}>Forgot Password?</Text>
            </View>
            <CommonButton isLoading={isLoading} buttonTitle='Sign In' onPress={onLoginPress} customStyles={{ width: 298, marginTop: 30 }} />
            <Text onPress={onSignUpPress} style={commonStyles.textWhiteBold(18, { color: colors.green, marginTop: 40 })}>Create Account?</Text>
            {ErrorToast(emailError, 'Please enter an valid email address to continue')}
            {ErrorToast(passwordError, 'Please enter a password to continue')}
        </View>
    )
}

const mapStateToProps = (state) => {
    return { userData: state.userData, accessToken: state.accessToken, isPlayerMinimized: state.isPlayerMinimized, currentPlaylist: state.currentPlaylist, playCount: state.playCount, advertisements: state.advertisements, currentTrackIndex: state.currentTrackIndex }
}

export default connect(mapStateToProps)(Login)

const styles = StyleSheet.create({
    screenContainer: { flex: 1, alignItems: 'center' },
    cardView: { backgroundColor: 'white', width: 298, minHeight: 220, elevation: 4, borderRadius: 20, padding: 20, marginTop: 40 }
})

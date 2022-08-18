import React, { useState } from 'react'
import { View, Text, StyleSheet, Platform, ScrollView, ToastAndroid, Keyboard, Image } from 'react-native';
import { PrimaryTextInput } from '../Components/PrimaryTextInput'
import { CommonButton } from '../Components/CommonButton';
import { AuthHeader } from '../Components/AuthHeader';
import { commonStyles } from '../constants/commonStyles';
import { imagePath } from '../constants/imagePath';
import { navigationStrings } from '../navigation/navigationStrings';
import { colors } from '../constants/colors';
import ErrorToast from '../Components/ErrorToast';
import { apiHandler } from '../constants/apiHandler';
import { AsyncStorageFunctions } from '../constants/asyncStorage';
import { currentPlatform } from '../constants/globalConstants';
import { connect, useDispatch } from 'react-redux';
import { setUserData, setAccessToken, minimizePlayer, setTrackIndex } from '../redux/actions/actions';
import { PlayControls } from '../Components/PlayControls';
import { PressableImage } from '../Components/PressableImage';
import AntDesign from 'react-native-vector-icons/AntDesign'

const Signup = (props) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cPassword, setCpassword] = useState('');
    const [termsAndConditionsAccepted, setTermsAndConditionsAccepted] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [usernameError, setUsernameError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [passwordMismatch, setPasswordMismatch] = useState(false)
    const [showSpacingError, setShowSpacingError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const validateEmail = (mail) => {
        return String(mail)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    }

    const dispatch = useDispatch()

    const onLoginPress = () => props.navigation.navigate(navigationStrings.Login)

    const onSignUpPress = async () => {
        console.log('Called')
        if (!termsAndConditionsAccepted) {
            ToastAndroid.show('Please accept terms and conditions to continue', 700)
        }
        else {
            if (name == '' || name.length < 4) {
                setUsernameError(true)
                setTimeout(() => {
                    setUsernameError(false)
                }, 1000);
            }
            else if (email == '' || !validateEmail(email.trim())) {
                setEmailError(true)
                setTimeout(() => {
                    setEmailError(false)
                }, 1000);
            }
            else if (password.trim().length < 6) {
                setPasswordError(true)
                setTimeout(() => {
                    setPasswordError(false)
                }, 1000);
            }
            else if (password.trim() != cPassword.trim()) {
                setPasswordMismatch(true)
                setTimeout(() => {
                    setPasswordMismatch(false)
                }, 1000);
            }
            else if (password.includes(' ') || cPassword.includes(' ')) {
                setShowSpacingError(true)
                setTimeout(() => {
                    setShowSpacingError(false)
                }, 1000);
            }
            else {
                try {
                    setIsLoading(true)
                    let fcmToken = await AsyncStorageFunctions.getItem('fcmToken')
                    let signUpData = {
                        name: name.trim(),
                        email: email.trim(),
                        password: password.trim(),
                        password_confirmation: cPassword.trim(),
                        device_type: currentPlatform,
                        device_token: 'android',
                        fcm_token: fcmToken
                    }
                    let formData = apiHandler.createFormData(signUpData)
                    const response = await apiHandler.signUp(formData)
                    setIsLoading(false)
                    if (response?.data?.success) {
                        const token = response.data.token
                        const userData = response.data.user_details
                        await AsyncStorageFunctions.setItem('token', token)
                        // dispatch(setUserData(userData))
                        // dispatch(setAccessToken(token))
                        props.navigation.navigate(navigationStrings.Login)
                    }
                    else {
                        ToastAndroid.show(response?.data?.message, 1000)
                    }
                }
                catch (error) {
                    console.log('Error is', error)
                }
            }
        }
    }


    const maximizePlayer = () => {
        dispatch(minimizePlayer(false))
        props.navigation.navigate(navigationStrings.PlaySong, { songDetails: props.currentSong })
    }

    const updateTrackIndex = (index) => {
        dispatch(setTrackIndex(index))
    }

    const onShowTermsAndConditionsPress = (arg) => {
        // setTermsAndConditionsAccepted(true)
        props.navigation.navigate(navigationStrings.TermsScreen, { isTermsConditions: arg })
    }

    return (
        <View style={styles.screenContainer}>
            <AuthHeader headerTitle='CREATE ACCOUNT' />
            <ScrollView>
                <View style={styles.screenContainer}>
                    <View style={styles.cardView}>
                        <PrimaryTextInput placeholder='John Doe' value={name} secureEntry={false} onChangeText={(text) => {
                            setName(text)
                        }} imageSource={imagePath.profileIcon} />
                        <PrimaryTextInput placeholder='JohnDoe@gmail.com' value={email} secureEntry={false} onChangeText={(text) => {
                            setEmail(text)
                        }} imageSource={imagePath.mailIcon} />
                        <PrimaryTextInput placeholder='Password' value={password} secureEntry={true} onChangeText={(text) => {
                            // alert('hello'+text+'this')
                            // if (text.trim().length==0) {
                            //     // Keyboard.dismiss()

                            // }
                            // else {
                            setPassword(text)
                            // }
                        }} imageSource={imagePath.lockIcon} />
                        <PrimaryTextInput placeholder='Confirm Password' value={cPassword} secureEntry={true} onChangeText={(text) => {
                            setCpassword(text)
                        }} imageSource={imagePath.lockIcon} />
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                            <AntDesign name='checkcircle' onPress={() => { setTermsAndConditionsAccepted(!termsAndConditionsAccepted) }} style={{ fontSize: 25, color: !termsAndConditionsAccepted ? colors.darkGrey : colors.green }} />
                            <View>
                                <Text style={commonStyles.textWhiteNormal(11, { marginLeft: 20, color: colors.black, textAlign: 'center' })}>By creating an account you agree to our</Text>
                                <Text style={commonStyles.textWhiteNormal(11, { marginLeft: 20, color: colors.black, textAlign: 'center' })}>
                                    <Text style={commonStyles.textWhiteNormal(11, { marginLeft: 20, color: colors.green, textAlign: 'center' })} onPress={() => { onShowTermsAndConditionsPress(true) }}>
                                        Terms of Service
                                    </Text>
                                    <Text style={commonStyles.textWhiteNormal(11, { marginLeft: 20, color: colors.black, textAlign: 'center' })}>
                                        {' ' + 'and' + ' '}
                                    </Text>
                                    <Text style={commonStyles.textWhiteNormal(11, { marginLeft: 20, color: colors.green, textAlign: 'center' })} onPress={() => { onShowTermsAndConditionsPress(false) }}>
                                        Privacy Policy
                                    </Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                    <CommonButton isLoading={isLoading} buttonTitle='CONTINUE' onPress={onSignUpPress} customStyles={{ width: 298, marginTop: 30 }} />
                    <Text onPress={onLoginPress} style={commonStyles.textWhiteBold(13, { color: colors.green, marginTop: 20 })}>Already have an account? Login</Text>
                    {ErrorToast(emailError, 'Please enter a valid email')}
                    {ErrorToast(usernameError, 'Username must be of atleast 4 words')}
                    {ErrorToast(passwordError, 'Password must contain six or more digits')}
                    {ErrorToast(passwordMismatch, 'Both passwords do not match')}
                    {ErrorToast(showSpacingError, 'Password can not contain spaces')}
                </View>
            </ScrollView>
            {
                (props.isPlayerMinimized) && <PlayControls updateIndex={(index) => { updateTrackIndex(index) }} currentIndex={props.currentTrackIndex} currentPlaylist={props.currentPlaylist} playCount={props.playCount} changePlayerState={maximizePlayer} isMinimized={props.isPlayerMinimized} userData={props.userData} token={props.accessToken} />
            }
        </View>
    )
}
const mapStateToProps = (state) => {
    return { userData: state.userData, accessToken: state.accessToken, isPlayerMinimized: state.isPlayerMinimized, currentPlaylist: state.currentPlaylist, playCount: state.playCount, advertisements: state.advertisements, currentTrackIndex: state.currentTrackIndex }
}

export default connect(mapStateToProps)(Signup)
const styles = StyleSheet.create({
    cardView: { backgroundColor: colors.white, width: 298, minHeight: 372, elevation: 4, borderRadius: 20, padding: 20, marginTop: 40 },
    screenContainer: { flex: 1, alignItems: 'center' },
})

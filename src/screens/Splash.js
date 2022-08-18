import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Text, View, ImageBackground, Image, StyleSheet, Platform, ActivityIndicator, Animated, Easing, BackHandler, Modal, ColorPropType, ToastAndroid, Alert } from 'react-native'
import { SocialLoginButton } from '../Components/SocialLoginButton'
import { CommonButton } from '../Components/CommonButton';
import { commonStyles } from '../constants/commonStyles';
import { imagePath } from '../constants/imagePath';
import { navigationStrings } from '../navigation/navigationStrings';
import { colors } from '../constants/colors';
import {
    AccessToken, LoginManager, GraphRequest,
    GraphRequestManager,
} from "react-native-fbsdk";
import {
    GoogleSignin,
} from '@react-native-google-signin/google-signin';
import { apiHandler } from '../constants/apiHandler';
import { AsyncStorageFunctions } from '../constants/asyncStorage';
import { appleAuth, appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import { LoadingComponent } from '../Components/LoadingComponent';
import { connect, useDispatch } from 'react-redux';
import { setUserData, setAccessToken, advertisments, minimizePlayer, setTrackIndex } from '../redux/actions/actions'
import { windowWidth, windowHeight } from '../constants/globalConstants'
import { PlayControls } from '../Components/PlayControls';
import Carousel from 'react-native-snap-carousel';
import LinearGradient from 'react-native-linear-gradient'
import { ScrollView } from 'react-native-gesture-handler';
import WebView from 'react-native-webview';
import { PressableImage } from '../Components/PressableImage';
import { useFocusEffect } from '@react-navigation/native';

const Splash = (props) => {

    const eSocialLoginOptions = {
        None: '',
        Facebook: 'facebook',
        Google: 'google',
        Apple: 'apple'
    }

    const [isLoading, setIsLoading] = useState(false)
    const [initialLoader, setInitialLoader] = useState(false)
    const [loginType, setLoginType] = useState(eSocialLoginOptions.None)
    const [termsAndConditionsAccepted, setTermsAndConditionsAccepted] = useState(false)
    const [conditionAccepted, setConditionAccepted] = useState(false)
    const [leftAnchor] = useState(new Animated.Value(0))
    const [leftAnchor2] = useState(new Animated.Value(0))
    // const [value, setValue] = useState(0)
    // const [value1, setValue1] = useState(0)
    const [click, setClick] = useState(0)
    const [images, setImages] = useState([])
    const [imageSource, setImageSource] = useState('')
    const carousel = useRef()

    // leftAnchor.addListener(({ value }) => {
    //     setValue(value)
    // })

    // leftAnchor2.addListener(({ value }) => {
    //     setValue1(value)
    // })

    // useEffect(() => {
    //     const subscribe1 = props.navigation.addListener('focus', focusHandler)
    //     const subscribe2 = props.navigation.addListener('blur', blurHandler)
    //     return () => {
    //         // executed when unmount
    //         subscribe1();
    //         subscribe2();
    //     }
    // }, [props.navigation])

    // useEffect(() => {
    //     initialSetup()
    // }, [])

    useFocusEffect(
        useCallback(() => {
            initialSetup()
        }, []))

    const dispatch = useDispatch()

    const initialSetup = async () => {
        setInitialLoader(true)
        // let termsAndConditionsAcceptedValue = await AsyncStorageFunctions.getItem('termsAccepted')
        // if (termsAndConditionsAcceptedValue) {
        // setTermsAndConditionsAccepted(false)
        const token = await AsyncStorageFunctions.getItem('token')
        if (token) {
            let userData = await apiHandler.getUserData(token)
            userData = userData.data
            dispatch(setUserData(userData))
            dispatch(setAccessToken(token))
        }
        else {
            let response = await apiHandler.getIntrobackgroundImages()
            response = response.map((item, index) => {
                return 'https://api.afromelodiez.com/storage/banner/' + item
            })
            setImages(response)
            setInitialLoader(false)
            // animateImages()
            // setInterval(() => {
            //     animateImages()
            // }, 7200)
        }
        // }
        // else {
        //     setTermsAndConditionsAccepted(true)
        // }
        setInitialLoader(false)
    }

    const animateImages = () => {
        setClick(0)
        let randomNumber = Math.ceil(Math.random() * images.length - 1)
        setImageSource(images[randomNumber])
        Animated.timing(leftAnchor, {
            toValue: 1 * windowWidth,
            duration: 3500,
            easing: Easing.linear,
            useNativeDriver: false
        }).start(() => {
            setClick(1)
            let randomNumber = Math.ceil(Math.random() * images.length - 1)
            setImageSource(images[randomNumber])
            Animated.timing(leftAnchor, {
                toValue: 0,
                duration: 100,
                useNativeDriver: false
            }).start()
            Animated.timing(leftAnchor2, {
                toValue: 1 * windowWidth,
                duration: 3500,
                easing: Easing.linear,
                useNativeDriver: false
            }).start(() => {
                Animated.timing(leftAnchor2, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: false
                }).start()
            })
        })
    }

    const signUpPress = () => {
        props.navigation.navigate(navigationStrings.SignUp)
    }

    const onLoginPress = () => {
        props.navigation.navigate(navigationStrings.Login)
    }

    const onGooglePress = () => {
        setIsLoading(true)
        setLoginType(eSocialLoginOptions.Google)
        GoogleSignin.configure({
            androidClientId: '469412287743-gc5p6llb58aekvk8i55af7k7j4e6vf0m.apps.googleusercontent.com',
            iosClientId: '469412287743-9iql75f7tijnrodc6m1p684s38bggu62.apps.googleusercontent.com',
        });
        GoogleSignin.hasPlayServices().then((hasPlayService) => {
            if (hasPlayService) {
                GoogleSignin.signIn().then((userInfo) => {
                        socialLogin(userInfo.user)
                }).catch((e) => {
                    Alert.alert('Error is', JSON.stringify(e))
                    console.log("ERROR IS: " + JSON.stringify(e));
                })
            }
        }).catch((e) => {
            console.log("ERROR IS: " + JSON.stringify(e));
        })
    }

    const onApplePress = () => {
        const rawNonce = Math.floor(Math.random() * 10000000000000000000000).toString()
        const state = Math.floor(Math.random() * 10000000000000000000000).toString()
        appleAuthAndroid.configure({
            clientId: 'com.musicstream',
            redirectUri: 'https://example-app.com/redirect',
            responseType: appleAuthAndroid.ResponseType.ALL,
            scope: appleAuthAndroid.Scope.ALL,
            nonce: rawNonce,
            state,
        });

        appleAuthAndroid.signIn().then((response) => {
            console.log('This is the response', response)
        })
        // const appleAuthRequestResponse = await appleAuth.performRequest({
        //     requestedOperation: appleAuth.Operation.LOGIN,
        //     requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        // });

        // const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

        // if (credentialState === appleAuth.State.AUTHORIZED) {
        //     console.log('User is authenticated')
        //     // user is authenticated
        // }
    };

    const loginWithFacebook = () => {
        setIsLoading(true)
        setLoginType(eSocialLoginOptions.Facebook)
        LoginManager.setLoginBehavior("web_only")
        LoginManager.logInWithPermissions(["public_profile", "email", "user_friends"]).then((result) => {
            if (result.isCancelled) {
                setIsLoading(false)
            } else {
                AccessToken.getCurrentAccessToken().then(
                    (data) => {
                        console.log('Data', data)
                        const accessToken = data.accessToken.toString()
                        getUserInfoFromFacebookToken(accessToken)
                    }).catch((error) => {
                        console.log('Error fetching accessToken')
                    })
            }
        })
    }

    const getUserInfoFromFacebookToken = (token) => {
        const PROFILE_REQUEST_PARAMS = {
            fields: {
                string: 'id, name, first_name, last_name, birthday, email'
            },
        }
        const profileRequest = new GraphRequest('/me', { token, parameters: PROFILE_REQUEST_PARAMS },
            (error, result) => {
                if (error) {
                    console.log('Login Info has an error:', error)
                }
                else {
                    if (result.isCancelled) {
                        console.log("Login cancelled");
                    }
                    if (result.email === undefined) {
                        Alert.alert("Error", "To contiune MyApp plase allow access to your email", "Ok")
                    }
                    else {
                        console.log('This is the result')
                        AsyncStorageFunctions.setItem('isGoogleLogin', 'false').then(() => {
                            socialLogin(result)
                        })
                    }
                }
            },
        )
        new GraphRequestManager().addRequest(profileRequest).start()
    }

    const socialLogin = async (result) => {
        let fcmToken = await AsyncStorageFunctions.getItem('fcmToken')
        let socialLogindata = {
            name: result.name,
            email: result.email,
            provider_id: result.id,
            provider_name: loginType,
            password: 12345678,
            device_type: Platform.OS,
            device_token: Math.floor(Math.random() * 10000).toString(),
            fcm_token: fcmToken
        }
        let formData = apiHandler.createFormData(socialLogindata)
        const socialResponse = await apiHandler.socialLogin(formData)
        if (socialResponse?.data?.status == 200) {
            const token = socialResponse?.data?.data?.access_token
            await AsyncStorageFunctions.setItem('token', token)
            let userData = await apiHandler.getUserData(token)
            userData = userData.data
            dispatch(setUserData(userData))
            dispatch(setAccessToken(token))
            setIsLoading(false)
        }
        else {
            setIsLoading(false)
        }
    }

    const _renderItem = useCallback(({ item, index }) => {
        return (
            <ImageBackground source={{ uri: item }} style={commonStyles.flexFull} />
        );
    }, [])

    const onContinuePress = async () => {
        if (conditionAccepted) {
            await AsyncStorageFunctions.setItem('termsAccepted', 'true')
            setTermsAndConditionsAccepted(false)
        }
        else {
            ToastAndroid.show('Please Accept to continue', 700)
        }
    }

    // const onShowTermsAndConditionsPress = (url) => {
    //     setTermsAndConditionsAccepted(true)
    //     props.navigation.replace(navigationStrings.AppWebView, { source: url })
    // }

    return (
        initialLoader ? <LoadingComponent />
            :
            <View style={commonStyles.fullScreenContainer}>
                <View style={{ position: 'absolute', height: windowHeight, top: 0, width: windowWidth }}>
                    <Carousel
                        ref={(c) => { carousel.current = c }}
                        data={images}
                        renderItem={_renderItem}
                        sliderWidth={windowWidth}
                        itemWidth={windowWidth}
                        autoplay={true}
                        autoplayInterval={2500}
                        loop={true}
                        scrollEnabled={false}
                    />
                </View>
                {/* <Animated.View style={{ position: 'absolute', left: click % 2 == 0 ? -value : -value1, height: windowHeight, width: 2  windowWidth }}>
                    <ImageBackground source={{ uri: imageSource }} style={{ height: windowHeight, width: 2 * windowWidth, resizeMode: 'stretch' }} />
                </Animated.View> */}
                <Image source={imagePath.mapIcon} style={styles.mapImageStyle} />
                <LinearGradient
                    style={{ alignItems: 'center', paddingVertical: 20, borderRadius: 12 }}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    colors={['#00000099', '#00000077', '#00000055', '#00000033', '#00000055', '#00000077', '#00000099']}>
                    <Text style={commonStyles.textWhiteBold(20)}>Free Somali Songs</Text>
                    <Text style={commonStyles.textWhiteBold(20)}>On AfroMelodiez</Text>
                    <CommonButton buttonTitle='Sign Up Free' onPress={signUpPress} isRounded={true} customStyles={{ marginTop: 40 }} />
                    <SocialLoginButton isLoading={isLoading && loginType == eSocialLoginOptions.Facebook} buttonTitle='Continue with Facebook' onPress={loginWithFacebook} imageSource={imagePath.facebookIcon} />
                    <SocialLoginButton isLoading={isLoading && loginType == eSocialLoginOptions.Google} buttonTitle='Continue with Google' onPress={onGooglePress} imageSource={imagePath.googleIcon} />
                    {/* <SocialLoginButton buttonTitle='Continue with Apple' onPress={onApplePress} imageSource={imagePath.appleIcon} /> */}
                </LinearGradient>
                <LinearGradient
                    style={{ alignItems: 'center', paddingVertical: 40, borderTopLeftRadius: 12, borderTopRightRadius: 12, bottom: 0, position: 'absolute', width: windowWidth }}
                    start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                    locations={[0, 0.02, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.8]}
                    colors={['#00000000', '#00000010', '#00000022', '#00000044', '#00000066', '#00000088', '#000000aa', '#000000cc', '#000000ff']}
                >
                    <Text onPress={onLoginPress} style={commonStyles.textWhiteBold(24, { color: colors.green })}>Login</Text>
                </LinearGradient>
            </View >
    )
}

const mapStateToProps = (state) => {
    return { userData: state.userData }
}

export default connect(mapStateToProps)(Splash);


const styles = StyleSheet.create({
    loaderContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.black },
    mapImageStyle: { width: 146, height: 147 },
    loginTextContainer: { borderBottomWidth: 4, paddingBottom: 10, width: windowWidth * 0.4, alignItems: 'center', borderColor: '#4e4e4e', bottom: 40, position: 'absolute' },
    termsAndConditionsModalFullContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    termsAndConditionsModalInnerContainer: { height: 0.6 * windowHeight, width: windowWidth * 0.9, backgroundColor: colors.black, borderRadius: 12, paddingVertical: 24, paddingHorizontal: 12, alignItems: 'center' },
})
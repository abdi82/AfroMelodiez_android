import React, { useEffect } from 'react'
import { View, StyleSheet, BackHandler } from 'react-native'
import { commonStyles } from '../constants/commonStyles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { colors } from '../constants/colors'
import WebView from 'react-native-webview'
import { windowHeight, windowWidth } from '../constants/globalConstants'
import { useRoute } from '@react-navigation/native'
import { navigationStrings } from '../navigation/navigationStrings'

export const AppWebView = (props) => {
    const route = useRoute()
    const source = route.params.source

    const handleBackButton = () => {
        if (props.navigation.canGoBack()) {
            props.navigation.goBack()
        }
    }

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            handleBackButton
        )
        return () => backHandler.remove();
    }, [])

    const onCloseIconPress = () => {
        if (props.navigation.canGoBack()) {
            props.navigation.goBack()
        }
        else {
            props.navigation.replace(navigationStrings.Splash)
        }
    }
    return (
        <View style={styles.fullContainer}>
            <Ionicons onPress={onCloseIconPress} name='close' style={styles.closeIconStyle} />
            <WebView source={{ uri: source }} />
        </View>
    )
}

const styles = StyleSheet.create({
    fullContainer: { flex: 1 },
    closeIconStyle: { fontSize: 25, color: colors.black, marginTop: 10, marginLeft: 10, alignSelf: 'flex-start' }
})
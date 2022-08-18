import React from 'react'
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { PressableImage } from './PressableImage'
import { imagePath } from '../constants/imagePath'

export const AuthHeader = ({ headerTitle }) => {
    const navigation = useNavigation()
    const imagePressed = () => {
        navigation.goBack()
    }
    return (
        <View style={styles.fullContainer}>
            <PressableImage imageSource={imagePath.backIcon} onPress={imagePressed} imageStyle={styles.imageStyle} />
            <View style={styles.innerContainer}>
                <Text style={styles.titleTextStyle}>{headerTitle}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    fullContainer: { padding: 20, width: '100%', flexDirection: 'row', backgroundColor: '#25D366', borderBottomLeftRadius: 20, alignItems: 'center', borderBottomRightRadius: 20, height: 60 },
    imageStyle: { height: 20, width: 20, resizeMode: 'contain' },
    innerContainer: { flex: 1 },
    titleTextStyle: { fontWeight: 'bold', fontSize: 16, color: 'white', alignSelf: 'center' }
})
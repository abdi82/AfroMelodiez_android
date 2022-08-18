import React from 'react'
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { imagePath } from '../constants/imagePath'
import { colors } from '../constants/colors'
import { commonStyles } from '../constants/commonStyles'

export const PressableImage = ({ imageSource, imageStyle, onPress = () => { } }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <Image source={imageSource} style={imageStyle} resizeMode='contain'/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({

})
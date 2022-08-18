import React from 'react'
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { imagePath } from '../constants/imagePath'

export const Checkbox = ({ isSelected }) => {
    const imageSource = isSelected ? imagePath.checkedRadioIcon : imagePath.uncheckedRadioIcon
    return (
        <Image source={imageSource} style={styles.containerStyle} />
    )
}

const styles = StyleSheet.create({
    containerStyle: { height: 18, width: 32, resizeMode: 'contain' }
})
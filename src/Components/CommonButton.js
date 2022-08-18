import React from 'react'
import { View, Image, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { colors } from '../constants/colors'

export const CommonButton = ({ buttonTitle, onPress = () => { }, isRounded, customStyles, isLoading, customTextStyles }) => {
    return (
        <TouchableOpacity disabled={isLoading} onPress={onPress} style={styles.fullContainer(isRounded, customStyles)}>
            {isLoading ? <ActivityIndicator color={colors.white} /> :
                <Text style={styles.titleStyle(customTextStyles)}>{buttonTitle}</Text>}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    fullContainer: (isRounded, customStyles) => {
        return { marginLeft: 20, marginRight: 20, height: isRounded ? 40 : 60, backgroundColor: '#25D366', width: 238, borderRadius: isRounded ? 20 : 8, justifyContent: 'center', alignItems: 'center', marginTop: 20, ...customStyles }
    },
    titleStyle: (customTextStyles) => {
        return { fontWeight: 'bold', fontSize: 13, color: 'white', ...customTextStyles }
    }
})
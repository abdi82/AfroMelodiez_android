

import React from 'react'
import { View, StyleSheet, ActivityIndicator, Modal } from 'react-native'
import { imagePath } from '../constants/imagePath'
import { colors } from '../constants/colors'
import { windowHeight, windowWidth } from '../constants/globalConstants'

export const LoadingComponent = () => {
    return (
        <View style={styles.loaderContainer}>
            <ActivityIndicator size='large' color={colors.green} />
        </View>
    )
}

const styles = StyleSheet.create({
    loaderContainer: { height: windowHeight, width: windowWidth, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }
})
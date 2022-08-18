import React from 'react'
import { View, Image, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { commonStyles } from '../constants/commonStyles'
import { colors } from '../constants/colors'

export const SocialLoginButton = ({ buttonTitle, imageSource, disabled, onPress = () => { }, isLoading }) => {
    return (
        <TouchableOpacity disabled={disabled} style={styles.fullContainer} onPress={onPress}>
            {isLoading ?
                <ActivityIndicator color={colors.white}>

                </ActivityIndicator>
                : <View style={commonStyles.flexRow_CenterItems}>
                    <Image source={imageSource} style={styles.imageStyle} resizeMode='contain' />
                    <View style={styles.innerContainer}>
                        <Text style={styles.titleStyle}>{buttonTitle}</Text>
                    </View>
                </View>}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    fullContainer: { height: 40, marginLeft: 20, marginRight: 20, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-around', borderColor: colors.green, width: 238, borderRadius: 20, alignItems: 'center', marginTop: 10 },
    imageStyle: { height: 20, width: 20, marginLeft: 10 },
    innerContainer: { flex: 1 },
    titleStyle: { fontWeight: 'bold', marginLeft: 20, fontSize: 13, color: colors.white }
})
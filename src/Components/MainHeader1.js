import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../constants/colors'
import { commonStyles } from '../constants/commonStyles'

export const MainHeader1 = ({ leftIcon, leftText, headerPrimaryTitle, headerSecondaryTitle, rightText, rightIcon, onLeftIconPress = () => { }, onRightIconPress = () => { }, customStyles = {} }) => {
    return (
        <View style={[styles.fullContainer, customStyles]}>
            {leftText ?
                <Text style={styles.sideText} onPress={onLeftIconPress}>
                    {leftText}
                </Text> :
                leftIcon ?
                    leftIcon()
                    : null}
            <View style={styles.innerContainer}>
                <Text style={headerSecondaryTitle ? commonStyles.textLightNormal(13) : commonStyles.textWhiteNormal(17)}>{headerPrimaryTitle}</Text>
                {headerSecondaryTitle && <Text style={commonStyles.textLightBold(17)}>
                    {headerSecondaryTitle}</Text>}
            </View>
            {rightText ?
                <Text style={styles.sideText} onPress={onRightIconPress}>
                    {rightText}
                </Text> :
                rightIcon ?
                    rightIcon()
                    : null}
        </View>
    )
}

const styles = StyleSheet.create({
    fullContainer: { paddingBottom: 15, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    imageStyle: { height: 20, width: 20, resizeMode: 'contain' },
    innerContainer: { flex: 1, alignItems: 'center' },
    sideText: { fontSize: 14, color: colors.white, opacity: 0.8 }
})
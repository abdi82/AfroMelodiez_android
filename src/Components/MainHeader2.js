import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { commonStyles } from '../constants/commonStyles'
import { PressableImage } from './PressableImage'
import { imagePath } from '../constants/imagePath'

export const MainHeader2 = ({ leftImage, headerPrimaryTitle, rightFirstIcon, rightSecondIcon, rightThirdIcon, onLeftIconPress = () => { }, }) => {
    return (
        <View style={styles.fullContainer}>
            {leftImage && <PressableImage imageSource={leftImage} imageStyle={leftImage == imagePath.backIcon ? styles.imageStyle : { height: 35, width: 35 }} onPress={onLeftIconPress} />}
            <View style={styles.innerContainer(leftImage)}>
                <View style={commonStyles.flexFull}>
                    <Text style={commonStyles.textWhiteBold(25, { marginLeft: leftImage ? 5 : 0 })}>{headerPrimaryTitle}</Text>
                </View>
                <View style={styles.rightIconsContainer}>
                    {rightFirstIcon && rightFirstIcon()}
                    {rightSecondIcon && rightSecondIcon()}
                    {rightThirdIcon && rightThirdIcon()}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    fullContainer: { paddingBottom: 15, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    imageStyle: { height: 20, width: 25, alignSelf: 'center', resizeMode: 'contain' },
    rightIconsContainer: { flexDirection: 'row' },
    innerContainer: (leftIcon) => {
        return { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: leftIcon ? 10 : 0 }
    },
    rightImageStyle: { height: 30, width: 30, resizeMode: 'contain', marginRight: 10 },
})
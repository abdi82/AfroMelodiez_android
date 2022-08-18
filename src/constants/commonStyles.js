import { StyleSheet, Dimensions, PixelRatio } from 'react-native';
import { colors } from './colors';

import { windowWidth, windowHeight } from './globalConstants';
const height = Dimensions.get('screen').height

export const commonStyles = StyleSheet.create({
    flexFull: {
        flex: 1
    },
    flexFull_CenterItems: {
        flex: 1,
        alignItems: 'center'
    },
    fullWidth: {
        width: '100%'
    },
    flexFull_Row: {
        flex: 1,
        flexDirection: 'row'
    },
    flexRow_CenterItems: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    fullScreenContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    fullScreenContainerBlack: (isPlayerMinimized) => {
        return {
            flex: 1,
            alignItems: 'center',
            backgroundColor: colors.black,
            padding: 15,
            paddingBottom: 0
            // paddingTop: 0
        }
    },
    textWhiteBold: (fontSize, customStyle) => {
        return {
            fontSize: fontSize / PixelRatio.getFontScale(),
            color: colors.white,
            fontFamily: 'brandon-bold',
            // fontWeight: 'bold',
            ...customStyle
        }
    },
    textWhiteNormal: (fontSize, customStyle) => {
        return {
            fontSize: fontSize / PixelRatio.getFontScale(),
            color: colors.white,
            fontFamily: 'brandon-regular',
            ...customStyle
        }
    },
    textLightBold: (fontSize, customStyle) => {
        return {
            fontSize: fontSize / PixelRatio.getFontScale(),
            // fontWeight: 'bold',
            color: colors.lightText,
            fontFamily: 'brandon-bold',
            ...customStyle
        }
    },
    textLightNormal: (fontSize, customStyle) => {
        return {
            fontSize: fontSize / PixelRatio.getFontScale(),
            color: colors.lightText,
            fontFamily: 'brandon-regular',
            ...customStyle
        }
    },
    listLoaderComponent: { height: 40, width: windowWidth - 30 },
    linearGradientStyle: { position: 'absolute', top: 0, width: windowWidth, alignSelf: 'center', height: windowHeight, backgroundColor: colors.black },

})
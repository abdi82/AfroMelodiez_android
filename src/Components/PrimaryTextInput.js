import React from 'react'
import { View, Image, TextInput, StyleSheet } from 'react-native'
import { colors } from '../constants/colors'

export const PrimaryTextInput = ({ caretHidden = false, placeholder, value, textAlign, secureEntry, imageSource, onChangeText = () => { }, customStyles, customTextStyles }) => {
    return (
        <View style={styles.fullContainer(customStyles)}>
            <Image source={imageSource} style={styles.imageStyle} />
            <TextInput
                style={styles.textInputStyle(customTextStyles)}
                value={value}
                textAlign={textAlign ? textAlign : 'left'}
                onChangeText={(text) => onChangeText(text)}
                placeholder={placeholder}
                caretHidden={caretHidden}
                secureTextEntry={secureEntry}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    fullContainer: (customStyles) => {
        return { borderBottomWidth: 1, borderBottomColor: '#808080', flexDirection: 'row', marginTop: 20, alignItems: 'center', ...customStyles }
    },
    imageStyle: { height: 16, width: 16 },
    textInputStyle: (customTextStyles) => {
        return { marginLeft: 20, flex: 1, color: colors.darkGrey, ...customTextStyles }
    }
})
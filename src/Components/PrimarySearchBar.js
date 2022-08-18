import React from 'react'
import { View, Image, TextInput, StyleSheet } from 'react-native'
import { colors } from '../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'

export const PrimarySearchBar = ({ placeholder, value, searchIcon, onChangeText = () => { } }) => {
    return (
        <View style={styles.fullContainer}>
            {searchIcon && <AntDesign name={searchIcon} style={styles.iconStyle} />}
            <TextInput
                style={styles.textInputStyle}
                value={value}
                onChangeText={(text) => onChangeText(text)}
                placeholder={placeholder}
                placeholderTextColor='rgba(0,0,0,1)'
            />
            {value != '' && <AntDesign name='close' onPress={() => onChangeText('')} style={styles.iconStyle} />}
        </View>
    )
}

const styles = StyleSheet.create({
    fullContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, borderRadius: 8, backgroundColor: colors.white, marginBottom: 10 },
    imageStyle: { height: 16, width: 16 },
    textInputStyle: { flex: 1, fontWeight: 'bold', opacity: 0.7 },
    iconStyle: { fontSize: 18, color: colors.lightText }
})
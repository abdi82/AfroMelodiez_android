import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { colors } from '../constants/colors';
import { commonStyles } from '../constants/commonStyles';
import { windowWidth, windowHeight, SONGS_IMAGE_BASE_URL } from '../constants/globalConstants';
import Pressable from 'react-native';
import { imagePath } from '../constants/imagePath';
import Fontisto from 'react-native-vector-icons/Fontisto'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default function OptionsModal({ isVisible, closeModal = () => { }, onSingleIconPress = (title) => { }, songDetails, isDownloaded }) {

    const modalOptions = [
        {
            id: 0,
            title: 'Add to liked songs',
            iconName: 'heart'
        },
        {
            id: 1,
            title: 'Share Song',
            iconName: 'share'
        },
        {
            id: 2,
            title: 'Add to playlist',
            iconName: 'list-2'
        },
        {
            id: 3,
            title: 'Add to downloads',
            iconName: 'arrow-collapse-down'
        },
        {
            id: 4,
            title: 'View Artist',
            iconName: 'person'
        }
    ]

    const artistName = songDetails.artist_id && songDetails.artist_id.length > 0 ? songDetails.artist_id[0].name : 'Dummy artist'

    const renderIcon = (id, title, icon, onIconPress = () => { }) => {
        return <TouchableOpacity onPress={() => { onIconPress(id) }} style={styles.optionContainer}>
            <View style={{ width: 35 }}>
                {id !== 3 ? <Fontisto name={icon} style={styles.optionIconStyle} />
                    : (
                        !isDownloaded ?
                            <MaterialCommunityIcons name={icon} style={{fontSize:26,color:colors.green}} />
                            :
                            <MaterialCommunityIcons name='delete-outline' style={{fontSize:26,color:'#aa0000'}}  />

                    )}
            </View>
            <View style={styles.optionInnerContainer}>
                <Text style={commonStyles.textWhiteNormal(20)}>
                    {id !== 3 ?  title 
                        : (
                            !isDownloaded ?
                                 title 
                                :
                                'Remove from downloads'
                        )}
                </Text>
                <MaterialIcons name='navigate-next' style={{ fontSize: 25, color: colors.green }} />
            </View>
        </TouchableOpacity>
    }

    return <Modal onRequestClose={() => { closeModal() }} animationType='slide' transparent={true} visible={isVisible}>
        <TouchableOpacity style={styles.modalTopContainer} onPress={closeModal} />
        <View style={styles.modalFullContainer}>
            <View style={styles.modalInnerContainer}>
                <View style={styles.songDetailsContainer}>
                    <Image style={styles.artistImage} source={{ uri: SONGS_IMAGE_BASE_URL + songDetails.song_image }} />
                    <View style={styles.songDetailsInnerContainer}>
                        <Text style={commonStyles.textWhiteBold(28)}>
                            {songDetails.name}
                        </Text>
                        <Text style={commonStyles.textWhiteNormal(20)}>
                            {artistName}
                        </Text>
                    </View>
                </View>
                <View style={styles.allOptionsContainer}>
                    {
                        modalOptions.map((item, index) => {
                            return (
                                renderIcon(item.id, item.title, item.iconName, (id) => onSingleIconPress(id))
                            )
                        })
                    }
                </View>
            </View>
        </View>
    </Modal>
}

const styles = StyleSheet.create({
    modalFullContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(1,1,1,0.7)'
    },
    modalInnerContainer: {
        width: windowWidth,
        backgroundColor: colors.black,
        padding: 12,
        height: windowHeight * 0.55,
    },
    modalTopContainer: { height: windowHeight * 0.45, backgroundColor: 'rgba(1,1,1,0.7)' },
    optionContainer: { flexDirection: 'row', width: windowWidth - 30, paddingVertical: 20, paddingHorizontal: 10, alignItems: 'center' },
    optionIconStyle: { fontSize: 20, color: colors.green },
    optionInnerContainer: { flex: 1, justifyContent: 'space-between', flexDirection: 'row', marginLeft: 20 },
    allOptionsContainer: { marginTop: 20 },
    songDetailsContainer: { height: 80, flexDirection: 'row', width: windowWidth },
    artistImage: { height: 80, width: 80 },
    songDetailsInnerContainer: { flex: 1, marginLeft: 20 }
})
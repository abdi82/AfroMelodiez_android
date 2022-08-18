import React, { useEffect, useState } from 'react'
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { commonStyles } from '../constants/commonStyles'
import { colors } from '../constants/colors'
import { ARTISTS_IMAGE_BASE_URL, SONGS_IMAGE_BASE_URL, windowWidth } from '../constants/globalConstants'
import { imagePath } from '../constants/imagePath'
import Entypo from 'react-native-vector-icons/Entypo'

export const SingleSong = ({ songDetails, key, marginBottom, onSongPress = () => { }, onShowOptionsPress = () => { }, rightIcon = true, isDownload = false, isVideo = false }) => {

    const [artistName, setArtistName] = useState('')

    useEffect(() => {
        let artistName = (songDetails && songDetails.artist_id) ? songDetails.artist_id.name : 'Dummy artist'
        if (songDetails.featuring && songDetails.featuring.length > 0) {
            for (var iSong = 0; iSong < songDetails.featuring.length; iSong++) {
                if (songDetails.featuring[iSong]) {
                    let featuredArtistName = songDetails.featuring[iSong].name
                    if (iSong == 0) {
                        artistName = artistName + ' feat. ' + featuredArtistName
                    }
                    else {
                        artistName = artistName + ', ' + featuredArtistName
                    }
                }
            }
        }
        setArtistName(artistName)
    })

    return (
        <TouchableOpacity key={key} style={styles.singleSongFullContainer(marginBottom)} onPress={onSongPress}>
            <Image source={isVideo ? (songDetails && songDetails.artist_id && songDetails.artist_id.image ? { uri: ARTISTS_IMAGE_BASE_URL + songDetails.artist_id.image } : imagePath.dummyArtist) : songDetails.song_image && songDetails.song_image != '' ? { uri: SONGS_IMAGE_BASE_URL + songDetails.song_image } : imagePath.dummySong} style={{ height: '100%', width: 70 }} resizeMode='cover' />
            <View style={styles.singleSongInnerContainer}>
                <View style={commonStyles.flexFull}>
                    <Text style={commonStyles.textWhiteNormal(16)}>
                        {songDetails.name || 'Dummy Song'}
                    </Text>
                    {!isDownload && <View style={commonStyles.flexRow_CenterItems}>
                        <View style={{ backgroundColor: '#c7c7c7', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2, borderRadius: 3 }}>
                            <Text style={commonStyles.textWhiteNormal(10, { fontWeight: 'bold', color: '#555555' })}>
                                Artist
                            </Text>
                        </View>
                        <Text numberOfLines={1} style={commonStyles.textLightNormal(12, { marginLeft: 5, fontFamily: 'Roboto', width: '80%' })}>
                            {artistName || 'Dummy artist'}
                        </Text>
                    </View>}
                    {!isDownload && <Text style={commonStyles.textLightNormal(12, { fontFamily: 'Roboto' })}>
                        {songDetails.played ? 'Listened ' + songDetails.played + ' times' : 'Not listened yet'}
                    </Text>}
                </View>
                {rightIcon && <Entypo name='dots-three-vertical' style={{ color: colors.white, fontSize: 20, alignSelf: 'center' }} onPress={() => { onShowOptionsPress(songDetails) }} />}
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    singleSongFullContainer: (marginBottom) => {
        return { flexDirection: 'row', marginBottom: marginBottom ? 70 : 15, alignItems: 'center', width: windowWidth - 40, minHeight: 60, alignSelf: 'center' }
    },
    singleSongInnerContainer: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginLeft: 10 },
})
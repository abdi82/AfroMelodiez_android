import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Image, StyleSheet, TouchableOpacity, PermissionsAndroid } from 'react-native'
import { colors } from '../constants/colors';
import { commonStyles } from '../constants/commonStyles';
import { windowWidth, windowHeight, SONGS_IMAGE_BASE_URL, downloadsPath } from '../constants/globalConstants';
import Pressable from 'react-native';
import { imagePath } from '../constants/imagePath';
import Fontisto from 'react-native-vector-icons/Fontisto'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import TextTicker from 'react-native-text-ticker';
import * as Progress from 'react-native-progress';
import RNFetchBlob from 'rn-fetch-blob';
import { useDispatch, useSelector } from 'react-redux';
import { addDownloadedSong } from '../redux/actions/actions';

export default function OptionsModal({ isVisible, isPodcast, downloadSongId, closeModal = () => { }, onSingleIconPress = (title) => { }, setShowDeleteConfirmationModal = () => { }, songDetails, isLiked }) {
    const modalOptions = [
        {
            id: 0,
            title: 'Like',
            iconName: 'heart'
        },
        {
            id: 1,
            title: 'Share',
            iconName: 'share'
        },
        {
            id: 2,
            title: 'Add to Playlist',
            iconName: 'list-2'
        },
        {
            id: 3,
            title: 'Add to Downloads',
            iconName: 'arrow-collapse-down'
        },
        {
            id: 4,
            title: 'View Artist',
            iconName: 'person'
        }
    ]

    let downloadedSongs = useSelector(state => state.downloadedSongs)

    let isDownloads = (downloadedSongs.findIndex(iSong => {
        return iSong.id == songDetails.id
    }) !== -1)

    const podcastOptions = [
        {
            id: 0,
            title: 'Like',
            iconName: 'heart'
        },
        {
            id: 1,
            title: 'Share',
            iconName: 'share'
        },
        // {
        //     id: 2,
        //     title: 'Add to Playlist',
        //     iconName: 'list-2'
        // },
        // {
        //     id: 3,
        //     title: 'Add to Downloads',
        //     iconName: 'arrow-collapse-down'
        // },
        // {
        //     id: 4,
        //     title: 'View Artist',
        //     iconName: 'person'
        // }
    ]

    const [downloadingProgress, setDownloadProgress] = useState(0)
    const [downloading, setIsDownloading] = useState(false)
    const [isDownloaded, setIsDownloaded] = useState(isDownloads)

    const dispatch = useDispatch()

    const artistName = songDetails && songDetails.artistDetails ? songDetails.artistDetails.name : 'Dummy artist'

    const requestToPermissions = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Music',
                    message:
                        'App needs access to your Files... ',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                startDownload();
            }
        } catch (err) {
            console.log(err);
        }
    };

    var downloadTask;

    const startDownload = async () => {
        if (!isDownloaded) {
            setIsDownloading(true)
            let url = songDetails.url
            let name = songDetails.title
            downloadTask = RNFetchBlob.config({
                fileCache: true,
                appendExt: name + '.mp3',
                // useDownloadManager: true,
                // path:downloadsPath,
                // addAndroidDownloads: {
                // useDownloadManager: true,
                // notification: false,
                // title: name,
                // mime: "audio/mpeg",
                // description: 'Downloading the file',
                // },
            })
                .fetch('GET', url)
                .progress({ interval: 250 }, (received, total) => {
                    setDownloadProgress((received / total))
                })
                .then(res => {
                    console.log('This is the response', res)
                    let downloadedSong = {
                        id: songDetails.id,
                        url: downloadsPath + songDetails.title,
                        type: 'default',
                        name: songDetails.title,
                        album: 'My Album',
                        artist: 'Dummy artist',
                        artswork: imagePath.dummySong,
                        image: imagePath.dummySong,
                    }
                    dispatch(addDownloadedSong(downloadedSong))
                    setIsDownloaded(true)
                    setIsDownloading(false)
                });
        }
        else {
            setShowDeleteConfirmationModal()
        }
    };

    const stopDownload = () => {
        downloadTask.cancel(() => {
            setIsDownloading(false)
            setIsDownloaded(false)
        })
    }
    const renderIcon = (id, title, icon, onIconPress = () => { }) => {
        return <TouchableOpacity onPress={() => { id !== 3 ? onIconPress(id) : requestToPermissions() }} style={styles.optionContainer}>
            <View style={{ width: 35 }}>
                {id == 0 ? <FontAwesome name={isLiked ? 'heart' : 'heart-o'} style={{ fontSize: 20, color: colors.green, }} />
                    :
                    id !== 3 ? <Fontisto name={icon} style={styles.optionIconStyle} />
                        : (
                            !isDownloaded ?
                                (downloadSongId == songDetails.id && downloading ?
                                    <Progress.Circle progress={downloadingProgress} size={30} color={'#aa9f00'} indeterminate={true} /> :
                                    // <MaterialCommunityIcons name='delete' style={{ fontSize: 26, color: 'blue' }} /> :
                                    <MaterialCommunityIcons name={icon} style={{ fontSize: 26, color: colors.green }} />)
                                :
                                <MaterialCommunityIcons name='delete-outline' style={{ fontSize: 26, color: '#aa0000' }} />
                        )}
            </View>
            <View style={styles.optionInnerContainer}>
                <Text style={commonStyles.textWhiteBold(16)}>
                    {id == 0 && isLiked ?
                        'Remove from liked songs'
                        : (
                            id == 3 && isDownloaded ?
                                'Remove from downloads'
                                : title
                        )
                    }
                </Text>
                {/* <MaterialIcons name='navigate-next' style={{ fontSize: 25, color: colors.green }} /> */}
            </View>
        </TouchableOpacity>
    }

    return <Modal onRequestClose={() => { closeModal() }} animationType='slide' transparent={true} visible={isVisible}>
        <TouchableOpacity style={styles.modalTopContainer} onPress={closeModal} />
        <View style={styles.modalFullContainer}>
            <View style={styles.modalInnerContainer}>
                <View style={styles.songDetailsContainer}>
                    <Image style={styles.artistImage} source={songDetails && (songDetails.image == '' || songDetails.image == null ? imagePath.dummySong : { uri: SONGS_IMAGE_BASE_URL + songDetails && songDetails.image })} />
                    <View style={styles.songDetailsInnerContainer}>
                        <TextTicker
                            style={{ fontSize: 22, color: colors.white }}
                            duration={8000}
                            loop
                            bounce={false}
                            repeatSpacer={50}
                        >
                            {songDetails && songDetails.title}
                        </TextTicker>
                        <Text style={commonStyles.textLightNormal(18)}>
                            {artistName}
                        </Text>
                    </View>
                </View>
                <View style={styles.allOptionsContainer}>
                    {
                        isPodcast ?
                            podcastOptions.map((item, index) => {
                                return (
                                    renderIcon(item.id, item.title, item.iconName, (id) => onSingleIconPress(id))
                                )
                            })
                            :
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
    optionContainer: { flexDirection: 'row', width: windowWidth - 30, paddingVertical: 15, paddingHorizontal: 10, alignItems: 'center' },
    optionIconStyle: { fontSize: 20, color: colors.green },
    optionInnerContainer: { flex: 1, justifyContent: 'space-between', flexDirection: 'row', marginLeft: 20 },
    allOptionsContainer: { marginTop: 20 },
    songDetailsContainer: { height: 80, flexDirection: 'row', width: windowWidth },
    artistImage: { height: 80, width: 80 },
    songDetailsInnerContainer: { flex: 1, marginLeft: 20, justifyContent: 'center' }
})
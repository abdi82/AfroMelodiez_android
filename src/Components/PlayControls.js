import React, { useState, useRef } from 'react'
import { View, Share, ScrollView, Image, Text, StyleSheet, ToastAndroid, TouchableOpacity, Modal, Pressable, ImageBackground, ActivityIndicator, Animated } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { commonStyles } from '../constants/commonStyles'
import { colors } from '../constants/colors'
import TrackPlayer, { useProgress, RepeatMode, Event, useTrackPlayerEvents, usePlaybackState, State } from 'react-native-track-player'
import { useEffect } from 'react'
import { windowWidth, windowHeight, SONGS_IMAGE_BASE_URL, eSongListType, downloadsPath, PODCASTS_EPISODES_BASE_URL, SONGS_BASE_URL, VIDEOS_BASE_URL, PODCASTS_EPISODE_IMAGES_BASE_URL } from '../constants/globalConstants'
import Slider from "react-native-slider";
import { apiHandler } from '../constants/apiHandler'
import RNFetchBlob from 'rn-fetch-blob'
import { LoadingComponent } from './LoadingComponent'
import Entypo from 'react-native-vector-icons/Entypo'
import { DeleteItemModal } from './DeleteItemModal'
import OptionsModal from './OptionsModal'
import { useNavigation } from '@react-navigation/native'
import { navigationStrings } from '../navigation/navigationStrings'
import { imagePath } from '../constants/imagePath'
import Video from 'react-native-video';
import { PanGestureHandler } from 'react-native-gesture-handler'
import TextTicker from 'react-native-text-ticker'
import { MainHeader1 } from './MainHeader1'
import { useSelector, useDispatch } from 'react-redux'
import { likeUnlikePodcast, extendPlaylist, toggleShuffle, changeRepeatMode, removeDownloadedSong } from '../redux/actions/actions'
import Fontisto from 'react-native-vector-icons/Fontisto'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const LRC = require('lrc.js')

export const PlayControls = ({ likedSongs, likeUnlikeSong = () => { }, currentIndex, header, isPlaying, setIsPlaying = () => { }, updateIndex = () => { }, isVideo, currentPlaylist, isMinimized, changePlayerState = () => { } }) => {

    const userData = useSelector((state) =>
        state.userData
    )

    const token = useSelector((state) => state.accessToken)

    const likedPodcasts = useSelector((state) =>
        state.likedPodcastsIds
    )

    const userSettings = useSelector((state) =>
        state.userSettings)

    const advertisements = useSelector((state) => state.advertisements)

    const playOptions = [
        {
            id: 0,
            title: 'Shuffle',
            iconName: 'shuffle',
        },
        {
            id: 1,
            title: 'Previous',
            iconName: 'play-skip-back'
        },
        {
            id: 2,
            title: 'Play',
            iconName: 'play'
        },
        {
            id: 3,
            title: 'Next',
            iconName: 'play-skip-forward'
        },
        {
            id: 4,
            title: 'Repeat',
            iconName: 'repeat',
            mode: RepeatMode.Off
        }]

    const podcastOptions = [
        {
            id: 1,
            title: 'Previous',
            iconName: 'md-return-up-back'
        },
        {
            id: 2,
            title: 'Play',
            iconName: 'play'
        },
        {
            id: 3,
            title: 'Next',
            iconName: 'return-up-forward'
        },
    ]

    const playCount = useSelector((state) => state.playCount)

    const lyricsScrollRef = useRef()
    const isShuffle = useSelector((state) =>
        state.isShuffle)
    const repeatMode = useSelector((state) =>
        state.repeatMode)
    const [showLikeModal, setShowLikeModal] = useState(false)
    const [showOptions, setShowOptions] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false)
    const [count, setCount] = useState(0)
    const [adTime, setAdTime] = useState(5)
    const [showAdvertisementModal, setShowAdvertisementModal] = useState(false)
    const [currentTrack, setCurrentTrack] = useState({})
    const [showLyrics, setShowLyrics] = useState(false)
    const [showPlaylists, setShowPlaylists] = useState(false)
    const [videoIndex, setVideoIndex] = useState(currentIndex)
    const [isVideoLoading, setIsVideoLoading] = useState(false)
    const [changeShuffle, setChangeShuffle] = useState(false)
    const [songLyrics, setSongLyrics] = useState([])
    const [videoDuration, setVideoDuration] = useState(0)
    const [videoProgress, setVideoProgress] = useState(0)
    const [downloadSongID, setDownloadSongID] = useState(0)
    const [nextTrack, setNextTrack] = useState({})
    const [videoSettings, setVideoSettings] = useState({})
    const [showVideoSettings, setShowVideoSettings] = useState(false)
    const [hardTrackChange, setHardTrackChange] = useState(true)
    const [advertisement, setAdvertisement] = useState([])
    const [currentAdvertisement, setCurrentAdvertisement] = useState({})
    const [userPlaylists, setUserPlaylists] = useState([])
    const [showExpandedLyricsView, setShowExpandedLyricsView] = useState(false)
    const [fadeAnim] = useState(new Animated.Value(0));
    const { position, buffered, duration } = useProgress()
    const videoPlayer = useRef()

    const dataSaver = userSettings.dataSaver == 1
    const gapless = userSettings.gapless == 1
    const automix = userSettings.automix == 1
    const crossfade = userSettings.crossfade
    const autoPlay = userSettings.autoplay == 1
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const playerState = usePlaybackState()

    useEffect(() => {
        initializeTrackDetails()
    }, [])

    useEffect(() => {
        if (autoPlay == true) {
            getAutoplaySongs()
        }
    }, [currentIndex])

    useEffect(() => {
        updateAdvertisement()
    }, [count, showAdvertisementModal, adTime])

    useEffect(() => {
        getAutomixVolume()
    }, [position])

    useEffect(() => {
        if (isVideo) {
            videoPlayer?.current?.seek(0)
            setCurrentTrack(currentPlaylist[videoIndex])
        }
    }, [videoIndex])

    useEffect(() => {
        let randomNumber = Math.floor(Math.random() * 3)
        switch (randomNumber) {
            case 0:
                setBgImagePath(imagePath.artist1)
                break;
            case 1:
                setBgImagePath(imagePath.artist2)
                break;
            case 2:
                setBgImagePath(imagePath.artist3)
                break;
            default:
                break;
        }
        if (currentTrack && currentTrack.lyrics) {
            let lyrics = LRC.parse(currentTrack.lyrics)
            setSongLyrics(lyrics.lines)
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true
            }).start(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 700,
                    useNativeDriver: true
                }).start(() => {
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 700,
                        useNativeDriver: true
                    }).start(() => {
                        Animated.timing(fadeAnim, {
                            toValue: 0,
                            duration: 700,
                            useNativeDriver: true
                        }).start(() => {
                            Animated.timing(fadeAnim, {
                                toValue: 1,
                                duration: 700,
                                useNativeDriver: true
                            }).start()
                        })
                    });
                })
            });
        }
        else {
            setSongLyrics([])
        }
    }, [currentTrack])

    useEffect(() => {
        crossfadeEffect()
    }, [])

    const getAutoplaySongs = () => {
        let difference = currentPlaylist.length - currentIndex
        if (difference < 20) {
            apiHandler.getAutoplaySongs(token).then((autoplaySongs) => {
                let songs = []
                songs = autoplaySongs.map((item, index) => {
                    return {
                        id: item.id,
                        url: item.isPodcast ? PODCASTS_EPISODES_BASE_URL + item.episode : SONGS_BASE_URL + item.song,
                        videoURL: VIDEOS_BASE_URL + item.video,
                        type: 'default',
                        title: item.isPodcast ? item.title : (item.name || 'Song1'),
                        album: 'My Album',
                        artistDetails: typeof (item.artist_id) == 'number' ? {} : !item.isPodcast && item.artist_id ? { ...item.artist_id } : { name: item.name },
                        artist: !item.isPodcast && item.artist_id ? item.artist_id.name : 'Dummy Artist',
                        image: item.isPodcast ? PODCASTS_EPISODE_IMAGES_BASE_URL + item.image : SONGS_IMAGE_BASE_URL + item.song_image,
                        artwork: item.isPodcast ? PODCASTS_EPISODE_IMAGES_BASE_URL + item.image : SONGS_IMAGE_BASE_URL + item.song_image,
                        lyrics: !item.isPodcast && item.lyrics && item.lyrics,
                        liked: !item.isPodcast && item.liked && [...item.liked],
                        isPodcast: item.isPodcast == 1 ? true : false
                    }
                })
                TrackPlayer.add(songs).then(() => {
                    dispatch(extendPlaylist(songs))
                })
            })
        }
    }

    useTrackPlayerEvents(["playback-track-changed", "remote-duck", "remote-seek", "remote-play", "remote-pause"], async event => {
        if (event.type === Event.PlaybackTrackChanged) {
            if (event.nextTrack != null) {
                if (!currentPlaylist[event.nextTrack].isPodcast) {
                    if (!changeShuffle && !isShuffle && hardTrackChange) {
                        console.log("called")
                        setIsLoading(true)
                        if (isPlaying) {
                            await TrackPlayer.pause()
                        }
                        let trackIndex = event.nextTrack
                        if (currentPlaylist[trackIndex].lyrics) {
                            let lyrics = LRC.parse(currentPlaylist[trackIndex].lyrics)
                            setSongLyrics(lyrics.lines)
                        }
                        updateIndex(trackIndex)
                        setCurrentTrack(currentPlaylist[trackIndex])
                        // await TrackPlayer.skipToNext()
                        setShowLyrics(false)
                        if (!currentPlaylist[trackIndex].isDownload) {
                            let reqObj = {
                                song_id: currentPlaylist[trackIndex].id,
                                user_id: userData.id,
                                artist_id: currentPlaylist[trackIndex].artistDetails.id
                            }
                            await apiHandler.storeSongPlayedByDate(token, reqObj)
                        }
                        if (!isMinimized) {
                            let currentCount = count
                            currentCount++
                            setTimeout(() => {
                                setCount(currentCount)
                            }, 1000)
                        }
                        if (isPlaying) {
                            await TrackPlayer.play()
                        }
                        setIsLoading(false)
                    }
                    else if (isShuffle && changeShuffle && hardTrackChange) {
                        setIsLoading(true)
                        if (isPlaying) {
                            await TrackPlayer.pause()
                        }
                        setChangeShuffle(false)
                        setTimeout(() => {
                            setChangeShuffle(true)
                        }, 1500)
                        let randomTrackIndex = generateRandomIndex()
                        let currentSong = currentPlaylist[randomTrackIndex]
                        updateIndex(randomTrackIndex)
                        setCurrentTrack(currentSong)
                        setShowLyrics(false)
                        if (!currentSong.isDownload) {
                            if (currentPlaylist[randomTrackIndex].lyrics) {
                                let lyrics = LRC.parse(currentPlaylist[randomTrackIndex].lyrics)
                                setSongLyrics(lyrics.lines)
                            }
                            let reqObj = {
                                song_id: currentSong.id,
                                user_id: userData.id,
                                artist_id: currentSong.artistDetails.id
                            }
                            await apiHandler.storeSongPlayedByDate(token, reqObj)
                        }
                        await TrackPlayer.skip(randomTrackIndex)
                        if (isPlaying) {
                            await TrackPlayer.play()
                        }
                        setIsLoading(false)
                    }
                }
            }
        }
        else if (event.type == Event.RemoteDuck) {
            if (event.paused == true) {
                await TrackPlayer.pause()
                setIsPlaying(false)
            }
        }
        else if (event.type == Event.RemoteJumpForward) {
            await TrackPlayer.seekTo(await TrackPlayer.getPosition() + 10)
        }
        else if (event.type == Event.RemoteJumpBackward) {
            await TrackPlayer.seekTo(await TrackPlayer.getPosition() - 10)
        }
    })

    const updateAdvertisement = async () => {
        if (count == 8 && advertisement.length > 0) {
            // await TrackPlayer.pause()
            setIsPlaying(false)
            // setCount(0)
            let randomNumber = Math.floor(Math.random() * (advertisement.length - 1))
            setCurrentAdvertisement(advertisement[randomNumber])
            setShowAdvertisementModal(true)
        }
        if (showAdvertisementModal) {
            setTimeout(() => {
                if (adTime > 0) {
                    setAdTime(adTime - 1)
                }
                else {
                    setAdTime(0)
                }
            }, 1000)
        }
    }

    //This code is to get dynamic background color. Run npm-install-image-colors to use this.
    // const getImageBackground = async (uri) => {
    //     ImageColors.getColors(uri, {
    //     }).then((result) => {
    //         // setImageColor(result.vibrant)
    //         // setBackgroundColor(result.lightVibrant)
    //     })
    // }

    const initializeTrackDetails = () => {
        if (!isVideo) {
            setIsLoading(true)
            let ads = []
            ads = advertisements.filter(item => {
                return item.banner_type == 's'
            })
            setAdvertisement(ads)
            if (playCount == 1) {
                TrackPlayer.reset().then(() => {
                    TrackPlayer.add(currentPlaylist).then(() => {
                        TrackPlayer.skip(currentIndex).then(res => {
                            setIsPlaying(true)
                            setIsLoading(false)
                            setCurrentTrack(currentPlaylist[currentIndex])
                            if (!currentTrack.isPodcast && currentPlaylist[currentIndex].lyrics) {
                                let lyrics = LRC.parse(currentPlaylist[currentIndex].lyrics)
                                setSongLyrics(lyrics.lines)
                            }
                        })
                    })
                })
            }
            else {
                setIsLoading(false)
                setShowLyrics(false)
                setCurrentTrack(currentPlaylist[currentIndex])
            }
            // if (!currentTrack.isPodcast && currentPlaylist[currentIndex].lyrics) {
            //     let lyrics = LRC.parse(currentPlaylist[currentIndex].lyrics)
            //     setSongLyrics(lyrics.lines)
            // }
            console.log('Play count is', playCount)
            console.log('Is playing variable is', isPlaying)
            if (playCount == 1 && isPlaying) {
                TrackPlayer.play().then(() => {
                    console.log('Played')
                    setIsPlaying(true)
                })
            }
            if (!isMinimized && !currentPlaylist[currentIndex].isDownload) {
                // let reqObj = {
                //     song_id: currentPlaylist[currentIndex].id,
                //     user_id: userData.id,
                //     artist_id: currentPlaylist[currentIndex].artistDetails.id
                // }
                // console.log('This is the reqObj', reqObj)
                // apiHandler.storeSongPlayedByDate(token, reqObj)
            }
        }
        else {
            TrackPlayer.stop().then(() => {
                setIsPlaying(true)
            })
        }
    }

    const generateRandomIndex = () => {
        return Math.floor(Math.random() * ((currentPlaylist.length - 1) - 0 + 1) + 0)
    }

    const minimizePlayerView = () => {
        if (!isVideo) {
            changePlayerState(true)
        }
        navigation.goBack()
    }

    const getAutomixVolume = () => {
        if (automix) {
            let difference = duration - position
            if (difference <= 10 && position != 0) {
                let volume = 1 - ((11 - difference) * 0.1)
                if (volume > 0) {
                    TrackPlayer.setVolume(volume).then(() => {
                        console.log('Set Volume')
                    })
                }
            }
            else {
                TrackPlayer.setVolume(1).then(() => {
                    console.log('Volume is set')
                })
            }
        }
    }

    const playPauseMusic = async () => {
        if (isVideo) {
            setIsPlaying(!isPlaying)
        }
        else {
            if (isPlaying == true) {
                setIsPlaying(false)
                await TrackPlayer.pause()
            }
            else {
                setIsPlaying(true)
                await TrackPlayer.play()
            }
        }
    }

    const getTimeFromSeconds = (time) => {
        const h = Math.floor(time / 3600);
        const m = Math.floor((time % 3600) / 60);
        const s = Math.floor((time % 3600) % 60);
        const hrs = h > 0 ? (h < 10 ? `0${h}:` : `${h}:`) : '';
        const mins = m > 0 ? (m < 10 ? `0${m}:` : `${m}:`) : '00:';
        const scnds = s > 0 ? (s < 10 ? `0${s}` : s) : '00';
        return `${hrs}${mins}${scnds}`;
    }

    const showHideExpandedLyricsView = () => {
        setShowExpandedLyricsView(!showExpandedLyricsView)
    }

    const onIconPress = async (title) => {
        switch (title) {
            case 'Shuffle':
                dispatch(toggleShuffle(!isShuffle))
                setChangeShuffle(!changeShuffle)
                break;
            case 'Previous':
                isShuffle ?
                    getRandomTrack()
                    : (position == 0 ?
                        getTrack('previous')
                        :
                        await TrackPlayer.seekTo(0)
                    )
                break;
            case 'Play':
                playPauseMusic()
                break;
            case 'Next':
                isShuffle ?
                    getRandomTrack()
                    : getTrack('next')
                break;
            case 'Repeat':
                switch (repeatMode) {
                    case RepeatMode.Off:
                        dispatch(changeRepeatMode(RepeatMode.Queue))
                        TrackPlayer.setRepeatMode(RepeatMode.Queue)
                        break;
                    case RepeatMode.Queue:
                        dispatch(changeRepeatMode(RepeatMode.Track))
                        TrackPlayer.setRepeatMode(RepeatMode.Track)
                        break;
                    case RepeatMode.Track:
                        dispatch(changeRepeatMode(RepeatMode.Off))
                        TrackPlayer.setRepeatMode(RepeatMode.Off)
                        break;
                }
                break;
            default:
                break;
        }
    }

    const onPodcastIconPress = async (title) => {
        switch (title) {
            case 'Shuffle':
                dispatch(toggleShuffle(!isShuffle))
                setChangeShuffle(!changeShuffle)
                break;
            case 'Previous':
                changePodcastTime('Back')
                break;
            case 'Play':
                playPauseMusic()
                break;
            case 'Next':
                changePodcastTime('Next')
                break;
            case 'Repeat':
                switch (repeatMode) {
                    case RepeatMode.Off:
                        dispatch(changeRepeatMode(RepeatMode.Queue))
                        TrackPlayer.setRepeatMode(RepeatMode.Queue)
                        break;
                    case RepeatMode.Queue:
                        dispatch(changeRepeatMode(RepeatMode.Track))
                        TrackPlayer.setRepeatMode(RepeatMode.Track)
                        break;
                    case RepeatMode.Track:
                        dispatch(changeRepeatMode(RepeatMode.Off))
                        TrackPlayer.setRepeatMode(RepeatMode.Off)
                        break;
                }
                break;
            default:
                break;
        }
    }

    const changePodcastTime = async (title) => {
        switch (title) {
            case 'Next':
                const nextPosition = position + 15
                if (nextPosition > duration) {
                    if (currentIndex < currentPlaylist.length - 1) {
                        await TrackPlayer.skip(currentIndex + 1)
                        updateIndex(currentIndex + 1)
                    }
                    else {
                        ToastAndroid.show('This is the last episode', 700)
                    }
                }
                else {
                    await TrackPlayer.seekTo(nextPosition)
                }
                break;
            case 'Back':
                if (position > 15) {
                    await TrackPlayer.seekTo(position - 15)
                }
                else {
                    if (currentIndex > 0) {
                        await TrackPlayer.skip(currentIndex - 1)
                        updateIndex(currentIndex - 1)
                    }
                    else {
                        await TrackPlayer.seekTo(0)
                    }
                }
                break;
            default:
                break;
        }
    }

    const getRandomTrack = async () => {
        console.log('In shuffle')
        setIsLoading(true)
        // setHardTrackChange(true)
        setTimeout(() => {
            setHardTrackChange(false)
        }, 2000)
        setChangeShuffle(false)
        setTimeout(() => {
            setChangeShuffle(true)
        }, 1500)
        let randomTrackIndex = generateRandomIndex()
        let currentSong = currentPlaylist[randomTrackIndex]
        updateIndex(randomTrackIndex)
        setCurrentTrack(currentPlaylist[randomTrackIndex])
        setShowLyrics(false)
        if (currentSong.lyrics) {
            let lyrics = LRC.parse(currentSong.lyrics)
            setSongLyrics(lyrics.lines)
        }
        if (!currentPlaylist[randomTrackIndex].isDownload) {
            let reqObj = {
                song_id: currentPlaylist[randomTrackIndex].id,
                user_id: userData.id,
                artist_id: currentPlaylist[randomTrackIndex].artistDetails.id
            }
            await apiHandler.storeSongPlayedByDate(token, reqObj)
        }
        await TrackPlayer.skip(randomTrackIndex)
        setIsLoading(false)
    }

    const getTrack = async (title) => {
        setIsLoading(true)
        if (isVideo) {
            let index = videoIndex
            if (title == 'next') {
                if (index < currentPlaylist.length - 1) {
                    setVideoIndex(index + 1)
                }
                else {
                    ToastAndroid.show('No further videos in Queue', 700)
                }
            }
            else {
                if (index != 0) {
                    setVideoIndex(index - 1)
                }
                else {
                    ToastAndroid.show('No further videos in Queue', 700)
                }
            }
        }
        else {
            setShowLyrics(false)
            // setHardTrackChange(true)
            setTimeout(() => {
                setHardTrackChange(false)
            }, 2000)
            if (title == 'next') {
                const newIndex = await TrackPlayer.getCurrentTrack()
                if (!isShuffle && newIndex < currentPlaylist.length - 1) {
                    await TrackPlayer.pause()
                    let songsCount = count
                    songsCount++
                    setCount(songsCount)
                    let currentSong = currentPlaylist[newIndex + 1]
                    if (currentSong.lyrics) {
                        let lyrics = LRC.parse(currentSong.lyrics)
                        setSongLyrics(lyrics.lines)
                    }
                    updateIndex(newIndex + 1)
                    setCurrentTrack(currentPlaylist[newIndex + 1])
                    if (!currentPlaylist[newIndex + 1].isDownload) {
                        let reqObj = {
                            song_id: currentPlaylist[newIndex + 1].id,
                            user_id: userData.id,
                            artist_id: currentPlaylist[newIndex + 1].artistDetails.id
                        }
                        await apiHandler.storeSongPlayedByDate(token, reqObj)
                    }
                    setChangeShuffle(true)
                    setTimeout(() => {
                        setChangeShuffle(false)
                    }, 2000)
                    await TrackPlayer.skipToNext()
                    if (isPlaying) {
                        await TrackPlayer.play()
                    }
                }
                else {
                    ToastAndroid.show('No further songs in queue', 700)
                }
            }
            else {
                const newIndex = await TrackPlayer.getCurrentTrack()
                if (newIndex > 0) {
                    await TrackPlayer.pause()
                    let songsCount = count
                    songsCount++
                    setCount(songsCount)
                    let currentSong = currentPlaylist[newIndex - 1]
                    if (currentSong.lyrics) {
                        let lyrics = LRC.parse(currentSong.lyrics)
                        setSongLyrics(lyrics.lines)
                    }
                    setCurrentTrack(currentPlaylist[newIndex - 1])
                    if (!currentPlaylist[newIndex - 1].isDownload) {
                        let reqObj = {
                            song_id: currentPlaylist[newIndex - 1].id,
                            user_id: userData.id,
                            artist_id: currentPlaylist[newIndex - 1].artistDetails.id
                        }
                        await apiHandler.storeSongPlayedByDate(token, reqObj)
                    }
                    updateIndex(newIndex - 1)
                    setChangeShuffle(true)
                    setTimeout(() => {
                        setChangeShuffle(false)
                    }, 2000)
                    await TrackPlayer.skipToPrevious()
                    if (isPlaying) {
                        await TrackPlayer.play()
                    }
                }
                else {
                    ToastAndroid.show('No previous songs in queue', 700)
                }
            }
        }
        setIsLoading(false)
    }

    const onLikePress = async () => {
        if (currentTrack.isPodcast) {
            dispatch(likeUnlikePodcast(currentTrack.id))
            if (!likedPodcasts.includes(currentTrack.id)) {
                let reqObj = {
                    userID: userData.id,
                    podcastID: currentTrack.id
                }
                setShowLikeModal(true)
                setTimeout(() => {
                    setShowLikeModal(false)
                }, 1000);
                await apiHandler.likePodcast(token, reqObj)
            }
            else {
                let reqObj = {
                    userID: userData.id,
                    podcastID: currentTrack.id
                }
                await apiHandler.unlikePodcast(token, reqObj)
            }
        }
        else {
            likeUnlikeSong(currentTrack.id)
            if (!likedSongs.includes(currentTrack.id)) {
                let reqObj = {
                    userID: userData.id,
                    songID: currentTrack.id
                }
                setShowLikeModal(true)
                setTimeout(() => {
                    setShowLikeModal(false)
                }, 1000);
                await apiHandler.saveLikedSong(token, reqObj)
            }
            else {
                let reqObj = {
                    userID: userData.id,
                    songID: currentTrack.id
                }
                await apiHandler.unlikeSong(token, reqObj)
            }
        }
    }

    const setTrackProgress = async (value) => {
        if (isVideo) {
            videoPlayer.current.seek(value)
        }
        else {
            await TrackPlayer.seekTo(value)
        }
    }

    const onShowOptionsPress = () => {
        setDownloadSongID(currentTrack.id)
        setShowOptions(!showOptions)
    }

    const onModalIconPress = async (id) => {
        switch (id) {
            case 0:
                setShowOptions(false)
                onLikePress()
                break;
            case 1:
                setShowOptions(false)
                Share.share({
                    message: 'Share ' + currentTrack.title,
                    url: 'http://bam.tech',
                    title: 'Share songs via Afro Melodies'
                }, {
                    // Android only:
                    dialogTitle: 'Share BAM goodness',
                    // iOS only:
                    excludedActivityTypes: [
                        'com.apple.UIKit.activity.PostToTwitter'
                    ]
                })
                break;
            case 2:
                setShowOptions(false)
                let playlists = await apiHandler.getAllPlaylists(token, userData.id)
                setUserPlaylists(playlists)
                setShowPlaylists(true)
                break;
            case 3:
                setDownloadSongID(currentTrack.id)
                break;
            case 4:
                setShowOptions(false)
                navigation.navigate(navigationStrings.SongsList, { data: currentTrack && currentTrack.artistDetails, songListType: eSongListType.Artist })
                break;
            default:
                break;
        }
    }

    const showHideDeleteConfirmationModal = () => {
        setShowDeleteConfirmationModal(!showDeleteConfirmationModal)
    }

    const onDeletePress = () => {
        RNFetchBlob.fs.unlink(downloadsPath + currentTrack.title + '.mp3').then((res) => {
            setShowDeleteConfirmationModal(false)
            let downloadedSong = {
                id: currentTrack.id,
                url: downloadsPath + currentTrack.title,
                type: 'default',
                name: currentTrack.title,
                album: 'My Album',
                artist: 'Dummy artist',
                artswork: imagePath.dummySong,
                image: imagePath.dummySong,
            }
            dispatch(removeDownloadedSong(downloadedSong))
        })
    }

    const onSkipPress = async () => {
        await TrackPlayer.play()
        setIsPlaying(true)
        setCount(0)
        setShowAdvertisementModal(false)
    }

    const showHideLyrics = () => {
        setShowExpandedLyricsView(false)
        songLyrics && songLyrics.length > 0 ?
            setShowLyrics(!showLyrics)
            :
            ToastAndroid.show('No lyrics available for this song', 800)
    }

    const showHidePlaylistModal = () => {
        setShowPlaylists(!showPlaylists)
    }

    const onSingleAdvertisementPress = async () => {
        setCount(0)
        setShowAdvertisementModal(false)
        let reqObj = {
            user_id: userData.id,
            ad_id: currentAdvertisement.id
        }
        await apiHandler.storeAdvertisementData(token, reqObj)
        navigation.navigate(navigationStrings.AppWebView, { source: currentAdvertisement.url })
    }

    const onPlaylistSelect = async (item) => {
        setShowPlaylists(false)
        setIsLoading(true)
        let reqObj = {
            user_id: userData.id,
            playlistID: item.id,
            songID: currentTrack.id
        }
        const res = await apiHandler.addSongToPlaylist(token, reqObj)
        ToastAndroid.show(res.Message, 700)
        setIsLoading(false)
    }

    const handleGesture = (nativeEvent) => {
        if (nativeEvent.state == 5) {
            if (nativeEvent.translationX < 10) {
                isShuffle ? getRandomTrack()
                    : getTrack('next')
            }
            else if (nativeEvent.translationX > 10) {
                isShuffle ? getRandomTrack()
                    : getTrack('previous')
            }
        }
    }

    const renderLeftIcon = () => {
        return <AntDesign name='down' onPress={minimizePlayerView} style={{ fontSize: 25, color: colors.white }} />
    }

    const renderSingleRow = ({ item, index }) => {
        return <Text style={commonStyles.textWhiteNormal(30, { color: position >= item.time ? colors.green : colors.black })}>
            {item.text}
        </Text>
    }

    const scrollLyrics = (index) => {
        lyricsScrollRef?.current?.scrollTo({ x: 0, y: 60 * index, animated: true })
    }

    const getVideoDuration = (data) => {
        setIsVideoLoading(false)
        setVideoDuration(data.duration)
    }

    const handleVideoProgress = (data) => {
        setVideoProgress(data.currentTime)
    }

    const onVideoEnd = () => {
        repeatMode != RepeatMode.Track &&
            getTrack('next')
    }

    const crossfadeEffect = () => {
        if (crossfade > 0 && playCount != 1 && currentIndex != currentPlaylist.length - 1) {
            let nextTrackDetails = currentPlaylist[currentIndex + 1]
            setNextTrack(nextTrackDetails)
        }
    }

    const leftDuration = Math.round(duration - position)
    const crossfadeStart = (crossfade > 0 && leftDuration < crossfade)
    // const translation = useRef(new Animated.Value(1)).current;
    // useEffect(() => {
    //     Animated.timing(translation, {
    //         toValue: 100,
    //         duration: 10000,
    //         useNativeDriver: false,
    //     }).start();
    // }, []);

    const [bgImagePath, setBgImagePath] = useState()

    const onVideoSettingsIconPress = () => {
        console.log('Settings icon pressed')
    }

    console.log('This is the song', count)

    return (isMinimized ?
        <Pressable onPress={() => { changePlayerState(false) }} style={styles.miniPlayerFullContainer}>
            <Image style={styles.miniPlayerImage} source={(currentTrack.isDownload || dataSaver) ? imagePath.dummyArtist : currentTrack && currentTrack.image ? currentTrack.image !== SONGS_IMAGE_BASE_URL ? { uri: currentTrack && currentTrack.image } : imagePath.dummySong : null} />
            <View style={styles.miniPlayerInnerContainer}>
                <TextTicker
                    style={styles.songTitleText}
                    duration={8000}
                    loop
                    bounce={false}
                    repeatSpacer={50}
                >
                    {currentTrack && currentTrack.title}
                </TextTicker>
                <Text style={commonStyles.textLightNormal(14)}>
                    {currentTrack && currentTrack.artist}
                </Text>
            </View>
            <View style={commonStyles.flexRow_CenterItems}>
                <Ionicons onPress={playPauseMusic} name={(playerState === State.Playing) ? 'pause' : 'play'} color={colors.white} style={styles.miniPlayerPlayPauseIcon} />
                {!currentTrack.isDownload && <FontAwesome name={(!currentTrack.isPodcast && likedSongs && likedSongs.includes(currentTrack.id)) || (currentTrack.isPodcast && likedPodcasts && likedPodcasts.includes(currentTrack.id)) ? 'heart' : 'heart-o'} onPress={onLikePress} style={{ fontSize: 25, color: (!currentTrack.isPodcast && likedSongs && !likedSongs.includes(currentTrack.id)) || (currentTrack.isPodcast && likedPodcasts && !likedPodcasts.includes(currentTrack.id)) ? colors.white : colors.green }} />}
            </View>
        </Pressable>
        :
        isLoading ? <LoadingComponent isVisible={isLoading} />
            :
            <View style={styles.playerFullContainer}>
                {!isVideo &&
                    <Image source={(currentTrack.isDownload || dataSaver) ? bgImagePath : { uri: crossfadeStart ? nextTrack.image : currentTrack.image }} style={styles.backgroundImage} blurRadius={12} />
                }
                <MainHeader1 leftIcon={renderLeftIcon} headerPrimaryTitle={currentTrack.isPodcast ? 'Playing from podcast' : 'Playing from '} headerSecondaryTitle={header || 'NEW'} />
                <ScrollView>
                    {isVideo ?
                        (!isVideoLoading ?
                            <Video
                                source={{ uri: currentTrack && currentTrack.videoURL }}
                                ref={(ref) => {
                                    videoPlayer.current = ref
                                }}
                                resizeMode='stretch'
                                onLoadStart={() => {
                                    // setIsVideoLoading(true)
                                }}
                                onLoad={getVideoDuration}
                                onProgress={handleVideoProgress}
                                onBuffer={() => { setIsVideoLoading(true) }}
                                paused={!isPlaying}
                                onEnd={onVideoEnd}
                                repeat={repeatMode == RepeatMode.Track && true}
                                selectedVideoTrack={{
                                    type: "resolution",
                                    value: 240
                                }}
                                style={styles.videoContainer}
                            />
                            :
                            <View style={styles.videoContainer}>
                                <ActivityIndicator size={'small'} color={colors.white} />
                            </View>
                        )
                        :
                        showLyrics ?
                            <View style={styles.lyricsFullContainer}>
                                <View style={styles.lyricsTopContainer}>
                                    <Text style={commonStyles.textWhiteBold(24, { color: colors.black })}>
                                        Lyrics
                                    </Text>
                                    <View style={{ height: 30, width: 30, borderRadius: 15, backgroundColor: `${colors.black}aa`, alignItems: 'center', justifyContent: 'center' }}>
                                        <MaterialCommunityIcons name='arrow-expand' onPress={showHideExpandedLyricsView} style={{ fontSize: 24 }} color={colors.white} />
                                    </View>
                                    {/* <EvilIcons name='close' onPress={showHideLyrics} style={styles.closeLyricsModalIcon} /> */}
                                </View>
                                <View style={styles.lyricsInnerContainer}>
                                    {
                                        <ScrollView ref={lyricsScrollRef} showsVerticalScrollIndicator={false} >
                                            {songLyrics.map((item, index) => {
                                                if (position >= item.time) {
                                                    scrollLyrics(index)
                                                }
                                                return <Text style={commonStyles.textWhiteNormal(30, { color: position >= item.time ? colors.white : colors.black, fontFamily: position >= item.time ? 'brandon-bold' : 'brandon-regular' })}>
                                                    {item.text}
                                                </Text>
                                            })}
                                        </ScrollView>
                                    }
                                </View>
                            </View>
                            :
                            <PanGestureHandler onHandlerStateChange={(evt) => { handleGesture(evt.nativeEvent) }}>
                                <Image style={styles.songCoverImage} source={currentTrack && currentTrack.image ? (currentTrack.isDownload || dataSaver) ? imagePath.dummyArtist : currentTrack.image !== SONGS_IMAGE_BASE_URL ? { uri: crossfadeStart ? nextTrack.image : currentTrack && currentTrack.image } : imagePath.dummySong : null} />
                            </PanGestureHandler>
                    }
                    <View style={styles.songTimingDetailsContainer}>
                        <View style={styles.songDetailsInnerContainer}>
                            <TextTicker
                                style={styles.songTitleText}
                                duration={8000}
                                loop
                                bounce={false}
                                repeatSpacer={50}
                            >
                                {crossfadeStart ? nextTrack.title : currentTrack && currentTrack.title}
                            </TextTicker>
                        </View>
                        {!currentTrack.isDownload && <View style={styles.songIconsContainer}>
                            <FontAwesome name={(!currentTrack.isPodcast && likedSongs && likedSongs.includes(currentTrack.id)) || (currentTrack.isPodcast && likedPodcasts && likedPodcasts.includes(currentTrack.id)) ? 'heart' : 'heart-o'} onPress={onLikePress} style={{ fontSize: 20, color: (!currentTrack.isPodcast && likedSongs && likedSongs.includes(currentTrack.id)) || (currentTrack.isPodcast && likedPodcasts && likedPodcasts.includes(currentTrack.id)) ? colors.green : colors.white }} />
                            {!isVideo && <Entypo name='dots-three-vertical' style={styles.showOptionsIcon} onPress={onShowOptionsPress} />
                                // :
                                // null
                                // <Fontisto name='player-settings' style={styles.videoSettingsIcon} onPress={onVideoSettingsIconPress} />
                            }
                        </View>}
                    </View>
                    <Text style={commonStyles.textLightNormal(18, { marginTop: 5, alignSelf: 'flex-start' })}>
                        {currentTrack.isPodcast ? header : crossfadeStart ? nextTrack && nextTrack.artist && nextTrack.artist.name : currentTrack && currentTrack.artist}
                    </Text>
                    <TouchableOpacity activeOpacity={1} onPress={async (event) => {
                        let progressedValue = (event.nativeEvent.locationX) - 15
                        let totalValue = windowWidth - 30
                        if (isVideo) {
                            let videoSeekDuration = (progressedValue / totalValue) * videoDuration
                            videoPlayer.current.seek(videoSeekDuration)
                        }
                        else {
                            let seekDuration = (progressedValue / totalValue) * duration
                            await TrackPlayer.seekTo(seekDuration)
                        }
                    }}>
                        <Slider
                            value={isVideo ? videoProgress : position}
                            onValueChange={value => setTrackProgress(value)}
                            maximumTrackTintColor={colors.lightGrey}
                            minimumTrackTintColor={colors.white}
                            tapToSeek={true}
                            style={styles.trackPlayerContainer}
                            trackStyle={styles.trackStyle}
                            thumbStyle={styles.thumbMoverStyle}
                            maximumValue={isVideo ? videoDuration : duration} />
                    </TouchableOpacity>
                    <View style={styles.songTimingDetailsContainer}>
                        <Text style={commonStyles.textWhiteNormal(12)}>
                            {getTimeFromSeconds(isVideo ? videoProgress : position)}
                        </Text>
                        <Text style={commonStyles.textWhiteNormal(12)}>
                            {getTimeFromSeconds(isVideo ? videoDuration : duration)}
                        </Text>
                    </View>
                    {!currentTrack.isPodcast ? <View style={styles.fullIconContainer}>
                        {playOptions.map((item, iconIndex) => {
                            return <TouchableOpacity key={iconIndex} onPress={() => {
                                onIconPress(item.title)
                            }} style={iconIndex == 2 ? styles.iconBackGround : {}}>
                                <Ionicons name={iconIndex == 2 && (!isVideo && (playerState === State.Playing) || isVideo && isPlaying) ? 'pause' : item.iconName} color={(item.id == 0 && isShuffle || item.id == 4 && repeatMode && repeatMode != RepeatMode.Off) ? colors.green : iconIndex == 2 ? colors.black : colors.white} style={styles.iconStyle(item.id)} />
                                {item.id == 4 && <Text style={commonStyles.textWhiteNormal(10, { color: colors.green, position: 'absolute', top: -2, right: -1 })}>{repeatMode == RepeatMode.Queue ? 'Q' : repeatMode == RepeatMode.Track ? '1' : null}</Text>}
                            </TouchableOpacity>
                        })}
                    </View>
                        :
                        <View style={styles.podcastsIconsFullContainer}>
                            {podcastOptions.map((item, iconIndex) => {
                                return <TouchableOpacity key={iconIndex} onPress={() => {
                                    onPodcastIconPress(item.title)
                                }} style={iconIndex == 1 ? styles.iconBackGround : {}}>
                                    <Ionicons name={iconIndex == 1 && (playerState === State.Playing) ? 'pause' : item.iconName} color={(item.id == 0 && isShuffle || item.id == 4 && repeatMode != RepeatMode.Off) ? colors.green : iconIndex == 1 ? colors.black : colors.white} style={styles.iconStyle(item.id)} />
                                    {(item.id == 1 || item.id == 3) && <Text style={commonStyles.textWhiteNormal(12, { position: 'absolute', bottom: 4, right: 12 })}>15</Text>}
                                    {item.id == 4 && <Text style={commonStyles.textWhiteNormal(10, { color: colors.green, position: 'absolute', top: -2, right: -1 })}>{repeatMode == RepeatMode.Queue ? 'Q' : repeatMode == RepeatMode.Track ? '1' : null}</Text>}
                                </TouchableOpacity>
                            })}
                        </View>
                    }
                    {!currentTrack.isPodcast && !isVideo && !currentTrack.isDownload &&
                        <Animated.View
                            style={{
                                opacity: songLyrics && songLyrics.length > 0 ? fadeAnim : 1
                            }}
                        >
                            <Feather name='list' onPress={showHideLyrics} style={{ fontSize: 20, alignSelf: 'flex-end', marginTop: 40, color: songLyrics && songLyrics.length > 0 ? colors.green : colors.white }} />
                        </Animated.View>}
                </ScrollView>
                <Modal transparent={true} onRequestClose={showHideExpandedLyricsView} visible={showExpandedLyricsView}>
                    <View style={styles.expandedLyricsModalFullContainer}>
                        <View style={styles.expandedLyricsModalInnerContainer}>
                            <View style={styles.expandedLyricsModalTopContainer}>
                                <Text style={commonStyles.textWhiteBold(24, { color: colors.black })}>
                                    Lyrics
                                </Text>
                                <View style={{ height: 30, width: 30, borderRadius: 15, backgroundColor: `${colors.black}aa`, alignItems: 'center', justifyContent: 'center' }}>
                                    <Feather name='minimize-2' onPress={showHideExpandedLyricsView} style={{ color: colors.white, fontSize: 24 }} />
                                </View>
                                {/* <EvilIcons name='close' onPress={showHideLyrics} style={styles.closeLyricsModalIcon} /> */}
                            </View>
                            <View style={styles.lyricsInnerContainer}>
                                {
                                    <ScrollView ref={lyricsScrollRef} showsVerticalScrollIndicator={false} >
                                        {songLyrics.map((item, index) => {
                                            if (position >= item.time) {
                                                scrollLyrics(index)
                                            }
                                            return <Text style={commonStyles.textWhiteNormal(30, { color: position >= item.time ? colors.white : colors.black, fontFamily: position >= item.time ? 'brandon-bold' : 'brandon-regular' })}>
                                                {item.text}
                                            </Text>
                                        })}
                                    </ScrollView>
                                }
                            </View>
                            <Slider
                                value={isVideo ? videoProgress : position}
                                onValueChange={value => setTrackProgress(value)}
                                maximumTrackTintColor={colors.lightGrey}
                                minimumTrackTintColor={colors.white}
                                tapToSeek={true}
                                style={styles.expandedLyricsModalSliderContainer}
                                trackStyle={styles.trackStyle}
                                thumbStyle={styles.thumbMoverStyle}
                                maximumValue={isVideo ? videoDuration : duration} />
                            <TouchableOpacity onPress={playPauseMusic} style={styles.expandedLyricsModalIconContainer}>
                                <Ionicons name={(playerState === State.Playing) ? 'pause' : 'play'} color={colors.black} style={{ fontSize: 35 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal transparent={true} visible={showLikeModal}>
                    <View style={styles.likeModalContainer}>
                        <View style={styles.likeModalInnerContainer}>
                            <FontAwesome name='heart' size={250} color={colors.green} />
                        </View>
                    </View>
                </Modal>
                <DeleteItemModal info={`Are you sure you want to delete ${currentTrack && currentTrack.title} from downloads?`} buttonText='Confirm' isVisible={showDeleteConfirmationModal} showHideDeleteConfirmationModal={showHideDeleteConfirmationModal} onDeletePress={onDeletePress} />
                <OptionsModal isPodcast={currentTrack && currentTrack.isPodcast} downloadSongId={downloadSongID} isLiked={currentTrack && (currentTrack.isPodcast && likedPodcasts.includes(currentTrack.id)) || (!currentTrack.isPodcast && likedSongs.includes(currentTrack.id))} songDetails={currentTrack && currentTrack} isVisible={showOptions} closeModal={onShowOptionsPress} setShowDeleteConfirmationModal={showHideDeleteConfirmationModal} onSingleIconPress={(id) => { onModalIconPress(id) }} />
                <Modal visible={showAdvertisementModal} onRequestClose={() => {
                    setShowAdvertisementModal(false)
                }}>
                    <Pressable onPress={onSingleAdvertisementPress} style={styles.likeModalContainer}>
                        {currentAdvertisement.type == 'image' ?
                            <ImageBackground source={{ uri: 'https://api.afromelodiez.com/storage/ad/' + currentAdvertisement.attachment }} style={styles.screenContainer}>
                                <View style={styles.buttonsFullContainer}>
                                    <View style={styles.adButtonContainer}>
                                        <Text style={commonStyles.textWhiteNormal(10)}>
                                            AD
                                        </Text>
                                    </View>
                                    <TouchableOpacity style={styles.skipButtonContainer} disabled={adTime > 0} onPress={onSkipPress}>
                                        <Text style={commonStyles.textWhiteNormal(10)}>
                                            {adTime > 0 ? adTime + 's Skip' : 'Skip Now'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </ImageBackground>
                            :
                            <View style={commonStyles.flexFull}>
                                <View style={[styles.buttonsFullContainer, { zIndex: 5 }]}>
                                    <View style={styles.adButtonContainer}>
                                        <Text style={commonStyles.textWhiteNormal(10)}>
                                            AD
                                        </Text>
                                    </View>
                                    <TouchableOpacity style={styles.skipButtonContainer} disabled={adTime > 0} onPress={onSkipPress}>
                                        <Text style={commonStyles.textWhiteNormal(10)}>
                                            {adTime > 0 ? adTime + 's Skip' : 'Skip Now'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <Video
                                    source={{ uri: 'https://api.afromelodiez.com/storage/ad/' + currentAdvertisement.attachment }}
                                    resizeMode='stretch'
                                    muted={true}
                                    onLoadStart={() => {
                                        // setIsVideoLoading(true)
                                    }}
                                    onEnd={() => setShowAdvertisementModal(false)}
                                    selectedVideoTrack={{
                                        type: "resolution",
                                        value: 240
                                    }}
                                    style={{ flex: 1, zIndex: -1 }}
                                />
                            </View>
                        }
                    </Pressable>
                </Modal>
                <Modal transparent={true} visible={showPlaylists} onRequestClose={showHidePlaylistModal}>
                    <View style={styles.playlistModalContainer}>
                        <Ionicons name='arrow-back' onPress={showHidePlaylistModal} style={{ fontSize: 30, color: colors.white }} />
                        <Text style={commonStyles.textWhiteBold(24, { alignSelf: 'center' })}>
                            Your playlists
                        </Text>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {
                                userPlaylists.map((item, index) => {
                                    return <TouchableOpacity onPress={() => { onPlaylistSelect(item) }} style={styles.singlePlaylistContainer}>
                                        <Text style={commonStyles.textWhiteBold(14)}>
                                            {item.playlist_name}
                                        </Text>
                                    </TouchableOpacity>
                                })
                            }
                        </ScrollView>
                    </View>
                </Modal>
            </View >
    )
}

const styles = StyleSheet.create({
    songCoverImage: { width: windowWidth - 30, marginVertical: 25, height: windowHeight * 0.44, resizeMode: 'stretch' },
    fullContainer: { flex: 1, width: windowWidth - 30, alignItems: 'center' },
    fullIconContainer: { marginTop: 10, width: windowWidth - 30, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    iconBackGround: { height: 60, width: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white },
    iconStyle: (id) => {
        return { fontSize: 35 }
    },
    songTimingDetailsContainer: { width: windowWidth - 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    likeModalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0)' },
    likeModalInnerContainer: { height: windowHeight * 0.6, width: windowWidth, alignItems: 'center', justifyContent: 'flex-start', marginTop: 50 },
    trackPlayerContainer: { marginTop: 5, alignSelf: 'flex-start', justifyContent: 'center', width: windowWidth - 30 },
    trackStyle: {
        height: 4,
    },
    thumbMoverStyle: {
        width: 8,
        height: 8,
        backgroundColor: colors.white,
        borderRadius: 4,
    },
    bottomIconsContainer: { width: windowWidth - 35, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 40 },
    singleBottomIcon: { fontSize: 20, color: colors.white },
    screenContainer: { flex: 1, resizeMode: 'stretch' },
    buttonsFullContainer: { flexDirection: 'row', width: windowWidth, paddingHorizontal: 20, paddingVertical: 10, minHeight: 50, justifyContent: 'space-between' },
    adButtonContainer: { backgroundColor: colors.green, paddingVertical: 8, justifyContent: 'center', paddingHorizontal: 4, borderRadius: 4 },
    skipButtonContainer: { width: 80, backgroundColor: colors.black, opacity: 0.5, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    filterBarFullContainer: { padding: 8, flexDirection: 'row', width: windowWidth - 80, alignSelf: 'center', borderRadius: 12, backgroundColor: colors.white, justifyContent: 'space-between' },
    expandedLyricsModalFullContainer: { height: windowHeight, width: windowWidth },
    expandedLyricsModalInnerContainer: { flex: 1, backgroundColor: `${colors.green}`, alignItems: 'center', padding: 12 },
    expandedLyricsModalTopContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' },
    expandedLyricsModalSliderContainer: { width: windowWidth - 30, alignSelf: 'center' },
    expandedLyricsModalIconContainer: { backgroundColor: `${colors.white}88`, height: 70, width: 70, borderRadius: 35, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    closeLyricsModalIcon: { color: colors.black, fontSize: 30 },
    lyricsModalBottomContainer: { height: windowHeight * 0.3, width: windowWidth, alignSelf: 'center' },
    playlistModalContainer: { flex: 1, padding: 20, backgroundColor: colors.black, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    singlePlaylistContainer: { paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: colors.white, marginTop: 10, justifyContent: 'center', backgroundColor: colors.green, alignItems: 'center' },
    miniPlayerFullContainer: { height: 60, position: 'absolute', bottom: 0, borderRadius: 10, width: windowWidth, alignSelf: 'center', backgroundColor: '#000000c7', zIndex: 2, padding: 8, flexDirection: 'row', alignItems: 'center' },
    miniPlayerImage: { height: 45, width: 45 },
    miniPlayerInnerContainer: { flex: 1, marginLeft: 10 },
    songTitleText: { fontSize: 22, color: colors.white, fontFamily: 'brandon-bold' },
    miniPlayerPlayPauseIcon: { fontSize: 30, marginRight: 15 },
    playerFullContainer: { flex: 1, alignItems: 'center' },
    backgroundImage: { height: windowHeight, width: windowWidth, position: 'absolute', alignSelf: 'center', opacity: 0.4, resizeMode: 'stretch' },
    videoContainer: { width: windowWidth - 30, marginVertical: 25, height: windowHeight * 0.44, borderRadius: 12 },
    lyricsFullContainer: { width: windowWidth - 30, marginVertical: 0, height: (windowHeight * 0.44) + 50, borderRadius: 12, backgroundColor: `${colors.green}cc`, padding: 8 },
    lyricsTopContainer: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' },
    lyricsInnerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    songDetailsInnerContainer: { marginTop: 10, alignItems: 'flex-start', width: windowWidth - 80 },
    songIconsContainer: { flexDirection: 'row', marginTop: 10, alignItems: 'center', width: 80, justifyContent: 'flex-start' },
    showOptionsIcon: { color: colors.white, fontSize: 20, marginLeft: 15 },
    videoSettingsIcon: { color: colors.white, fontSize: 18, marginLeft: 8 },
    podcastsIconsFullContainer: { marginTop: 10, width: windowWidth - 30, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' },






})
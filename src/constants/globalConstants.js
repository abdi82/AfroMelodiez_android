import { Platform, Dimensions, BackHandler } from 'react-native'
import { useEffect } from 'react';

export const currentPlatform = Platform.OS

export const windowHeight = Dimensions.get('window').height
export const windowWidth = Dimensions.get('window').width

export const eSongListType = {
    Playlist: 'Playlist',
    Artist: 'Artist',
    Album: 'Album',
    MixSongs: 'MixSongs',
    Category: 'Category'
}

export const ARTISTS_IMAGE_BASE_URL = 'https://api.afromelodiez.com/storage/artist/'
export const SONGS_IMAGE_BASE_URL = 'https://api.afromelodiez.com/storage/song/images/'
export const SONGS_BASE_URL = 'https://api.afromelodiez.com/storage/song/'
export const VIDEOS_BASE_URL = 'https://api.afromelodiez.com/storage/video/'
export const CATEGORIES_BASE_URL = 'https://api.afromelodiez.com/storage/category/'
export const PODCASTS_IMAGE_BASE_URL = 'https://api.afromelodiez.com/storage/podcast/'
export const PODCASTS_EPISODES_BASE_URL = 'https://api.afromelodiez.com/storage/podcast/episodes/'
export const PODCASTS_EPISODE_IMAGES_BASE_URL = 'https://api.afromelodiez.com/storage/podcast/episodes/images/'
export const FEATURED_PLAYLISTS_BASE_URL = 'https://api.afromelodiez.com/storage/featured/'
export const ALBUMS_BASE_URL = 'https://api.afromelodiez.com/storage/album/'

export const useBackButton = (handler) => {
    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", handler);
        return () => {
            BackHandler.removeEventListener(
                "hardwareBackPress",
                handler
            )
        }
    }, [handler])
}

export const downloadsPath = '/data/user/0/com.music_stream/files/'
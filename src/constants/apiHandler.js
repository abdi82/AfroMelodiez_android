import axios from 'axios';

const BASE_URL = 'https://api.afromelodiez.com/api/'

export const apiHandler = {
    createFormData: (reqObj) => {
        let formData = new FormData()
        for (const property in reqObj) {
            formData.append(property, reqObj[property])
        }
        return formData;
    },
    getPrivacyPolicy: async () => {
        const res = await axios.get(BASE_URL + 'privacy_policy')
        return res.data.data.description
    },
    getTermsAndConditions: async () => {
        const res = await axios.get(BASE_URL + 'terms_conditions')
        return res.data.data.description
    },
    signUp: async (data) => {
        const res = await axios.post(BASE_URL + 'auth/register', data)
        return res;
    },
    login: async (data) => {
        const res = await axios.post(BASE_URL + 'auth/login', data)
        return res;
    },
    socialLogin: async (data) => {
        const res = await axios.post(BASE_URL + 'auth/socialLogin', data)
        return res;
    },
    getUserData: async (token) => {
        const res = await axios.post(BASE_URL + 'auth/me', '', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data;
    },
    getAllLanguages: async (token) => {
        const res = await axios.get(BASE_URL + 'auth/language', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data.data;
    },
    setUserLanguages: async (token, data) => {
        const res = await axios.post(BASE_URL + 'auth/user_to_language', data, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res;
    },
    getUserLanguages: async (token) => {
        const res = await axios.get(BASE_URL + 'auth/get_user_language', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data.data;
    },
    getSongCategories: async (token) => {
        const res = await axios.get(BASE_URL + 'auth/category', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data.data;
    },
    getArtists: async (token, skip) => {
        const res = await axios.get(BASE_URL + 'auth/artist/' + skip, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data.data;
    },
    getSongsByArtist: async (token, artistId) => {
        console.log("These are the props", artistId)
        const res = await axios.get(BASE_URL + 'auth/artist_song_list/' + artistId, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch(err => {
            console.log('Error getting songs by artist', err)
        })
        return res.data;
    },
    getSongsByCategory: async (token, categoryId) => {
        const res = await axios.get(BASE_URL + 'auth/category_song_list/' + categoryId, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data;
    },
    getMixSongs: async (token) => {
        const res = await axios.get(BASE_URL + 'auth/mix_songs', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data.data;
    },
    getMostPlayedSongs: async (token) => {
        const res = await axios.get(BASE_URL + 'auth/most_played_song', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data.data;
    },
    getAdvertisements: async (token) => {
        const res = await axios.get(BASE_URL + 'auth/advertisements', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        console.log('This is the advertisement data', res.data)
        return res.data.data;
    },
    saveUserSettings: async (token, reqObj) => {
        const res = await axios.post(BASE_URL + 'auth/Usersettings_store', reqObj, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res
    },
    getUserSettings: async (token, id) => {
        const res = axios.get(BASE_URL + 'auth/Usersettings_get/' + id, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res;
    },
    saveSongPlayedByDate: async (token, isPodcast) => {
        const res = await axios.post(BASE_URL + 'auth/song_played_date_store', {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res
    },
    getSongsListingByDate: async (token, userID) => {
        const res = await axios.get(BASE_URL + 'auth/song_played_by_date/' + userID, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data;
    },
    saveLikedSong: async (token, reqObj) => {
        const res = await axios.post(BASE_URL + 'auth/user_song_like', reqObj, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data
    },
    unlikeSong: async (token, reqObj) => {
        const res = await axios.post(BASE_URL + 'auth/user_song_unlike', reqObj, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data
    },
    getLikedSongs: async (token, userId) => {
        console.log('ID in liked songs is', userId)
        const res = await axios.get(BASE_URL + 'auth/user_song_like_get/' + userId, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        console.log('These are the liked songs', res.data)
        return res.data.Data
    },
    addNewPlaylist: async (token, reqObj) => {
        const res = await axios.post(BASE_URL + 'auth/user_add_playlist', reqObj, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data
    },
    getAllPlaylists: async (token, userID) => {
        const res = await axios.get(BASE_URL + 'auth/user_playlist_get/' + userID, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data.Data
    },
    addSongToPlaylist: async (token, reqObj) => {
        const res = await axios.post(BASE_URL + 'auth/user_add_song_playlist', reqObj, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data
    },
    getSearchItems: async (token, searchQuery) => {
        const res = await axios.get(BASE_URL + 'auth/contentsearch/' + searchQuery, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data
    },
    getLatestSongs: async (token, skip) => {
        const res = await axios.get(BASE_URL + 'auth/latest_songs/', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data
    },
    storeSongPlayedByDate: async (token, reqObj, isPodcast) => {
        console.log('Song played by date API is to be hit', token, 'and ', reqObj, 'and ', isPodcast)
        let res;
        // if (isPodcast) {
        //     let newReqObj = {
        //         user_id: reqObj.user_id,
        //         episode_id: reqObj.song_id,
        //         artist_id: reqObj.artist_id
        //     }
        //     console.log('Request object is', newReqObj)
        //     res = await axios.post(BASE_URL + 'auth/episode_played_date_store', newReqObj, {
        //         headers: { 'Authorization': `Bearer ${token}` }
        //     })
        // }
        // else {
            res = await axios.post(BASE_URL + 'auth/song_played_date_store', reqObj, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
        // }
        console.log('Song played by date response', res.data)
        return res
    },
    getFeaturedPlaylists: async (token) => {
        const res = await axios.get(BASE_URL + 'auth/featured', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data.Data
    },
    profileUpdate: async (token, reqObj) => {
        const res = await axios.post(BASE_URL + 'auth/profileUpdate', reqObj, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data
    },
    updateProfileImage: async (token, reqObj) => {
        const res = await axios.post(BASE_URL + 'auth/changeProfileImage', reqObj, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data
    },
    getBestArtists: async (token) => {
        const res = await axios.get(BASE_URL + 'auth/best_artist', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data.topArtist
    },
    likeArtist: async (reqObj, token) => {
        const res = await axios.post(BASE_URL + 'auth/add_favourite_artist', reqObj, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data
    },
    getAllPodcasts: async (token) => {
        const res = await axios.get(BASE_URL + 'auth/podcast_list', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        console.log("These are the podcasts on server", res.data)
        return res.data.Data
    },
    getPopularVideos: async (token) => {
        const res = await axios.get(BASE_URL + 'auth/popular_videos', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data.data
    },
    getAlbums: async (token) => {
        const res = await axios.get(BASE_URL + 'auth/get_albums', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data.data
    },
    addFavoriteAlbum: async (token, reqObj) => {
        const res = await axios.post(BASE_URL + 'auth/add_favourite_album', reqObj, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data
    },
    getSongsByAlbum: async (token, albumId) => {
        const res = await axios.get(BASE_URL + 'auth/album_song_list/' + albumId, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data.Songs
    },
    addFavoritePlaylist: async (token, reqObj) => {
        const res = await axios.post(BASE_URL + 'auth/add_favourite_playlist', reqObj, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data
    },
    getFavouriteAlbums: async (token, userId) => {
        const res = await axios.get(BASE_URL + 'auth/get_favourite_album/' + userId, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data.Data
    },
    getFavouritePlaylists: async (token, userId) => {
        const res = await axios.get(BASE_URL + 'auth/get_favourite_playlist/' + userId, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data.Data
    },
    getHomeData: async (token, userId) => {
        console.log('Token is', token)
        console.log('User id is', userId)
        const res = await axios.get(BASE_URL + `auth/home_listing/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data
    },
    followArtist: async (token, reqObj) => {
        const res = await axios.post(BASE_URL + 'auth/follow_artist', reqObj, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res
    },
    unfollowArtist: async (token, reqObj) => {
        const res = await axios.post(BASE_URL + 'auth/unfollow_artist', reqObj, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res
    },
    getFollowedArtists: async (token, userId) => {
        const res = await axios.get(BASE_URL + 'auth/get_all_follow_artist/' + userId, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data.Data
    },
    getTrendingSongs: async (token) => {
        const res = await axios.get(BASE_URL + 'auth/get_trending_songs', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data.song
    },
    forgotPassword: async (reqObj) => {
        const res = await axios.post(BASE_URL + 'forgot-password', reqObj)
        return res.data
    },
    verifyCode: async (reqObj) => {
        const res = await axios.post(BASE_URL + 'verify-code', reqObj)
        return res.data
    },
    resetPassword: async (token, reqObj) => {
        const res = await axios.post(BASE_URL + 'ResetPassword', reqObj, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        console.log('This is the response in the API', res.data)
        return res.data
    },
    deletePlaylist: async (playlistID, token) => {
        const res = await axios.get(BASE_URL + 'auth/user_playlist_delete/' + playlistID, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res;
    },
    unlikePlaylist: async (token, reqObj) => {
        const res = await axios.post(BASE_URL + 'auth/add_unfavourite_playlist', reqObj, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data
    },
    unlikeAlbum: async (token, reqObj) => {
        const res = await axios.post(BASE_URL + 'auth/add_unfavourite_album', reqObj, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data
    },
    getLikedPodcasts: async (token, userId) => {
        const res = await axios.get(BASE_URL + 'auth/user_podcasts_like_get/' + userId, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data.Data
    },
    likePodcast: async (token, reqObj) => {
        const res = await axios.post(BASE_URL + 'auth/user_podcast_like', reqObj, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data
    },
    unlikePodcast: async (token, reqObj) => {
        const res = await axios.post(BASE_URL + 'auth/user_podcast_unlike', reqObj, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data
    },
    getAutoplaySongs: async (token) => {
        const res = await axios.get(BASE_URL + 'auth/autoplay_songs', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data.data
    },
    deleteSongFromPlaylist: async (token, reqObj) => {
        const res = await axios.post(BASE_URL + 'auth/delete_user_playlist_song', reqObj, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data
    },
    storeAdvertisementData: async (token, reqObj) => {
        const res = await axios.post(BASE_URL + 'auth/users_visit_store', reqObj, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data
    },
    getTopGenres: async (token, userId) => {
        const res = await axios.get(BASE_URL + 'auth/top_genres/' + userId, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data.Category
    },
    getIntrobackgroundImages: async () => {
        const res = await axios.get(BASE_URL + 'banner_get')
        return res.data.Banners
    },
    getAllFeaturedArtists: async (token) => {
        const res = await axios.get(BASE_URL + 'auth/featured_artist', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data.Data
    }
}
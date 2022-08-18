import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, BackHandler } from 'react-native'
import { commonStyles } from '../constants/commonStyles';
import { navigationStrings } from '../navigation/navigationStrings';
import { MainHeader1 } from '../Components/MainHeader1';
import DropDownPicker from 'react-native-dropdown-picker'
import { Checkbox } from '../Components/Checkbox';
import { apiHandler } from '../constants/apiHandler';
import { AsyncStorageFunctions } from '../constants/asyncStorage';
import { colors } from '../constants/colors';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useRoute } from '@react-navigation/native';
import { connect, useDispatch } from 'react-redux';
import { PlayControls } from '../Components/PlayControls';
import { minimizePlayer, changePlaylist, setTrackIndex, advertisments, changePlayerState, setUserData, setAccessToken, likeUnlikeSong } from '../redux/actions/actions';
import LinearGradient from 'react-native-linear-gradient';
import { windowHeight } from '../constants/globalConstants';

const SelectCountryAndLanguage = (props) => {

    let countries = ['Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cameroon', 'Central African Republic', 'Chad', 'Comoros', 'Democratic Republic of the Congo', 'Republic of the Congo', 'Cote d\'Ivoire', 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea Bissau', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Sao Tome and Principe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Swaziland', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe']

    const countriesList = countries.map((item, index) => {
        return {
            label: item,
            value: item
        }
    })

    const [selectedCountry, setSelectedCountry] = useState('')
    const [dropdownPickerOpen, setPickerOpen] = useState(false);
    const [selectedLanguages, setSelectedLanguages] = useState([])
    const [allLanguages, setAllLanguages] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [userData, setUserData] = useState({})
    const route = useRoute()

    const isInitialLoad = route.params?.isInitial || false


    useEffect(() => {
        AsyncStorageFunctions.getItem('userCountry').then((res) => {
            if (res) {
                let userCountry = {
                    label: res,
                    value: res
                }
                setSelectedCountry(userCountry)
            }
            else {
                setSelectedCountry(countriesList[0])
            }
        })
        const getAllLanguages = () => {
            setIsLoading(true)
            setUserData(props.userData)
            apiHandler.getAllLanguages(props.accessToken).then(res => {
                setAllLanguages(res)
            })
            getSelectedLanguages()
        }
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton)
        getAllLanguages()
        return () => backHandler.remove()
    }, [])

    const handleBackButton = () => {
        if (props.navigation.canGoBack()) {
            props.navigation.goBack()
        }
    }

    const getSelectedLanguages = async () => {
        const userLanguages = await apiHandler.getUserLanguages(props.accessToken)
        let data = userLanguages.map((item, index) => {
            return item.id
        })
        setSelectedLanguages(data)
        setIsLoading(false)
    }

    const showHideDropdownPicker = () => {
        setPickerOpen(!dropdownPickerOpen)
    }

    const onLanguageSelect = (item) => {
        let arrSelectedLanguages = [...selectedLanguages]
        if (arrSelectedLanguages.includes(item)) {
            arrSelectedLanguages = arrSelectedLanguages.filter(x => {
                return x != item
            })
        }
        else {
            arrSelectedLanguages.push(item)
        }
        setSelectedLanguages(arrSelectedLanguages)
    }

    const onPickerItemSelect = (item) => {
        setSelectedCountry(item)
    }

    const onRightTextPress = async () => {
        AsyncStorageFunctions.setItem('userCountry', selectedCountry.value)
        let languageData = {
            "user_id": userData.id,
            "language": selectedLanguages
        }
        apiHandler.setUserLanguages(props.accessToken, languageData).then((res) => {
            if (isInitialLoad) {
                props.navigation.replace(navigationStrings.BottomTabBar)
            }
            else {
                props.navigation.goBack()
            }
        }).catch((error) => {
            console.log('This is the error', error)
        })
    }

    const onSkipPress = () => {
        props.navigation.replace(navigationStrings.BottomTabBar)
    }

    const dispatch = useDispatch()

    const updatePlayingState = (value) => {
        dispatch(changePlayerState(value))
    }

    const maximizePlayer = () => {
        dispatch(minimizePlayer(false))
        props.navigation.navigate(navigationStrings.PlaySong, { songDetails: props.currentSong })
    }

    const updateTrackIndex = (index) => {
        dispatch(setTrackIndex(index))
    }

    const likeUnlikeSongPress = (id) => {
        dispatch(likeUnlikeSong(id))
    }

    return (
        <View style={commonStyles.fullScreenContainerBlack(props.isPlayerMinimized)}>
            <LinearGradient
                style={commonStyles.linearGradientStyle}
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                colors={['#ffffff77', '#ffffff55', '#ffffff33', '#ffffff11', '#ffffff11', '#ffffff22', '#ffffff44', '#ffffff66', '#ffffff99']}
            />
            <MainHeader1 headerPrimaryTitle='Languages for music' leftText={isInitialLoad && 'Skip'} onLeftIconPress={onSkipPress} rightText={isInitialLoad ? 'Continue' : 'Done'} onRightIconPress={onRightTextPress} />
            <Text style={commonStyles.textWhiteNormal(9, { alignSelf: 'flex-start' })}>
                What are your preferred languages for music?
            </Text>
            <Text style={commonStyles.textWhiteNormal(14, { alignSelf: 'flex-start', marginTop: 20 })}>
                Choose your country
            </Text>
            <View style={styles.dropdownPickerContainer} >
                <DropDownPicker
                    items={countriesList}
                    open={dropdownPickerOpen}
                    onOpen={showHideDropdownPicker}
                    onClose={showHideDropdownPicker}
                    placeholder={selectedCountry.value}
                    value={selectedCountry}
                    containerStyle={{ height: 40, width: '100%' }}
                    onSelectItem={(item) => {
                        onPickerItemSelect(item)
                    }}
                    ArrowDownIconComponent={({ style }) => <Ionicons name='chevron-down' style={{ color: colors.white, fontSize: 15 }} />}
                    ArrowUpIconComponent={({ style }) => <Ionicons name='chevron-up' style={{ color: colors.white, fontSize: 15 }} />}
                    theme='DARK'
                />
            </View>
            {isLoading ?
                <View style={styles.loaderContainer}>
                    <ActivityIndicator color={colors.white} />
                </View>
                : allLanguages.map((item, index) => {
                    return <TouchableOpacity key={index} onPress={() => {
                        onLanguageSelect(item.id)
                    }} style={styles.singleCountryOptionContainer}>
                        <Text style={commonStyles.textWhiteNormal(12)}>
                            {item.name}
                        </Text>
                        <Checkbox isSelected={selectedLanguages.includes(item.id)} />
                    </TouchableOpacity>
                })}
            {
                (props.isPlayerMinimized) && <PlayControls likeUnlikeSong={(id) => { likeUnlikeSongPress(id) }} likedSongs={props.likedSongs} isPlaying={props.isPlaying} setIsPlaying={(value) => { updatePlayingState(value) }} updateIndex={(index) => { updateTrackIndex(index) }} currentIndex={props.currentTrackIndex} currentPlaylist={props.currentPlaylist} playCount={props.playCount} changePlayerState={maximizePlayer} isMinimized={props.isPlayerMinimized} userData={props.userData} token={props.accessToken} />
            }
        </View>
    )
}

const mapStateToProps = (state) => {
    return { userData: state.userData, accessToken: state.accessToken, isPlayerMinimized: state.isPlayerMinimized, currentPlaylist: state.currentPlaylist, playCount: state.playCount, advertisements: state.advertisements, currentTrackIndex: state.currentTrackIndex, likedSongs: state.likedSongsIds }
}

export default connect(mapStateToProps)(SelectCountryAndLanguage)


const styles = StyleSheet.create({
    dropdownPickerContainer: { minHeight: 50, marginTop: 10, width: '100%' },
    singleCountryOptionContainer: { flexDirection: 'row', paddingVertical: 10, width: '100%', justifyContent: 'space-between' },
    loaderContainer: { marginTop: 40 }
})

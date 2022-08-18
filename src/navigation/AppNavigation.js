import React, { useState, useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import AppMainNavigator from "./MainFlowNavigation";
import LoginStackNavigator from "./LoginFlowNavigation";
import { AsyncStorageFunctions } from "../constants/asyncStorage";
import { connect, useDispatch } from "react-redux";
import { setAccessToken, advertisments } from "../redux/actions/actions";

const AppNavigation = (props) => {

    useEffect(() => {
        getInitialData()
    }, [])


    const dispatch = useDispatch()

    const getInitialData = async () => {
        const token = await AsyncStorageFunctions.getItem('token')
        if (token) {
            //     //Run npm install @react-native-community/geolocation before uncommenting this code
            //     // Geolocation.getCurrentPosition(async (location) => {
            //     //     let latitude = location.coords.latitude
            //     //     let longitude = location.coords.longitude
            //     //     axios.get(`http://api.geonames.org/countryCodeJSON?lat=${latitude}&lng=${longitude}&username=afromelodies`).then((countryAPIData) => {
            //     //         console.log('Country API data', countryAPIData)
            //     //     }).catch((err) => {
            //     //         console.log('Error fetching the country data', err)
            //     //     })
            //     // }, (error) => {
            //     //     console.log('Error is', error)
            //     // })
            dispatch(setAccessToken(token))
        }
    }
    return (
        <NavigationContainer>
            {props.accessToken ?
                <AppMainNavigator />
                : <LoginStackNavigator />}
        </NavigationContainer>
    );
}

const mapStateToProps = (state) => {
    return { accessToken: state.accessToken }
}

export default connect(mapStateToProps)(AppNavigation);
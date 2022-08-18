import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { navigationStrings } from './navigationStrings';
import Home from '../screens/Home';
import React, { useState, useEffect } from 'react'
import Search from '../screens/Search';
import MyLibrary from '../screens/MyLibrary';
import ViewProfile from '../screens/ViewProfile';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Feather from 'react-native-vector-icons/Feather'
import { colors } from '../constants/colors';
import { View, Text, TouchableOpacity, StyleSheet, AsyncStorage } from 'react-native'
import NetInfo from "@react-native-community/netinfo";
import { setCurrentInternetStatus } from '../redux/actions/actions';
import { useSelector, useDispatch } from 'react-redux';

const BottomTab = createBottomTabNavigator();

export default function BottomTabBar(props) {
  const headerShown = {
    headerShown: false,
    tabBarHideOnKeyboard: true
  }

  const isInternetConnected = useSelector((state) => state.isInternetConnected)

  const dispatch = useDispatch()

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      dispatch(setCurrentInternetStatus(state.isConnected))
    });
    return () => unsubscribe
  }, [])

  const getIcon = (label, isFocused) => {
    switch (label) {
      case navigationStrings.Home:
        return <Feather name="home" style={bottomTabBarStyles.tabIconStyle(isFocused)} />
      case navigationStrings.Search:
        return <FontAwesome name="search" style={bottomTabBarStyles.tabIconStyle(isFocused)} />
      case navigationStrings.MyLibrary:
        return <FontAwesome name="heart-o" style={bottomTabBarStyles.tabIconStyle(isFocused)} />
      case navigationStrings.ViewProfile:
        return <MaterialCommunityIcons name="account" style={bottomTabBarStyles.tabIconStyle(isFocused)} />
      default:
        break;
    }
  }

  // const maximizePlayer = () => {
  //   dispatch(minimizePlayer(false))
  // }

  const MyTabBar = ({ state, descriptors, navigation }) => {
    return (
      <View>
        {/* {isPlayerVisible && <PlayControls currentPlaylist={currentPlaylist} playCount={playCount} changePlayerState={maximizePlayer} isMinimized={true} userData={userData} token={accessToken} />} */}
        <View style={bottomTabBarStyles.bottomTabBarContainer}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate({ name: route.name, merge: true });
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <TouchableOpacity
                key={index}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={bottomTabBarStyles.singleTabContainer}
              >
                {getIcon(label, isFocused)}
                <Text style={bottomTabBarStyles.tabLabelStyle(isFocused)}>
                  {label == navigationStrings.MyLibrary ? 'My Library' : label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <BottomTab.Navigator initialRouteName={navigationStrings.Home}
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarStyle: [
          {
            display: 'flex'
          }, null
        ],
        headerShown: false
      }} tabBar={(props) => <MyTabBar {...props} />}>
      <BottomTab.Screen name={navigationStrings.Home} component={isInternetConnected ? Home : MyLibrary} options={{
        tabBarLabel: 'Home'
      }} />
      <BottomTab.Screen name={navigationStrings.Search} component={isInternetConnected ? Search : MyLibrary} options={{ tabBarHideOnKeyboard: false }} />
      <BottomTab.Screen name={navigationStrings.MyLibrary} component={MyLibrary} />
      <BottomTab.Screen name={navigationStrings.ViewProfile} component={isInternetConnected ? ViewProfile : MyLibrary} />
    </BottomTab.Navigator>
  );
}


const bottomTabBarStyles = StyleSheet.create({
  bottomTabBarContainer: { flexDirection: 'row', backgroundColor: colors.black, minHeight: 60, justifyContent: 'center', maxHeight: 80, paddingTop: 5, width: '100%' },
  singleTabContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabIconStyle: (isFocused) => {
    return { fontSize: 22, color: colors.white, opacity: isFocused ? 1 : 0.5 }
  },
  tabLabelStyle: (isFocused) => {
    return { color: colors.white, opacity: isFocused ? 1 : 0.5 }
  }
})
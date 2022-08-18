import React, { useEffect, useState } from 'react'
import { Provider as PaperProvider } from 'react-native-paper'
import { Provider, useDispatch } from 'react-redux';
import store from './src/redux/store/store';
import { firebase } from '@react-native-firebase/storage';
import TrackPlayer, { Capability } from 'react-native-track-player';
import AppNavigation from './src/navigation/AppNavigation';
import messaging from '@react-native-firebase/messaging'
import { AsyncStorageFunctions } from './src/constants/asyncStorage';
import PushNotification from 'react-native-push-notification';


PushNotification.configure({
  onRegister: function (token) {
    console.log('FCM token value is the ', token)
  },
  popInitialNotification: true,
  requestPermissions: true
})

export default function App() {

  useEffect(() => {
    getInitialData()
  }, [])

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      PushNotification.createChannel(
        {
          channelId: "channel-id", // (required)
          channelName: "My channel", // (required)
          channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
          playSound: false, // (optional) default: true
          soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
          vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
        },
        (created) => {
          PushNotification.localNotification({
            channelId: "channel-id", // (required) channelId, if the channel doesn't exist, notification will not trigger.
            // largeIconUrl: "https://cdn4.iconfinder.com/data/icons/logos-brands-5/24/react-128.png", // (optional) default: undefine
            title: remoteMessage.notification.title, // (optional)
            message: remoteMessage.notification.body, // (required)
          });
        } // (optional) callback returns whether the channel was created, false means it already existed.
      );
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    return () => unsubscribe();
  }, [])

  useEffect(() => {
    messaging().onMessage(async remoteMessage => {
      JSON.stringify(remoteMessage.notification.body)
      // console.log(remoteMessage, "remoteMessage")
    })

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      JSON.stringify(remoteMessage.notification.body)
      const channelId = Math.random().toString(36).substring(7)
      // showNotification(channelId, { bigImage: remoteMessage.notification.android.imageUrl, title: remoteMessage.notification.title, message: remoteMessage.notification.body, subText: remoteMessage.data.subTitle })
    })

  }, [])

  const getInitialData = async () => {
    const firebaseConfig = {
      apiKey: "AIzaSyA4OUCC_z6V2QdCfuu1oWAe3nCWjEEJ7Vs",
      authDomain: "afro-melodies.firebaseapp.com",
      projectId: "afro-melodies",
      storageBucket: "afro-melodies.appspot.com",
      messagingSenderId: "469412287743",
      appId: "1:469412287743:android:1553a01aac569b0118e8ca",
      measurementId: "G-B0KCDSP7LB"
    };
    const app = firebase.initializeApp(firebaseConfig)
    await checkPermission()
    await initializePlayer()
  }

  async function checkPermission() {
    const enabled = await messaging().hasPermission();
    if (enabled) {
      getToken();
    } else {
      requestPermission();
    }
  }

  async function getToken() {
    let fcmToken = await AsyncStorageFunctions.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await messaging().getToken();
      if (fcmToken) {
        await AsyncStorageFunctions.setItem('fcmToken', fcmToken);
      }
    }
  }

  async function requestPermission() {
    try {
      await messaging().requestPermission();
      getToken();
    } catch (error) {
      console.log('permission rejected');
    }
  }

  const initializePlayer = async () => {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      stopWithApp: true,
      alwaysPauseOnInterruption: true
    })
    await TrackPlayer.setVolume(1)
  }
  return (
    // <PaperProvider>
    <Provider store={store}>
      <AppNavigation />
    </Provider>
    // </PaperProvider>
  )
}
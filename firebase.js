import firebase from '@react-native-firebase/app';
import 'firebase/firestore'


if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore()
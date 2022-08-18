import AsyncStorage from '@react-native-async-storage/async-storage';

export const AsyncStorageFunctions = {
    setItem: async (key, value) => {
        await AsyncStorage.setItem(key, value)
    },
    getItem: async (key) => {
        let value;
        value = await AsyncStorage.getItem(key)
        return value;
    },
    removeItem:async(key)=>{
        await AsyncStorage.removeItem(key)
    }
}
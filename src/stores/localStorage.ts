import AsyncStorage from '@react-native-community/async-storage';

type ItemKeys = 'me' | 'firstInstall' | 'isShowSplash';

async function removeItem(key: ItemKeys) {
    try {
        await AsyncStorage.removeItem(key);
        console.log(`It was removed ${key} successfully`);
        return true;
    } catch (error) {
        console.log(`It was removed ${key} failure`);
    }
}

async function setItem(key: ItemKeys, value: any) {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        console.log(`It was saved ${key} successfully`);
        return value;
    } catch (error) {
        console.log(`It was saved ${key} failure`);
    }
}

async function getItem(key: ItemKeys) {
    let results: any;
    try {
        results = await AsyncStorage.getItem(key);
        return JSON.parse(results);
    } catch (error) {
        return null;
    }
}

async function clearAll() {
    return AsyncStorage.clear();
}

export default {
    removeItem,
    getItem,
    setItem,
    clearAll,
};

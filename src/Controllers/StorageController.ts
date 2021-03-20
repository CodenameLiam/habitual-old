import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * TODO: Make these generic to properly type in/out data
 */

export const storeValue = async (key: string, value: string): Promise<any> => {
    try {
        await AsyncStorage.setItem(key, value);
        console.log(`${key} successfully saved as ${value}`);
    } catch (e) {
        console.error(e);
    }
};

export const getValue = async (key: string): Promise<any> => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return value;
        }
    } catch (e) {
        console.error(e);
    }
};

export const storeData = async (key: string, value: any): Promise<any> => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        console.error(e);
    }
};

export const getData = async (key: string): Promise<any> => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error(e);
    }
};

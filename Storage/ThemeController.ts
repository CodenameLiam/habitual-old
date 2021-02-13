import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native-appearance';
import { GreyColours } from '../Styles/Colours';
import { getData, getValue, storeData, storeValue } from './StorageController';

export type ThemeType = 'dark' | 'light';

export const useCustomTheme = () => {
	const systemTheme = useColorScheme();
	const THEME_KEY = '@Theme';
	const DEFAULT_THEME = systemTheme === 'dark' ? 'dark' : 'light';

	const [theme, setCustomTheme] = useState<ThemeType | undefined>();

	const toggleTheme = (theme: ThemeType) => {
		return theme === 'dark' ? 'light' : 'dark';
	};

	const storeThemeSettings = async (data: ThemeType) => {
		await storeValue(THEME_KEY, data);
	};

	const getThemeSettings = async (): Promise<ThemeType | any> => {
		return getValue(THEME_KEY);
	};

	const setTheme = (theme: ThemeType) => {
		setCustomTheme(theme);
		storeThemeSettings(theme);
	};

	const configureTheme = async () => {
		const themeSettings = await getThemeSettings();

		if (!themeSettings) {
			storeThemeSettings(DEFAULT_THEME);
		} else {
			setCustomTheme(themeSettings);
		}
	};

	useEffect(() => {
		configureTheme();
	}, []);

	return { theme, setTheme, toggleTheme };
};

export const CustomDarkTheme = {
	dark: true,
	colors: {
		primary: '#FFFFFF',
		text: '#FFFFFF',
		background: '#0F2028',
		border: '#0F2028',
		card: '#223843',
		notification: 'red',
	},
};

export const CustomLightTheme = {
	dark: true,
	colors: {
		primary: '#FFFFFF',
		text: '#0F2028',
		background: '#f4f4f4',
		border: '#0F2028',
		card: '#fff',
		notification: 'red',
	},
};

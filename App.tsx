import React from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RootNavigation from './Navigation/RootNavigation';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { AppearanceProvider } from 'react-native-appearance';
import { CustomDarkTheme, useTheme } from './Storage/ThemeController';
// import { configureTheme, getTheme } from './Storage/ThemeController';

export default function App() {
	const { theme, setTheme, toggleTheme } = useTheme();

	return (
		<AppearanceProvider>
			<NavigationContainer theme={theme === 'dark' ? CustomDarkTheme : DefaultTheme}>
				<RootNavigation theme={theme} setTheme={setTheme} toggleTheme={toggleTheme} />
			</NavigationContainer>
		</AppearanceProvider>
	);
}

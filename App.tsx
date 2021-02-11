import React from 'react';
import RootNavigation from './Navigation/RootNavigation';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { AppearanceProvider } from 'react-native-appearance';
import { CustomDarkTheme, CustomLightTheme, useCustomTheme } from './Storage/ThemeController';
import { useCustomFonts } from './Storage/FontController';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'react-native';

export default function App() {
	const { theme, setTheme, toggleTheme } = useCustomTheme();
	const { fontsLoaded } = useCustomFonts();

	if (!theme || !fontsLoaded) return <AppLoading />;

	return (
		<AppearanceProvider>
			<NavigationContainer theme={theme === 'dark' ? CustomDarkTheme : CustomLightTheme}>
				<StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
				<RootNavigation theme={theme} setTheme={setTheme} toggleTheme={toggleTheme} />
			</NavigationContainer>
		</AppearanceProvider>
	);
}

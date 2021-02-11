import React from 'react';
import RootNavigation from './Navigation/RootNavigation';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { AppearanceProvider } from 'react-native-appearance';
import { CustomDarkTheme, useCustomTheme } from './Storage/ThemeController';
import { useCustomFonts } from './Storage/FontController';
import AppLoading from 'expo-app-loading';

export default function App() {
	const { theme, setTheme, toggleTheme } = useCustomTheme();
	const { fontsLoaded } = useCustomFonts();

	if (!theme || !fontsLoaded) return <AppLoading />;

	return (
		<AppearanceProvider>
			<NavigationContainer theme={theme === 'dark' ? CustomDarkTheme : DefaultTheme}>
				<RootNavigation theme={theme} setTheme={setTheme} toggleTheme={toggleTheme} />
			</NavigationContainer>
		</AppearanceProvider>
	);
}

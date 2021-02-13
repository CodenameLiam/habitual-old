import React, { createContext, useState } from 'react';
import RootNavigation from './Navigation/RootNavigation';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { AppearanceProvider } from 'react-native-appearance';
import { CustomDarkTheme, CustomLightTheme, useCustomTheme } from './Storage/ThemeController';
import { useCustomFonts } from './Storage/FontController';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'react-native';
import { GradientColours, GradientType } from './Styles/Colours';
import { randomGradient } from './Components/ColourPicker';
import { GradientContext } from './Context/GradientContext';

export default function App() {
	const { fontsLoaded } = useCustomFonts();
	const { theme, setTheme, toggleTheme } = useCustomTheme();

	const [gradient, setGradient] = useState<GradientType>(randomGradient());
	const value = { gradient, setGradient };

	if (!theme || !fontsLoaded) return <AppLoading />;

	return (
		<AppearanceProvider>
			<GradientContext.Provider value={value}>
				<NavigationContainer theme={theme === 'dark' ? CustomDarkTheme : CustomLightTheme}>
					<StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
					<RootNavigation theme={theme} setTheme={setTheme} toggleTheme={toggleTheme} />
				</NavigationContainer>
			</GradientContext.Provider>
		</AppearanceProvider>
	);
}

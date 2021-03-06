import React, { createContext, useState } from 'react';
import RootNavigation from './Navigation/RootNavigation';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { AppearanceProvider } from 'react-native-appearance';
import { CustomDarkTheme, CustomLightTheme, useCustomTheme } from './Storage/ThemeController';
import { useCustomFonts } from './Storage/FontController';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'react-native';
import { GradientColours, GradientShape, GradientType } from './Styles/Colours';
import { randomGradient } from './Components/ColourPicker';
import { GradientContext } from './Context/GradientContext';
import { AppContext } from './Context/AppContext';
import { useHabits } from './Storage/HabitController';
import { HabitProps } from './Components/Habit';
import { useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
	const { fontsLoaded } = useCustomFonts();
	const { theme, setTheme, toggleTheme } = useCustomTheme();

	const [gradient, setGradient] = useState<GradientType>(randomGradient());
	const gradientValue = { gradient, setGradient };

	const { habits, setHabits, createHabit, updateHabit } = useHabits();
	const appValue = { habits, setHabits, createHabit, updateHabit };

	if (!theme || !fontsLoaded) return <AppLoading />;

	return (
		<AppearanceProvider>
			<AppContext.Provider value={appValue}>
				<GradientContext.Provider value={gradientValue}>
					<NavigationContainer
						theme={theme === 'dark' ? CustomDarkTheme : CustomLightTheme}>
						<StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
						<RootNavigation
							theme={theme}
							setTheme={setTheme}
							toggleTheme={toggleTheme}
						/>
					</NavigationContainer>
				</GradientContext.Provider>
			</AppContext.Provider>
		</AppearanceProvider>
	);
}

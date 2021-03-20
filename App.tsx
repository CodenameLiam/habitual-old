import React, { useState } from 'react';
import RootNavigation from 'Navigation/RootNavigation';
import { NavigationContainer } from '@react-navigation/native';
import { AppearanceProvider } from 'react-native-appearance';
import { CustomDarkTheme, CustomLightTheme, useCustomTheme } from 'Controllers/ThemeController';
import { useCustomFonts } from 'Controllers/FontController';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'react-native';
import { GradientType } from 'Styles/Colours';
import { randomGradient } from 'Helpers';
import { GradientContext } from 'Context/GradientContext';
import { AppContext } from 'Context/AppContext';
import { useHabits } from 'Controllers/HabitController';
import { TimerContext } from 'Context/TimerContext';

const App: React.FC = () => {
    const fontsLoaded = useCustomFonts();
    const { theme, setTheme, toggleTheme, colour, setColour } = useCustomTheme();

    const [gradient, setGradient] = useState<GradientType>(randomGradient());
    const gradientValue = { gradient, setGradient, colour, setColour };

    const [activeTimer, setActiveTimer] = useState<string | undefined>();
    const timerValue = { activeTimer, setActiveTimer };

    const { habits, setHabits, createHabit, updateHabit, deleteHabit } = useHabits();
    const appValue = { habits, setHabits, createHabit, updateHabit, deleteHabit };

    if (!theme || !colour || !fontsLoaded) return <AppLoading />;

    return (
        <AppearanceProvider>
            <AppContext.Provider value={appValue}>
                <TimerContext.Provider value={timerValue}>
                    <GradientContext.Provider value={gradientValue}>
                        <NavigationContainer
                            theme={theme === 'dark' ? CustomDarkTheme : CustomLightTheme}>
                            <StatusBar
                                barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
                            />
                            <RootNavigation
                                theme={theme}
                                setTheme={setTheme}
                                toggleTheme={toggleTheme}
                                setColour={setColour}
                            />
                        </NavigationContainer>
                    </GradientContext.Provider>
                </TimerContext.Provider>
            </AppContext.Provider>
        </AppearanceProvider>
    );
};

export default App;

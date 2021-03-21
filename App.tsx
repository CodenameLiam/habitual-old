import React, { useState } from 'react';
import RootNavigation from 'Navigation/RootNavigation';
import { NavigationContainer } from '@react-navigation/native';
import { AppearanceProvider } from 'react-native-appearance';
import { CustomDarkTheme, CustomLightTheme, useCustomTheme } from 'Controllers/ThemeController';
import { useCustomFonts } from 'Controllers/FontController';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'react-native';
import { AppContext } from 'Context/AppContext';
import { useHabits } from 'Controllers/HabitController';
import { TimerContext } from 'Context/TimerContext';
import { ThemeProvider } from '@emotion/react';

const App: React.FC = () => {
    const fontsLoaded = useCustomFonts();
    const { theme, setTheme, toggleTheme, colour, setColour } = useCustomTheme();

    const [activeTimer, setActiveTimer] = useState<string | undefined>();
    const timerValue = { activeTimer, setActiveTimer };

    const { habits, createHabit, updateHabit, deleteHabit } = useHabits();
    const appValue = {
        habits,
        createHabit,
        updateHabit,
        deleteHabit,
        colour,
        setColour,
    };

    if (!theme || !colour || !fontsLoaded) return <AppLoading />;

    return (
        <AppearanceProvider>
            <ThemeProvider theme={theme === 'dark' ? CustomDarkTheme : CustomLightTheme}>
                <AppContext.Provider value={appValue}>
                    <TimerContext.Provider value={timerValue}>
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
                    </TimerContext.Provider>
                </AppContext.Provider>
            </ThemeProvider>
        </AppearanceProvider>
    );
};

export default App;

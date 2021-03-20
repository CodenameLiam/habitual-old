import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AppNavigation from './AppNavigation';
import SettingsSreen from 'Screens/Settings';
import { ThemeType } from 'Controllers/ThemeController';
import { GradientType } from 'Styles/Colours';

export type RootDrawerParamList = {
	App: undefined;
	Settings: undefined;
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();

interface RootNavigationProps {
	theme: ThemeType;
	setTheme: (theme: ThemeType) => void;
	toggleTheme: (theme: ThemeType) => 'dark' | 'light';
	setColour: (colour: GradientType) => void;
}

const RootNavigation: React.FC<RootNavigationProps> = ({
    theme,
    setTheme,
    toggleTheme,
    setColour
}) => {
    return (
        <Drawer.Navigator
            drawerType='slide'
            overlayColor={'none'}
            drawerContent={() => (
                <SettingsSreen
                    theme={theme}
                    setTheme={setTheme}
                    toggleTheme={toggleTheme}
                    setColour={setColour}
                />
            )}>
            <Drawer.Screen name='App' component={AppNavigation} />
        </Drawer.Navigator>
    );
};

export default RootNavigation;

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AppNavigation from './AppNavigation';
import SettingsSreen from '../Screens/SettingsScreen';
import { ThemeType } from '../Storage/ThemeController';

export type RootDrawerParamList = {
	App: undefined;
	Settings: undefined;
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();

interface RootNavigationProps {
	theme: ThemeType;
	setTheme: (theme: ThemeType) => void;
	toggleTheme: (theme: ThemeType) => 'dark' | 'light';
}

export default function RootNavigation({ theme, setTheme, toggleTheme }: RootNavigationProps) {
	return (
		<Drawer.Navigator
			drawerType='slide'
			overlayColor={'none'}
			drawerContent={() => (
				<SettingsSreen theme={theme} setTheme={setTheme} toggleTheme={toggleTheme} />
			)}>
			<Drawer.Screen name='App' component={AppNavigation} />
		</Drawer.Navigator>
	);
}

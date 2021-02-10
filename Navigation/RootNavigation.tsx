import React from 'react';
import { View, Text } from 'react-native';
import {
	createDrawerNavigator,
	DrawerContentComponentProps,
	DrawerContentOptions,
} from '@react-navigation/drawer';
import AppNavigation from './AppNavigation';
import Settings from '../Screens/Settings';
import Home from '../Screens/Home';
import { ThemeType } from '../Storage/ThemeController';

export type RootStackParamList = {
	App: undefined;
	Settings: undefined;
};

const Drawer = createDrawerNavigator<RootStackParamList>();

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
				<Settings theme={theme} setTheme={setTheme} toggleTheme={toggleTheme} />
			)}>
			<Drawer.Screen name='App' component={AppNavigation} />
		</Drawer.Navigator>
	);
}

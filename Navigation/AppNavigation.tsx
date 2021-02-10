import { DrawerNavigationProp, DrawerScreenProps, useIsDrawerOpen } from '@react-navigation/drawer';
import { RouteProp, useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import SettingsMenuIcon from './../Components/SettingsMenuIcon';
import { SafeAreaView } from 'react-native-safe-area-context';
import RootNavigation, { RootStackParamList } from './RootNavigation';
import AnimatedTabBar, {
	TabsConfig,
	BubbleTabBarItemConfig,
	FlashyTabBarItemConfig,
} from '@gorhom/animated-tabbar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import Home from '../Screens/Home';
import Calendar from '../Screens/Calendar';
import HomeNavigation from './HomeNavigation';

const tabs: TabsConfig<FlashyTabBarItemConfig> = {
	Home: {
		labelStyle: {
			color: '#ffafcc',
		},
		icon: {
			component: () => <Feather name='home' size={20} color='#ffafcc' />,
			color: '#ffafcc',
		},
	},
	Calendar: {
		labelStyle: {
			color: '#f4a261',
		},
		icon: {
			component: () => <Feather name='calendar' size={20} color='#f4a261' />,
			color: '#f4a261',
		},
	},
	Trends: {
		labelStyle: {
			color: '#fcbf49',
		},
		icon: {
			component: () => <Entypo name='line-graph' size={20} color='#fcbf49' />,
			color: '#fcbf49',
		},
	},
	Awards: {
		labelStyle: {
			color: '#4cc9f0',
		},
		icon: {
			component: () => <Feather name='award' size={20} color='#4cc9f0' />,
			color: '#4cc9f0',
		},
	},
};

const Tab = createBottomTabNavigator();

export type AppNavigationProps = DrawerNavigationProp<RootStackParamList, 'App'>;

interface AppProps {
	navigation: AppNavigationProps;
}

export default function AppNavigation({ navigation }: AppProps) {
	const { colors } = useTheme();

	return (
		<Tab.Navigator
			tabBar={(props) => (
				<AnimatedTabBar
					tabs={tabs}
					preset='flashy'
					style={{ backgroundColor: colors.background }}
					{...props}
				/>
			)}>
			<Tab.Screen name='Home' component={HomeNavigation} />
			<Tab.Screen name='Calendar' component={Calendar} />
			<Tab.Screen name='Trends' component={Home} />
			<Tab.Screen name='Awards' component={Calendar} />
		</Tab.Navigator>
	);
}

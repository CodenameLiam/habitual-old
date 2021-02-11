import { DrawerNavigationProp } from '@react-navigation/drawer';
import {
	getFocusedRouteNameFromRoute,
	NavigationProp,
	ParamListBase,
	RouteProp,
	TabNavigationState,
	useTheme,
} from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import AnimatedTabBar, { TabsConfig, FlashyTabBarItemConfig } from '@gorhom/animated-tabbar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import Home from '../Screens/Home';
import Calendar from '../Screens/Calendar';
import { AppNavProps } from './AppNavigation';
import Trends from '../Screens/Trends';
import Awards from '../Screens/Awards';

export type TabParamList = {
	Home: undefined;
	Calendar: undefined;
	Trends: undefined;
	Awards: undefined;
};

const Tab = createBottomTabNavigator();

interface AppProps {
	navigation: AppNavProps;
	route: any;
}

export default function TabNavigation({ navigation, route }: AppProps) {
	const { colors } = useTheme();

	useLayoutEffect(() => {
		navigation.setOptions({ headerTitle: getHeaderTitle(route) });
	}, [navigation, route]);

	return (
		<Tab.Navigator
			tabBar={(props) => (
				<AnimatedTabBar
					tabs={tabs}
					preset='flashy'
					style={{ backgroundColor: colors.background }}
					{...props}
				/>
			)}
		>
			<Tab.Screen name='Home' component={Home} />
			<Tab.Screen name='Calendar' component={Calendar} />
			<Tab.Screen name='Trends' component={Trends} />
			<Tab.Screen name='Awards' component={Awards} />
		</Tab.Navigator>
	);
}

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

const getHeaderTitle = (route: RouteProp<TabParamList, 'Home'>) => {
	const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';

	switch (routeName) {
		case 'Trends':
			return 'Trends';
		case 'Awards':
			return 'Awards';
	}
};

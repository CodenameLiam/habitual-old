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
import HomeScreen from '../Screens/HomeScreen';
import CalendarSreen from '../Screens/CalendarScreen';
import { AppNavProps } from './AppNavigation';
import TrendsScreen from '../Screens/Trends';
import AwardsScreen from '../Screens/AwardsScreen';
import { GradientColours } from '../Styles/Colours';

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
			<Tab.Screen name='Home' component={HomeScreen} />
			<Tab.Screen name='Calendar' component={CalendarSreen} />
			<Tab.Screen name='Trends' component={TrendsScreen} />
			<Tab.Screen name='Awards' component={AwardsScreen} />
		</Tab.Navigator>
	);
}

const tabColours = {
	HOME: GradientColours.PURPLE.solid,
	CALENDAR: GradientColours.PINK.solid,
	TRENDS: GradientColours.ORANGE.solid,
	AWARDS: GradientColours.BLUE.solid,
};

const tabs: TabsConfig<FlashyTabBarItemConfig> = {
	Home: {
		labelStyle: {
			color: tabColours.HOME,
		},
		icon: {
			component: () => <Feather name='home' size={20} color={tabColours.HOME} />,
			color: tabColours.HOME,
		},
	},
	Calendar: {
		labelStyle: {
			color: tabColours.CALENDAR,
		},
		icon: {
			component: () => <Feather name='calendar' size={20} color={tabColours.CALENDAR} />,
			color: tabColours.CALENDAR,
		},
	},
	Trends: {
		labelStyle: {
			color: tabColours.TRENDS,
		},
		icon: {
			component: () => <Entypo name='line-graph' size={20} color={tabColours.TRENDS} />,
			color: tabColours.TRENDS,
		},
	},
	Awards: {
		labelStyle: {
			color: tabColours.AWARDS,
		},
		icon: {
			component: () => <Feather name='award' size={20} color={tabColours.AWARDS} />,
			color: tabColours.AWARDS,
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

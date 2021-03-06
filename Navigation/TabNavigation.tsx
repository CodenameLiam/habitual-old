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
import { AppNavProps, AppStackParamList } from './AppNavigation';
import TrendsScreen from '../Screens/Trends';
import AwardsScreen from '../Screens/AwardsScreen';
import { GradientColours, TabColours } from '../Styles/Colours';
import { color } from 'react-native-reanimated';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export type TabParamList = {
	Home: undefined;
	Calendar: undefined;
	Trends: undefined;
	Awards: undefined;
};

const Tab = createBottomTabNavigator();

// export type TabRouteProps = RouteProp<AppStackParamList, 'Tabs'>;

interface AppProps {
	navigation: AppNavProps;
	route: any;
}

export default function TabNavigation({ navigation, route }: AppProps) {
	const { colors } = useTheme();

	useLayoutEffect(() => {
		navigation.setOptions({ headerTitle: getHeaderTitle(route) });
	}, [navigation, route]);

	const tabs: TabsConfig<FlashyTabBarItemConfig> = {
		Home: {
			labelStyle: {
				color: TabColours.HOME,
			},
			icon: {
				component: () => <Feather name='home' size={20} color={colors.text} />,
				color: TabColours.HOME,
			},
		},
		Calendar: {
			labelStyle: {
				color: TabColours.CALENDAR,
			},
			icon: {
				component: () => <Feather name='calendar' size={20} color={colors.text} />,
				color: TabColours.CALENDAR,
			},
		},
		Trends: {
			labelStyle: {
				color: TabColours.TRENDS,
			},
			icon: {
				component: () => <Entypo name='line-graph' size={20} color={colors.text} />,
				color: TabColours.TRENDS,
			},
		},
		Awards: {
			labelStyle: {
				color: TabColours.AWARDS,
			},
			icon: {
				component: () => <Feather name='award' size={20} color={colors.text} />,
				color: TabColours.AWARDS,
			},
		},
	};

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
			<Tab.Screen name='Home' component={HomeScreen} />
			<Tab.Screen name='Calendar' component={CalendarSreen} />
			<Tab.Screen name='Trends' component={TrendsScreen} />
			<Tab.Screen name='Awards' component={AwardsScreen} />
		</Tab.Navigator>
	);
}

// const TabColours = {
// 	HOME: GradientColours.PEACH.solid,
// 	CALENDAR: GradientColours.PEACH.solid,
// 	TRENDS: GradientColours.PEACH.solid,
// 	AWARDS: GradientColours.PEACH.solid,
// };

const getHeaderTitle = (route: RouteProp<TabParamList, 'Home'>) => {
	const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';

	switch (routeName) {
		case 'Trends':
			return 'Trends';
		case 'Awards':
			return 'Awards';
	}
};

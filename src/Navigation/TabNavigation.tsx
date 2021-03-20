import {
    getFocusedRouteNameFromRoute,
    RouteProp,
    useTheme
} from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import AnimatedTabBar, { TabsConfig, FlashyTabBarItemConfig } from '@gorhom/animated-tabbar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather, Entypo } from '@expo/vector-icons';

import { AppNavProps } from 'Navigation/AppNavigation';
import TrendsScreen from 'Screens/Trends';
import AwardsScreen from 'Screens/Awards';
import CalendarScreen from 'Screens/Calendar';
import { TabColours } from 'Styles/Colours';
import { StyleSheet } from 'react-native';
import HomeScreen from 'Screens/Home';

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

export default function TabNavigation ({ navigation, route }: AppProps) {
    const { colors } = useTheme();

    useLayoutEffect(() => {
        navigation.setOptions({ headerTitle: getHeaderTitle(route) });
    }, [navigation, route]);

    const tabs: TabsConfig<FlashyTabBarItemConfig> = {
        Home: {
            labelStyle: {
                color: TabColours.HOME,
                fontFamily: 'Montserrat_700Bold'
            },
            icon: {
                component: () => <Feather name='home' size={20} color={colors.text} />,
                color: TabColours.HOME
            }
        },
        Calendar: {
            labelStyle: {
                color: TabColours.CALENDAR,
                fontFamily: 'Montserrat_700Bold'
            },
            icon: {
                component: () => <Feather name='calendar' size={20} color={colors.text} />,
                color: TabColours.CALENDAR
            }
        },
        Trends: {
            labelStyle: {
                color: TabColours.TRENDS,
                fontFamily: 'Montserrat_700Bold'
            },
            icon: {
                component: () => <Entypo name='line-graph' size={20} color={colors.text} />,
                color: TabColours.TRENDS
            }
        },
        Awards: {
            labelStyle: {
                color: TabColours.AWARDS,
                fontFamily: 'Montserrat_700Bold'
            },
            icon: {
                component: () => <Feather name='award' size={20} color={colors.text} />,
                color: TabColours.AWARDS
            }
        }
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
            <Tab.Screen name='Calendar' component={CalendarScreen} />
            <Tab.Screen name='Trends' component={TrendsScreen} />
            <Tab.Screen name='Awards' component={AwardsScreen} />
        </Tab.Navigator>
    );
}

const getHeaderTitle = (route: RouteProp<TabParamList, 'Home'>) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';

    switch (routeName) {
        case 'Calendar':
            return 'Calendar';
        case 'Trends':
            return 'Trends';
        case 'Awards':
            return 'Awards';
    }
};

const styles = StyleSheet.create({
    label: { fontFamily: 'Montserrat_600SemiBold' }
});

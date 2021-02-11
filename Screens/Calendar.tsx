import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { TabParamList } from '../Navigation/TabNavigation';

type NavProps = BottomTabNavigationProp<TabParamList, 'Calendar'>;
type RouteProps = RouteProp<TabParamList, 'Calendar'>;
interface CalendarProps {
	navigation: NavProps;
	route: RouteProps;
}

export default function Calendar({ navigation, route }: CalendarProps) {
	const [habit, setHabit] = useState('All');

	useFocusEffect(
		useCallback(() => {
			const stackNavigator = navigation.dangerouslyGetParent();
			if (stackNavigator) {
				stackNavigator.setOptions({
					title: habit,
				});
			}
		}, [navigation, habit])
	);

	return (
		<View>
			<Text>Calendar</Text>
			<Text>Looking at {habit}</Text>
			<Button title='Habit 1' onPress={() => setHabit('Habit 1')} />
			<Button title='All' onPress={() => setHabit('All')} />
		</View>
	);
}

import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp, useFocusEffect, useTheme } from '@react-navigation/native';
import moment from 'moment';
import React, { useCallback, useContext, useLayoutEffect, useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import { AppContext } from '../Context/AppContext';
import { TabParamList } from '../Navigation/TabNavigation';
import { GradientColours, GreyColours } from '../Styles/Colours';

type NavProps = BottomTabNavigationProp<TabParamList, 'Calendar'>;
type RouteProps = RouteProp<TabParamList, 'Calendar'>;
interface CalendarProps {
	navigation: NavProps;
	route: RouteProps;
}

type dateRange = 'Weekly' | 'Monthly' | 'Yearly';

export default function CalendarScreen({ navigation, route }: CalendarProps) {
	const { colors } = useTheme();
	const { habits, updateHabit } = useContext(AppContext);
	const [range, setRange] = useState<dateRange>('Weekly');

	const today = moment().format('YYYY-MM-DD');

	useFocusEffect(
		useCallback(() => {
			const stackNavigator = navigation.dangerouslyGetParent();
			if (stackNavigator) {
				stackNavigator.setOptions({
					title: range,
				});
			}
		}, [navigation, range])
	);

	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			{Object.keys(habits).map((id) => {
				const habit = habits[id];
				return (
					<CalendarList
						// key={habits[].gradient}
						key={habit.id}
						horizontal={true}
						pagingEnabled={true}
						maxDate={today}
						// markedDates={markedDates}
						// onDayPress={handlePress}
						markingType={'custom'}
						theme={{
							calendarBackground: colors.background,
							monthTextColor: colors.text,
							dayTextColor: colors.text,
							textDisabledColor: colors.border,
							selectedDayTextColor: colors.text,
							selectedDotColor: colors.text,
							selectedDayBackgroundColor: GradientColours[habit.gradient].solid,
							todayTextColor: GradientColours[habit.gradient].solid,
							dotColor: GradientColours[habit.gradient].solid,
							textMonthFontFamily: 'Montserrat_600SemiBold',
							textDayFontFamily: 'Montserrat_600SemiBold',
							textDayHeaderFontFamily: 'Montserrat_600SemiBold',
							textSectionTitleColor: GreyColours.GREY2,
						}}
					/>
				);
			})}

			{/* <Text>Calendar</Text>
			<Text>Looking at {habit}</Text> */}
			{/* <Button title='Habit 1' onPress={() => setHabit('Habit 1')} />
			<Button title='All' onPress={() => setHabit('All')} /> */}
		</ScrollView>
	);
}

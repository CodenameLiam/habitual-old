import { RouteProp, useFocusEffect, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useContext } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card } from '../Components/Card';
import { AppContext } from '../Context/AppContext';
import { AppStackParamList } from '../Navigation/AppNavigation';
import { EditNavProps, EditRoute } from './EditScreen';

import { CalendarList, DateObject } from 'react-native-calendars';
import moment from 'moment';
import { GradientColours, GreyColours } from '../Styles/Colours';
import { mergeDates } from '../Storage/HabitController';
import { notificationAsync, NotificationFeedbackType } from 'expo-haptics';

export type ViewNavProps = StackNavigationProp<AppStackParamList, 'View'>;
export type ViewRoute = RouteProp<AppStackParamList, 'View'>;

interface EditProps {
	navigation: EditNavProps;
	route: EditRoute;
}

export default function ViewScreen({ navigation, route }: EditProps) {
	const { colors } = useTheme();
	const { habits, updateHabit } = useContext(AppContext);
	const { id } = route.params;
	const habit = habits[id];

	const today = moment().format('YYYY-MM-DD');

	useFocusEffect(
		useCallback(() => {
			navigation.setOptions({ title: habit.name });
		}, [navigation, habit.name])
	);

	let markedDates = Object.assign(
		{},
		...Object.keys(habit.dates)
			.filter((date) => habit.dates[date] === habit.progressTotal)
			.map((date) => ({ [date]: { selected: true } }))
	);
	markedDates[today] = { ...markedDates[today], marked: true };

	const handlePress = (day: DateObject) => {
		const date = habit.dates[day.dateString];
		const newProgress = date ? 0 : habit.progressTotal;

		updateHabit({ ...habit, dates: mergeDates(habit.dates, day.dateString, newProgress) });
		notificationAsync(NotificationFeedbackType.Success);
	};

	return (
		<ScrollView contentContainerStyle={{ flex: 1 }}>
			<CalendarList
				key={habit.gradient}
				horizontal={true}
				pagingEnabled={true}
				maxDate={today}
				markedDates={markedDates}
				onDayPress={handlePress}
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
		</ScrollView>
	);
}

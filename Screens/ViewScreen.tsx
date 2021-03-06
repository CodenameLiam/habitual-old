import { RouteProp, useFocusEffect, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useContext } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card } from '../Components/Card';
import { AppContext } from '../Context/AppContext';
import { AppStackParamList } from '../Navigation/AppNavigation';
import { EditNavProps, EditRoute } from './EditScreen';
import CalendarStrip from 'react-native-calendar-strip';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

export type ViewNavProps = StackNavigationProp<AppStackParamList, 'View'>;
export type ViewRoute = RouteProp<AppStackParamList, 'View'>;

interface EditProps {
	navigation: EditNavProps;
	route: EditRoute;
}

export default function ViewScreen({ navigation, route }: EditProps) {
	const { colors } = useTheme();
	const { habits } = useContext(AppContext);
	const { id } = route.params;

	console.log(habits[id].name);

	useFocusEffect(
		useCallback(() => {
			navigation.setOptions({ title: habits[id].name });
		}, [navigation, habits[id].name])
	);

	return (
		<ScrollView contentContainerStyle={{ flex: 1 }}>
			<CalendarList
				horizontal={true}
				pagingEnabled={true}
				theme={{
					calendarBackground: colors.card,
					monthTextColor: colors.text,
					dayTextColor: colors.text,
					textMonthFontFamily: 'Montserrat_600SemiBold',
					textDayFontFamily: 'Montserrat_600SemiBold',
					textDayHeaderFontFamily: 'Montserrat_600SemiBold',
				}}
			/>
		</ScrollView>
	);
}

import { RouteProp, useFocusEffect, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card } from '../Components/Card';
import { AppContext } from '../Context/AppContext';
import { AppStackParamList } from '../Navigation/AppNavigation';
import { EditNavProps, EditRoute } from './EditScreen';

import { CalendarList, DateObject } from 'react-native-calendars';
import moment from 'moment';
import { GradientColours, GradientType, GreyColours } from '../Styles/Colours';
import { mergeDates } from '../Storage/HabitController';
import {
	impactAsync,
	ImpactFeedbackStyle,
	notificationAsync,
	NotificationFeedbackType,
} from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientContext } from '../Context/GradientContext';

export type ViewNavProps = StackNavigationProp<AppStackParamList, 'View'>;
export type ViewRoute = RouteProp<AppStackParamList, 'View'>;

interface EditProps {
	navigation: EditNavProps;
	route: EditRoute;
}

export default function ViewScreen({ navigation, route }: EditProps) {
	const { colors } = useTheme();
	const { habits, updateHabit } = useContext(AppContext);
	const { gradient } = useContext(GradientContext);
	const { id } = route.params;
	const habit = habits[id];

	const today = moment().format('YYYY-MM-DD');

	const prevGradient = useRef<GradientType>();

	useEffect(() => {
		// prevGradient.current = gradient;
		// if (prevGradient.current !== gradient) {
		// 	navigation.setOptions({
		// 		headerBackground: () => (
		// 			<LinearGradient
		// 				colors={[GradientColours[gradient].start, GradientColours[gradient].end]}
		// 				style={StyleSheet.absoluteFill}
		// 				start={{ x: 0, y: 0 }}
		// 				end={{ x: 1, y: 0 }}
		// 			/>
		// 		),
		// 	});
		// }
		// console.log(prevGradient);
		console.log(gradient);
	}, [gradient]);

	// useFocusEffect(
	// 	useCallback(() => {
	//
	// 	}, [gradient])
	// );

	useFocusEffect(
		useCallback(() => {
			navigation.setOptions({
				title: habit.name,
			});
			// setTimeout(() => setGradient(habit.gradient), 100);
		}, [navigation, habit.name])
	);

	let markedDates = Object.assign(
		{},
		...Object.keys(habit.dates)
			.filter((date) => habit.dates[date].progress === habit.dates[date].progressTotal)
			.map((date) => ({
				[date]: { selected: true, customStyles: { container: { borderRadius: 10 } } },
			}))
	);
	markedDates[today] = { ...markedDates[today], marked: true };

	const handlePress = (day: DateObject) => {
		const date = habit.dates[day.dateString];
		const newProgress = date && date.progress === date.progressTotal ? 0 : habit.progressTotal;

		updateHabit({
			...habit,
			dates: mergeDates(habit.dates, day.dateString, newProgress, habit.progressTotal),
		});
		notificationAsync(NotificationFeedbackType.Success);
	};

	return (
		<View style={{ flex: 1 }}>
			<LinearGradient
				colors={[
					GradientColours[habit.gradient].start,
					GradientColours[habit.gradient].end,
				]}
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: Dimensions.get('screen').height / 3,
				}}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
			/>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={{ height: 40 }}>
					<Text>Yeet</Text>
				</View>

				<CalendarList
					key={habit.gradient}
					horizontal={true}
					pagingEnabled={true}
					maxDate={today}
					markedDates={markedDates}
					onDayPress={handlePress}
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

				<View style={{ backgroundColor: colors.background }}>
					{/* <Text style={styles.paragraph}>This is a ScrollView example HEADER.</Text>
					<Text style={styles.paragraph}>This is a ScrollView example paragraph.</Text>
					<Text style={styles.paragraph}>This is a ScrollView example paragraph.</Text>
					<Text style={styles.paragraph}>This is a ScrollView example paragraph.</Text>
					<Text style={styles.paragraph}>This is a ScrollView example paragraph.</Text>
					<Text style={styles.paragraph}>This is a ScrollView example paragraph.</Text>
					<Text style={styles.paragraph}>This is a ScrollView example paragraph.</Text>
					<Text style={styles.paragraph}>This is a ScrollView example paragraph.</Text>
					<Text style={styles.paragraph}>This is a ScrollView example paragraph.</Text>
					<Text style={styles.paragraph}>This is a ScrollView example FOOTER.</Text> */}
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	paragraph: {
		margin: 24,
		fontSize: 18,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	scrollView: {
		height: '20%',
		width: '80%',
		margin: 20,
		alignSelf: 'center',
		padding: 20,
		borderWidth: 5,
		borderRadius: 5,
		borderColor: 'black',
		backgroundColor: 'lightblue',
	},
	contentContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'lightgrey',
		paddingBottom: 50,
	},
});

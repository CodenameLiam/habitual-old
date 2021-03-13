import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp, useFocusEffect, useTheme } from '@react-navigation/native';

import { notificationAsync, NotificationFeedbackType } from 'expo-haptics';
import moment from 'moment';
import React, { useCallback, useContext, useLayoutEffect, useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import { TouchableOpacity } from 'react-native-gesture-handler';
import TextTicker from 'react-native-text-ticker';
import { ColourButtonGroup } from '../Components/ColourButtonGroup';
import Icon from '../Components/Icon';
import {
	DEFAULT_SCHEDULE,
	Scheduler,
	ScheduleType,
	ScheduleTypeValue,
} from '../Components/Scheduler';
import { AppContext } from '../Context/AppContext';
import { GradientContext } from '../Context/GradientContext';
import { TabParamList } from '../Navigation/TabNavigation';
import { IHabit, mergeDates } from '../Storage/HabitController';
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
	const { colour } = useContext(GradientContext);

	const [range, setRange] = useState<dateRange>('Weekly');
	const [weekIndex, setWeekIndex] = useState<number>(1);

	const today = moment().format('YYYY-MM-DD');

	// useFocusEffect(
	// 	useCallback(() => {
	// 		const stackNavigator = navigation.dangerouslyGetParent();
	// 		if (stackNavigator) {
	// 			stackNavigator.setOptions({
	// 				title: range,
	// 			});
	// 		}
	// 	}, [navigation, range])
	// );

	const renderWeeklyHabits = () => {
		const weeklyCellContainer = Dimensions.get('screen').width / 13.5;
		const weeklyTextContainer = Dimensions.get('screen').width - weeklyCellContainer * 9.5;

		const weekStart = moment().subtract(weekIndex, 'w').startOf('w').add(1, 'd');
		const weekEnd = moment()
			.subtract(weekIndex - 1, 'w')
			.startOf('w')
			.add(1, 'd');

		const styles = StyleSheet.create({
			dayContainer: {
				height: weeklyCellContainer,
				width: weeklyCellContainer,
				margin: 3,
				backgroundColor: colors.card,
				borderRadius: 10,
				justifyContent: 'center',
				alignItems: 'center',
			},
			dayTitle: {
				color: colors.text,
				fontFamily: 'Montserrat_700Bold',
				fontSize: 16,
			},
			weekTitle: {
				color: colors.text,
				fontFamily: 'Montserrat_700Bold',
				fontSize: 18,
				width: '60%',
				textAlign: 'center',
			},
			arrow: {
				width: 25,
				height: 25,
				borderRadius: 5,
				marginRight: 10,
				marginLeft: 10,
				justifyContent: 'center',
				alignItems: 'center',
			},
		});

		const getBackgroundColour = (habit: IHabit, index: number) => {
			const weekStart = moment().subtract(weekIndex, 'w').startOf('w').add(1, 'd');
			const date = weekStart.add(index, 'd').format('YYYY-MM-DD');

			if (habit.dates[date] && habit.dates[date].progress > 0) {
				let progress: number | string =
					habit.dates[date].progress / habit.dates[date].progressTotal;
				progress = (Math.round(progress * 10) / 10) * 100;
				if (progress <= 10) progress = 20;
				if (progress === 100) progress = '';

				return GradientColours[habit.gradient].solid + progress;
			}

			return colors.card;
		};

		const handlePress = (habit: IHabit, index: number) => {
			const weekStart = moment().subtract(weekIndex, 'w').startOf('w').add(1, 'd');
			let date = weekStart.clone().add(index, 'd');

			if (!date.isAfter(moment())) {
				const dateString = date.format('YYYY-MM-DD');

				const newProgress =
					habit.dates[dateString] &&
					habit.dates[dateString].progress >= habit.dates[dateString].progressTotal
						? 0
						: habit.progressTotal;

				updateHabit({
					...habit,
					dates: mergeDates(habit.dates, dateString, newProgress, habit.progressTotal),
				});
				notificationAsync(NotificationFeedbackType.Success);
			}
		};

		return (
			<View style={{ alignItems: 'center' }}>
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						marginBottom: 15,
						alignItems: 'center',
					}}>
					<TouchableOpacity
						onPress={() => setWeekIndex(weekIndex + 1)}
						style={[
							styles.arrow,
							{
								backgroundColor: GradientColours[colour].solid + 50,
							},
						]}>
						<Icon
							family='fontawesome5'
							name='angle-left'
							size={20}
							colour={GradientColours[colour].solid}
						/>
					</TouchableOpacity>
					<Text style={styles.weekTitle}>
						{weekStart.format('MMM Do')} - {weekEnd.format('MMM Do, YYYY')}{' '}
					</Text>
					<TouchableOpacity
						onPress={() => setWeekIndex(weekIndex - 1)}
						style={[
							styles.arrow,
							{
								backgroundColor: GradientColours[colour].solid + 50,
							},
						]}>
						<Icon
							family='fontawesome5'
							name='angle-right'
							size={20}
							colour={GradientColours[colour].solid}
						/>
					</TouchableOpacity>
				</View>
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						marginLeft: weeklyTextContainer,
					}}>
					{Object.keys(DEFAULT_SCHEDULE).map((day) => (
						<View key={day} style={styles.dayContainer}>
							<Text style={styles.dayTitle}>{day[0]}</Text>
						</View>
					))}
				</View>
				<ScrollView>
					{Object.keys(habits).map((id) => {
						const habit = habits[id];
						return (
							<View
								key={id}
								style={{
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'center',
								}}>
								<View style={{ width: weeklyTextContainer, paddingRight: 10 }}>
									<TextTicker
										scroll={false}
										animationType='bounce'
										duration={5000}
										bounceDelay={1500}
										marqueeDelay={1000}
										bouncePadding={{ left: 0, right: 0 }}
										style={[styles.dayTitle]}>
										{habit.name}
									</TextTicker>
								</View>

								{Object.keys(DEFAULT_SCHEDULE).map((day, index) => {
									const schedule = Object.keys(DEFAULT_SCHEDULE);
									const scheduleValue = schedule[index] as ScheduleTypeValue;

									return (
										<TouchableOpacity
											key={day}
											onPress={() => handlePress(habit, index)}
											style={[
												styles.dayContainer,
												{
													backgroundColor: getBackgroundColour(
														habit,
														index
													),
												},
											]}>
											{habit.schedule[scheduleValue] === false && (
												<Icon
													family='fontawesome'
													name='ban'
													size={20}
													colour={colors.background}
												/>
											)}
										</TouchableOpacity>
									);
								})}
							</View>
						);
					})}
				</ScrollView>

				{/* {Object.keys(habits).map((id) => {return <Card></Card>})} */}
			</View>
		);
	};

	const renderSwitch = () => {
		const switchFunctions = [
			() => setRange('Weekly'),
			() => setRange('Monthly'),
			() => setRange('Yearly'),
		];
		return (
			<View style={{ padding: 20, marginBottom: 10 }}>
				<ColourButtonGroup
					buttons={['Weekly', 'Monthly', 'Yearly']}
					buttonFunctions={switchFunctions}
					colour={GradientColours[colour].solid}
					activeTitle={range}
				/>
			</View>
		);
	};

	const renderView = () => {
		switch (range) {
			case 'Weekly':
				return renderWeeklyHabits();
			default:
				return <View></View>;
		}
	};

	return (
		// <ScrollView showsVerticalScrollIndicator={false}>
		<View>
			{renderSwitch()}
			{renderView()}

			{/* {Object.keys(habits).map((id) => {
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
			})} */}

			{/* <Text>Calendar</Text>
			<Text>Looking at {habit}</Text> */}
			{/* <Button title='Habit 1' onPress={() => setHabit('Habit 1')} />
			<Button title='All' onPress={() => setHabit('All')} /> */}
		</View>
		// </ScrollView>
	);
}

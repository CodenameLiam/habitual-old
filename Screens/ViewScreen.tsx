import { RouteProp, useFocusEffect, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
	View,
	Text,
	Dimensions,
	StyleSheet,
	InteractionManager,
	Animated,
	Easing,
	TouchableOpacity,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card } from '../Components/Card';
import { AppContext } from '../Context/AppContext';
import { AppNavProps, AppStackParamList } from '../Navigation/AppNavigation';
import { EditNavProps, EditRoute } from './EditScreen';

import { Calendar, CalendarList, DateObject } from 'react-native-calendars';
import moment from 'moment';
import { GradientColours, GreyColours } from '../Styles/Colours';
import { mergeDates } from '../Storage/HabitController';
import {
	impactAsync,
	ImpactFeedbackStyle,
	notificationAsync,
	NotificationFeedbackType,
} from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientContext } from '../Context/GradientContext';
import Svg, { Circle } from 'react-native-svg';
import { getTimeString } from '../Components/Habit';
import DisplayDay, { dayIndex, days, displayDays } from '../Components/DisplayDay';
import { DEFAULT_SCHEDULE, ScheduleTypeValue } from '../Components/Scheduler';
import Icon from '../Components/Icon';
import { randomGradient } from '../Components/ColourPicker';
import { TimerContext } from '../Context/TimerContext';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

export type ViewNavProps = StackNavigationProp<AppStackParamList, 'View'>;
export type ViewRoute = RouteProp<AppStackParamList, 'View'>;

interface EditProps {
	navigation: EditNavProps;
	route: EditRoute;
}

const yearDates = Array.from(Array(365)).map((value, index) =>
	moment().subtract(364, 'd').add(index, 'd').format('YYYY-MM-DD')
);

export default function ViewScreen({ navigation, route }: EditProps) {
	const { colors } = useTheme();
	const { habits, updateHabit } = useContext(AppContext);
	const { activeTimer, setActiveTimer } = useContext(TimerContext);

	const { id } = route.params;
	const habit = habits[id];
	const { solid: gradientSolid } = GradientColours[habit.gradient];

	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			setIsReady(true);
		});
	}, []);

	const today = moment().format('YYYY-MM-DD');
	const [day, setDay] = useState<ScheduleTypeValue>(days[dayIndex] as ScheduleTypeValue);
	const [date, setDate] = useState<string>(moment().format('YYYY-MM-DD'));
	const allDates = Object.keys(habit.dates);
	const sortedDates = allDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

	const [month, setMonth] = useState(moment().format('YYYY-MM-DD'));

	// console.log('month ' + month);

	const [isTimerActive, setIsTimerActive] = useState(activeTimer == habit.id);
	let interval: NodeJS.Timeout;

	useFocusEffect(
		useCallback(() => {
			navigation.setOptions({
				title: habit.name,
			});
		}, [navigation, habit.name])
	);

	const getDaysToDisable = () => {
		let unselectedDays: number[] = [];

		Object.keys(habit.schedule).filter((schedule, index) => {
			if (!habit.schedule[schedule as ScheduleTypeValue])
				unselectedDays.push((index + 1) % 7);
		});

		return unselectedDays;
	};

	const getDisabledDates = () => {
		let disabledDates: any = {};

		const start = moment(month).clone().startOf('month').subtract(1, 'month');
		const end = moment(month).clone().endOf('month').add(1, 'month');
		const daysToDisable = getDaysToDisable();

		if (daysToDisable.length >= 0) {
			for (let m = moment(start); m.diff(end, 'days') <= 0; m.add(1, 'days')) {
				if (daysToDisable.includes(m.day())) {
					const day = m.format('YYYY-MM-DD');

					disabledDates[day] = {
						...markedDates[day],
						disabled: true,
						disableTouchEvent: true,
					};
				}
			}
		}

		return disabledDates;
	};

	let markedDates = Object.assign(
		{},
		...allDates
			.filter(
				(date) =>
					habit.dates[date] &&
					habit.dates[date].progress >= habit.dates[date].progressTotal
			)
			.map((date) => ({
				[date]: { selected: true, customStyles: { container: { borderRadius: 10 } } },
			}))
	);
	markedDates[today] = { ...markedDates[today], marked: true };
	markedDates = { ...markedDates, ...getDisabledDates() };

	const handlePress = (day: DateObject) => {
		// console.log(day);
		const date = habit.dates[day.dateString];
		const newProgress = date && date.progress >= date.progressTotal ? 0 : habit.progressTotal;

		updateHabit({
			...habit,
			dates: mergeDates(habit.dates, day.dateString, newProgress, habit.progressTotal),
		});
		notificationAsync(NotificationFeedbackType.Success);
	};

	const getAlphaValue = (index: number) => {
		const date = moment()
			.subtract(6 - index, 'd')
			.format('YYYY-MM-DD');

		return habit.dates[date]
			? habit.dates[date].progress >= habit.progressTotal
				? 0
				: 1 - habit.dates[date].progress / habit.progressTotal
			: 1;
	};

	const getDateAlphaValue = () => {
		return habit.dates[date]
			? habit.dates[date].progress >= habit.progressTotal
				? 0
				: 1 - habit.dates[date].progress / habit.progressTotal
			: 1;
	};

	const getYearAlphaValue = (day: string) => {
		let value: number | string = habit.dates[day]
			? habit.dates[day].progress >= habit.dates[day].progressTotal
				? 1
				: habit.dates[day].progress / habit.dates[day].progressTotal
			: 1;

		value = (Math.round(value * 10) / 10) * 100;
		if (value <= 10) value = 20;
		if (value === 100) value = '';

		return value;
	};

	const dimension = Dimensions.get('screen').width - 50;
	const radius = dimension / 2 - 15;
	const circumference = radius * 2 * Math.PI;
	const alpha = getDateAlphaValue();

	const progressAnimation = useRef(new Animated.Value(activeTimer ? alpha : 1)).current;
	const interpolatedSize = progressAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: [0, radius * Math.PI * 2],
	});

	const animateProgress = () => {
		Animated.timing(progressAnimation, {
			toValue: alpha,
			duration: isTimerActive ? 1200 : 500,
			useNativeDriver: true,
			easing: isTimerActive ? Easing.linear : Easing.out(Easing.quad),
		}).start();
	};

	const AnimatedCircle = Animated.createAnimatedComponent(Circle);

	let progressTotal =
		habit.type === 'timer' ? getTimeString(habit.progressTotal) : habit.progressTotal;

	const getProgress = (): number => {
		return habit.dates[date] ? habit.dates[date].progress : 0;
	};

	const getProgressString = () => {
		return habit.type === 'timer' ? getTimeString(progress) : progress;
	};

	const [progress, setProgress] = useState(getProgress());

	useEffect(() => {
		animateProgress();
		// if (alpha === 0) {
		// 	console.log('All complete');
		// }
	}, [alpha]);

	useEffect(() => {
		updateHabit({
			...habit,
			dates: mergeDates(habit.dates, date, progress, habit.progressTotal),
		});
		isTimerActive && incrementTimer();

		return () => {
			clearInterval(interval);
		};
	}, [progress, isTimerActive]);

	useEffect(() => {
		habit.dates[date] && setProgress(habit.dates[date].progress);
	}, [habit.dates[date]]);

	useEffect(() => {
		setActiveTimer(isTimerActive ? habit.id : undefined);
	}, [isTimerActive]);

	const incrementTimer = () => {
		if (progress == habit.progressTotal) {
			setIsTimerActive(false);
			notificationAsync(NotificationFeedbackType.Success);
		}

		if (isTimerActive && habit.type == 'timer') {
			interval = setInterval(() => {
				setProgress(progress + 1);
				// debounceUpdateHabit();
			}, 1000);
		}
	};

	const handleDayChange = (day: ScheduleTypeValue, index: number) => {
		const dayString = moment().subtract(index, 'd').format('YYYY-MM-DD');
		setDay(day);
		setDate(dayString);
		setProgress(habit.dates[dayString] ? habit.dates[dayString].progress : 0);
	};

	const addProgress = () => {
		// animateProgress();

		setProgress(progress + 1);
		progress + 1 == habit.progressTotal
			? notificationAsync(NotificationFeedbackType.Success)
			: impactAsync(ImpactFeedbackStyle.Medium);
		// debounceUpdateHabit();
		// Animated.timing(progressAnimation, {
		// 	toValue: 1 - progress / 10,
		// 	duration: isTimerActive ? 1200 : 500,
		// 	useNativeDriver: true,
		// 	easing: isTimerActive ? Easing.linear : Easing.out(Easing.quad),
		// }).start();
	};

	const removeProgress = () => {
		setProgress(progress - 1);
		// debounceUpdateHabit();
	};

	const completeHabit = () => {
		progress < progressTotal && notificationAsync(NotificationFeedbackType.Success);
		setProgress(progress >= habit.progressTotal ? 0 : habit.progressTotal);
		setIsTimerActive(false);
		// debounceUpdateHabit();
	};

	const toggleTimer = () => {
		if (progress < habit.progressTotal) {
			setIsTimerActive(!isTimerActive);
			impactAsync(ImpactFeedbackStyle.Medium);
		}
	};

	const yearlyDateDimensions = (Dimensions.get('screen').width - 60) / 53 - 1;

	const getCurrentStreak = (date: string) => {
		let currentStreak = 0;
		let dayPointerIndex = 0;
		let dayPointer = moment(date)
			.subtract(dayPointerIndex + 1, 'd')
			.format('YYYY-MM-DD');

		let dayIndex = moment(dayPointer).subtract(1, 'd').day();

		// console.log('\n\n\n');
		// console.log('ASHASHAS');
		// console.log(dayPointer);
		// console.log(displayDays[dayIndex]);
		// console.log(habit.schedule[displayDays[dayIndex] as ScheduleTypeValue]);

		do {
			if (
				habit.dates[dayPointer] &&
				habit.dates[dayPointer].progress >= habit.dates[dayPointer].progressTotal
			) {
				currentStreak++;
			}
			dayPointerIndex++;
			dayPointer = moment(date)
				.subtract(dayPointerIndex + 1, 'd')
				.format('YYYY-MM-DD');

			dayIndex = moment(dayPointer).subtract(1, 'd').day();

			// console.log(dayPointer);
			// console.log(displayDays[dayIndex]);
			// console.log(habit.schedule[displayDays[dayIndex] as ScheduleTypeValue]);
		} while (
			(habit.dates[dayPointer] &&
				habit.dates[dayPointer].progress >= habit.dates[dayPointer].progressTotal) ||
			habit.schedule[displayDays[dayIndex] as ScheduleTypeValue] === false
		);

		if (
			(habit.dates[date] && habit.dates[date].progress >= habit.dates[date].progressTotal) ||
			habit.schedule[displayDays[dayIndex] as ScheduleTypeValue] === false
		) {
			currentStreak++;
		}

		return { currentStreak, dayPointer };
	};

	const getHighestStreak = () => {
		let highestStreak = 0;

		if (sortedDates.length > 0) {
			let dayPointer = today;
			let streak = getCurrentStreak(dayPointer);

			if (streak.currentStreak > highestStreak) {
				highestStreak = streak.currentStreak;
			}
			dayPointer = streak.dayPointer;

			do {
				do {
					dayPointer = moment(dayPointer).subtract(1, 'd').format('YYYY-MM-DD');
				} while (
					habit.dates[dayPointer] &&
					habit.dates[dayPointer].progress < habit.dates[dayPointer].progressTotal
				);

				let streak = getCurrentStreak(dayPointer);
				dayPointer = streak.dayPointer;

				if (streak.currentStreak > highestStreak) {
					highestStreak = streak.currentStreak;
				}
			} while (new Date(dayPointer).getTime() >= new Date(sortedDates[0]).getTime());
		}

		return highestStreak;
	};

	const getTotalComplete = () => {
		return Object.keys(markedDates).filter((date) => markedDates[date].selected == true).length;
	};

	const getCompletionRate = () => {
		const startDate = moment(sortedDates[0]);

		const daysToDisable = getDaysToDisable();

		let completedDays = getTotalComplete();
		let totalDays = moment().add(1, 'd').diff(startDate, 'd');

		if (totalDays == 0) {
			totalDays = 1;
		}

		if (completedDays > 0) {
			for (let m = startDate.clone(); m.diff(moment()) <= 0; m.add(1, 'days')) {
				if (daysToDisable.includes(m.day())) {
					console.log(m.format('YYYY-MM-DD'));
					completedDays++;
				}
			}
		}

		// console.log('complete ' + completedDays);
		// console.log('total ' + totalDays);

		// @ts-ignore
		// const test = extra().weekdayCalc('1 Apr 2015', '31 Mar 2016', [0, 1, 2, 3, 4, 5, 6]);

		// console.log(test);

		// let unselectedDays = Object.keys(habit.schedule).filter((schedule) => {
		// 	return !habit.schedule[schedule as ScheduleTypeValue];
		// 	// unselectedDays.push((index + 1) % 7);
		// }).length;

		// completedDays += Math.ceil(totalDays / 7) * unselectedDays;

		// console.log(test);

		// console.log(moment().day());

		// console.log(6 - dayIndex);

		// console.log(sortedDates[0]);
		// console.log(totalDays);
		// console.log(completedDays);

		const completionRate = (completedDays / totalDays) * 100;

		return Math.round(completionRate * 10) / 10;
	};

	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					padding: 20,
					paddingBottom: 0,
				}}>
				{displayDays.map((displayDay, index) => (
					<DisplayDay
						key={displayDay + index}
						alpha={getAlphaValue(index)}
						selectedDay={day}
						displayDay={displayDay as ScheduleTypeValue}
						displayIndex={index}
						gradient={habit.gradient}
						handleDayChange={handleDayChange}
					/>
				))}
			</View>

			<View
				style={{
					backgroundColor: colors.background,
					height: Dimensions.get('screen').width,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}>
				<Text
					style={{
						fontFamily: 'Montserrat_800ExtraBold',
						fontSize: 30,
						color: colors.text,
					}}>
					{getProgressString()} / {progressTotal}
				</Text>
				<Svg
					width={dimension}
					height={dimension}
					style={{
						position: 'absolute',
					}}>
					<Circle
						stroke={GradientColours[habit.gradient].solid + '50'}
						cx={dimension / 2}
						cy={dimension / 2}
						r={radius}
						strokeWidth={20}
					/>
				</Svg>
				<Svg
					width={dimension}
					height={dimension}
					style={{
						position: 'absolute',
						transform: [{ rotate: '-90deg' }],
					}}>
					<AnimatedCircle
						stroke={GradientColours[habit.gradient].solid}
						cx={dimension / 2}
						cy={dimension / 2}
						r={radius}
						strokeWidth={20}
						strokeLinecap={'round'}
						strokeDashoffset={interpolatedSize}
						strokeDasharray={[circumference, circumference]}
					/>
				</Svg>
			</View>

			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					marginBottom: 20,
				}}>
				{habit.type === 'count' && (
					<React.Fragment>
						<TouchableOpacity
							onPress={() => progress > 0 && removeProgress()}
							style={[
								styles.count,
								{
									marginRight: 10,
									backgroundColor:
										Number(progress) > 0
											? gradientSolid + 50
											: GreyColours.GREY2 + 50,
								},
							]}>
							<Icon
								family='fontawesome'
								name='minus'
								size={24}
								colour={Number(progress) > 0 ? gradientSolid : GreyColours.GREY2}
							/>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={addProgress}
							style={[
								styles.count,
								{
									marginRight: 10,
									backgroundColor: gradientSolid + 50,
								},
							]}>
							<Icon
								family='fontawesome'
								name='plus'
								size={24}
								colour={gradientSolid}
							/>
						</TouchableOpacity>
					</React.Fragment>
				)}
				{habit.type === 'timer' && (
					<TouchableOpacity
						onPress={toggleTimer}
						style={[
							styles.count,
							{
								marginRight: 10,
								backgroundColor: gradientSolid + 50,
							},
						]}>
						<Icon
							family='antdesign'
							name='clockcircle'
							size={24}
							colour={gradientSolid}
						/>
					</TouchableOpacity>
				)}
				<TouchableOpacity
					onPress={completeHabit}
					style={[
						styles.count,
						{
							backgroundColor: gradientSolid + 50,
						},
					]}>
					<Icon family='fontawesome' name='check' size={24} colour={gradientSolid} />
				</TouchableOpacity>
			</View>

			<Text
				style={{
					fontFamily: 'Montserrat_600SemiBold',
					fontSize: 20,
					padding: 15,
					textAlign: 'center',
					color: colors.text,
				}}>
				Yearly Progress
			</Text>
			<View style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
				<View
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						height: 7 * 7,
					}}>
					{yearDates.map((day, index) => {
						return (
							<View
								key={index + day}
								style={{
									height: yearlyDateDimensions,
									width: yearlyDateDimensions,
									backgroundColor:
										habit.dates[day] && habit.dates[day].progress > 0
											? GradientColours[habit.gradient].solid +
											  getYearAlphaValue(day)
											: colors.border,
									margin: 0.8,
									borderRadius: 1,
								}}
							/>
						);
					})}
				</View>
			</View>

			<Text
				style={{
					fontFamily: 'Montserrat_600SemiBold',
					fontSize: 20,
					padding: 15,
					textAlign: 'center',
					color: colors.text,
				}}>
				Stats
			</Text>

			<View style={{ display: 'flex', flexDirection: 'row', marginRight: 15 }}>
				<Card
					title='Current Streak'
					themeText={true}
					style={{ ...styles.statCard, marginTop: 0 }}>
					<View
						style={[
							styles.statBar,
							{
								backgroundColor: GradientColours[habit.gradient].solid,
							},
						]}
					/>
					<View style={styles.statIconContainer}>
						<Icon family='fontawesome5' name='fire' colour={colors.text} size={30} />
						<Text
							style={[
								styles.statIconText,
								{
									color: colors.text,
								},
							]}>
							{isReady && getCurrentStreak(today).currentStreak}
						</Text>
					</View>
				</Card>
				<Card
					title='Highest Streak'
					themeText={true}
					style={{ ...styles.statCard, marginTop: 0 }}>
					<View
						style={[
							styles.statBar,
							{
								backgroundColor: GradientColours[habit.gradient].solid,
							},
						]}
					/>
					<View style={styles.statIconContainer}>
						<Icon family='fontawesome5' name='crown' colour={colors.text} size={30} />
						<Text
							style={[
								styles.statIconText,
								{
									color: colors.text,
								},
							]}>
							{isReady && getHighestStreak()}
						</Text>
					</View>
				</Card>
			</View>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					marginRight: 15,
					marginBottom: 15,
				}}>
				<Card title='Total Complete' themeText={true} style={styles.statCard}>
					<View
						style={[
							styles.statBar,
							{
								backgroundColor: GradientColours[habit.gradient].solid,
							},
						]}
					/>
					<View style={styles.statIconContainer}>
						<Icon family='fontawesome5' name='check' colour={colors.text} size={30} />
						<Text
							style={[
								styles.statIconText,
								{
									color: colors.text,
								},
							]}>
							{isReady && getTotalComplete()}
						</Text>
					</View>
				</Card>
				<Card title='Completion Rate' themeText={true} style={styles.statCard}>
					<View
						style={[
							styles.statBar,
							{
								backgroundColor: GradientColours[habit.gradient].solid,
							},
						]}
					/>
					<View style={styles.statIconContainer}>
						<Icon
							family='fontawesome5'
							name='percentage'
							colour={colors.text}
							size={30}
						/>
						<Text
							style={[
								styles.statIconText,
								{
									color: colors.text,
								},
							]}>
							{isReady && getCompletionRate()}
						</Text>
					</View>
				</Card>
			</View>

			{isReady && (
				<CalendarList
					key={habit.gradient}
					horizontal={true}
					pagingEnabled={true}
					maxDate={today}
					markedDates={markedDates}
					onDayPress={handlePress}
					markingType={'custom'}
					firstDay={1}
					onVisibleMonthsChange={(months: DateObject[]) => setMonth(months[0].dateString)}
					// onMonthChange={}
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
			)}

			<TouchableOpacity
				style={{ padding: 30 }}
				onPress={() => updateHabit({ ...habit, dates: {} })}>
				<Text style={{ color: 'red' }}>Reset</Text>
			</TouchableOpacity>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	count: {
		height: 45,
		width: 45,
		borderRadius: 5,
		overflow: 'hidden',
		justifyContent: 'center',
		alignItems: 'center',
	},
	statBar: {
		position: 'absolute',
		width: 10,
		top: 0,
		bottom: 0,
		left: 0,
	},
	statCard: {
		flex: 1,
		marginRight: 0,
		overflow: 'hidden',
		alignItems: 'center',
	},
	statIconContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		padding: 5,
	},
	statIconText: {
		fontFamily: 'Montserrat_600SemiBold',
		fontSize: 30,
		paddingLeft: 15,
		textAlign: 'center',
	},

	// paragraph: {
	// 	margin: 24,
	// 	fontSize: 18,
	// 	fontWeight: 'bold',
	// 	textAlign: 'center',
	// },
	// scrollView: {
	// 	height: '20%',
	// 	width: '80%',
	// 	margin: 20,
	// 	alignSelf: 'center',
	// 	padding: 20,
	// 	borderWidth: 5,
	// 	borderRadius: 5,
	// 	borderColor: 'black',
	// 	backgroundColor: 'lightblue',
	// },
	// contentContainer: {
	// 	justifyContent: 'center',
	// 	alignItems: 'center',
	// 	backgroundColor: 'lightgrey',
	// 	paddingBottom: 50,
	// },
});

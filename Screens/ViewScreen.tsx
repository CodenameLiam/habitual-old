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

import { CalendarList, DateObject } from 'react-native-calendars';
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
import { ScheduleTypeValue } from '../Components/Scheduler';
import Icon from '../Components/Icon';
import { randomGradient } from '../Components/ColourPicker';
import { TimerContext } from '../Context/TimerContext';

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

	// console.log(habit.dates[date].progress);

	// console.log(activeTimer);

	const [isTimerActive, setIsTimerActive] = useState(activeTimer == habit.id);
	let interval: NodeJS.Timeout;

	useFocusEffect(
		useCallback(() => {
			navigation.setOptions({
				title: habit.name,
			});
		}, [navigation, habit.name])
	);

	let markedDates = Object.assign(
		{},
		...allDates
			.filter((date) => habit.dates[date].progress >= habit.dates[date].progressTotal)
			.map((date) => ({
				[date]: { selected: true, customStyles: { container: { borderRadius: 10 } } },
			}))
	);
	markedDates[today] = { ...markedDates[today], marked: true };

	const handlePress = (day: DateObject) => {
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
		``;
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

	useEffect(() => {
		animateProgress();
		// if (alpha === 0) {
		// 	console.log('All complete');
		// }
	}, [alpha]);

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
		setProgress(habit.dates[date].progress);
	}, [habit.dates[date].progress]);

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
		progress + 1 == habit.progressTotal
			? notificationAsync(NotificationFeedbackType.Success)
			: impactAsync(ImpactFeedbackStyle.Medium);
		setProgress(progress + 1);
	};

	const removeProgress = () => {
		setProgress(progress - 1);
	};

	const completeHabit = () => {
		progress == 0 && notificationAsync(NotificationFeedbackType.Success);
		setProgress(progress >= habit.progressTotal ? 0 : habit.progressTotal);
		setIsTimerActive(false);
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
		let dayPointer = moment(date)
			.subtract(currentStreak + 1, 'd')
			.format('YYYY-MM-DD');

		do {
			if (
				habit.dates[dayPointer] &&
				habit.dates[dayPointer].progress >= habit.dates[dayPointer].progressTotal
			) {
				currentStreak++;
			}
			dayPointer = moment(date)
				.subtract(currentStreak + 1, 'd')
				.format('YYYY-MM-DD');
		} while (
			habit.dates[dayPointer] &&
			habit.dates[dayPointer].progress >= habit.dates[dayPointer].progressTotal
		);

		if (habit.dates[date] && habit.dates[date].progress >= habit.dates[date].progressTotal) {
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

	const getCompletionRate = () => {
		const startDate = moment(sortedDates[0]);
		const totalDays = moment().diff(startDate, 'd') + 1;
		const completedDays = Object.keys(markedDates).length;
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
						key={index}
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
					{yearDates.map((day) => {
						return (
							<View
								key={day}
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
							{getCurrentStreak(today).currentStreak}
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
							{getHighestStreak()}
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
							{Object.keys(markedDates).length}
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
							{getCompletionRate()}
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

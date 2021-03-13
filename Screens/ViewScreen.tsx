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

export default function ViewScreen({ navigation, route }: EditProps) {
	const { colors } = useTheme();
	const { habits, updateHabit } = useContext(AppContext);
	const { activeTimer, setActiveTimer } = useContext(TimerContext);

	const rootNavigation: AppNavProps = navigation.dangerouslyGetParent();

	// const { gradient } = useContext(GradientContext);
	const { id } = route.params;
	const habit = habits[id];
	const { solid: gradientSolid, start: gradientStart, end: gradientEnd } = GradientColours[
		habit.gradient
	];

	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			setIsReady(true);
		});
	}, []);

	const today = moment().format('YYYY-MM-DD');
	const [day, setDay] = useState<ScheduleTypeValue>(days[dayIndex] as ScheduleTypeValue);
	const [date, setDate] = useState<string>(moment().format('YYYY-MM-DD'));

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
		...Object.keys(habit.dates)
			.filter((date) => habit.dates[date].progress >= habit.dates[date].progressTotal)
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

	const dimension = Dimensions.get('window').width - 50;
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

			<View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
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

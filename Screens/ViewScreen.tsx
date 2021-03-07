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
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card } from '../Components/Card';
import { AppContext } from '../Context/AppContext';
import { AppStackParamList } from '../Navigation/AppNavigation';
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

	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			setIsReady(true);
		});
	}, []);

	const today = moment().format('YYYY-MM-DD');

	useFocusEffect(
		useCallback(() => {
			navigation.setOptions({ title: habit.name });
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

	const dimension = Dimensions.get('window').width - 50;
	const radius = dimension / 2 - 15;
	const circumference = radius * 2 * Math.PI;
	const alpha = habit.dates[today] ? 1 - habit.dates[today].progress / habit.progressTotal : 1;

	const progressAnimation = useRef(new Animated.Value(1)).current;
	const interpolatedSize = progressAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: [0, radius * Math.PI * 2],
	});

	useEffect(() => {
		animateProgress();
		if (alpha === 0) {
			console.log('All complete');
		}
	}, [alpha]);

	const animateProgress = () => {
		Animated.timing(progressAnimation, {
			toValue: alpha,
			duration: 500,
			useNativeDriver: true,
			easing: Easing.out(Easing.quad),
		}).start();
	};

	const AnimatedCircle = Animated.createAnimatedComponent(Circle);

	let progress: string | number = habit.dates[today] ? habit.dates[today].progress : 0;
	let progressTotal =
		habit.type === 'timer' ? getTimeString(habit.progressTotal) : habit.progressTotal;
	progress = habit.type === 'timer' ? getTimeString(progress) : progress;

	return (
		// <View style={{ flex: 1 }}>
		// 	<LinearGradient
		// 		colors={[GradientColours[gradient].start, GradientColours[gradient].end]}
		// 		style={{
		// 			position: 'absolute',
		// 			top: 0,
		// 			left: 0,
		// 			right: 0,
		// 			height: Dimensions.get('screen').height / 3,
		// 		}}
		// 		start={{ x: 0, y: 0 }}
		// 		end={{ x: 1, y: 0 }}
		// 	/>
		<ScrollView showsVerticalScrollIndicator={false}>
			{/* <View style={{ height: 40 }}>
				<Text>Yeet</Text>
			</View> */}

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
					{progress} / {progressTotal}
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
		// </View>
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

import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Animated, Button } from 'react-native';
import { RouteProp, useFocusEffect, useTheme } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../Navigation/TabNavigation';
import { ScrollView } from 'react-native-gesture-handler';
import { Habit } from '../Components/Habit';
import { AppNavProps, AppStackParamList, RootNavProps } from '../Navigation/AppNavigation';
import { AppContext } from '../Context/AppContext';
import { DEFAULT_SCHEDULE, ScheduleTypeValue } from '../Components/Scheduler';
import moment from 'moment';
import Svg, { Circle } from 'react-native-svg';
import { GradientColours, GreyColours } from '../Styles/Colours';
import { GradientContext } from '../Context/GradientContext';

export type HomeNavProps = BottomTabNavigationProp<TabParamList, 'Home'>;
interface HomeProps {
	navigation: HomeNavProps;
}

export default function HomeScreen({ navigation }: HomeProps) {
	const { colors } = useTheme();
	const { habits } = useContext(AppContext);
	const { colour } = useContext(GradientContext);
	const habitArray = Object.values(habits);
	const rootNavigation: AppNavProps = navigation.dangerouslyGetParent();

	let days = Object.keys(DEFAULT_SCHEDULE);
	const dayIndex = moment().subtract(1, 'd').day();
	const displayDays = days.slice(dayIndex + 1, days.length).concat(days.slice(0, dayIndex + 1));

	const [day, setDay] = useState<ScheduleTypeValue>(days[dayIndex] as ScheduleTypeValue);
	const [dayString, setDayString] = useState<string>('Today');
	const [date, setDate] = useState<string>(moment().format('YYYY-MM-DD'));

	useFocusEffect(
		useCallback(() => {
			if (rootNavigation) {
				rootNavigation.setOptions({
					title: dayString,
				});
			}
		}, [navigation, dayString])
	);

	const hanndleDayChange = (day: ScheduleTypeValue, index: number) => {
		setDay(day);
		setDayString(getDayString(index));
		setDate(moment().subtract(index, 'd').format('YYYY-MM-DD'));
	};

	const getDayString = (index: number) => {
		if (index == 0) return 'Today';
		else if (index == 1) return 'Yesterday';
		else return moment().subtract(index, 'd').format('MMMM Do');
	};

	const dayDimensions = Dimensions.get('window').width / 9;

	return (
		<View style={{ flex: 1 }}>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					padding: 20,
					paddingBottom: 0,
				}}>
				{displayDays.map((displayDay, index) => {
					let habitDayLength = 0;
					let habitDayCompleteLength = 0;

					habitArray.forEach((habit) => {
						if (habit.schedule[displayDay as ScheduleTypeValue]) {
							habitDayLength += 1;

							const progress =
								habit.dates[
									moment()
										.subtract(6 - index, 'd')
										.format('YYYY-MM-DD')
								] ?? 0;
							if (progress === habit.progressTotal) habitDayCompleteLength += 1;
						}
					});

					const radius = dayDimensions / 2 - 2;
					const circumference = radius * 2 * Math.PI;
					const alpha =
						habitDayCompleteLength === 0
							? 1
							: 1 - habitDayCompleteLength / habitDayLength;

					return (
						<TouchableOpacity
							key={index}
							onPress={() =>
								hanndleDayChange(displayDay as ScheduleTypeValue, 6 - index)
							}
							style={{
								width: dayDimensions,
								height: dayDimensions,
								justifyContent: 'center',
								alignItems: 'center',
								borderRadius: 100,
							}}>
							<Text
								style={{
									fontFamily: 'Montserrat_600SemiBold',
									color: displayDay === day ? colors.text : colors.border,
								}}>
								{moment()
									.subtract(6 - index, 'd')
									.format('D')}
							</Text>
							<Text
								style={{
									fontFamily: 'Montserrat_600SemiBold',
									fontSize: 8,
									color: displayDay === day ? colors.text : colors.border,
								}}>
								{displayDay}
							</Text>
							<View style={{ position: 'absolute' }}>
								<Svg width={dayDimensions} height={dayDimensions}>
									<Circle
										stroke={GradientColours[colour].solid + '50'}
										cx={dayDimensions / 2}
										cy={dayDimensions / 2}
										r={radius}
										strokeWidth={3}
									/>
								</Svg>
								<Svg
									width={dayDimensions}
									height={dayDimensions}
									style={{
										position: 'absolute',
										transform: [{ rotate: '-90deg' }],
									}}>
									<Circle
										stroke={GradientColours[colour].solid}
										cx={dayDimensions / 2}
										cy={dayDimensions / 2}
										r={radius}
										strokeWidth={3}
										strokeDashoffset={alpha * radius * Math.PI * 2}
										strokeDasharray={[circumference, circumference]}
									/>
								</Svg>
							</View>
						</TouchableOpacity>
					);
				})}
			</View>

			<ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
				<View style={{ flex: 1, padding: 10 }}>
					{habits &&
						habitArray.map((habit) => {
							if (habit.schedule[day]) {
								const progress = habit.dates[date] ?? 0;

								return (
									<Habit
										key={habit.id + date + habit.progressTotal}
										navigation={rootNavigation}
										id={habit.id}
										name={habit.name}
										icon={habit.icon}
										gradient={habit.gradient}
										progress={progress}
										progressTotal={habit.progressTotal}
										type={habit.type}
										schedule={habit.schedule}
										date={date}
										dates={habit.dates}
									/>
								);
							}
						})}
				</View>
			</ScrollView>
		</View>
	);
}

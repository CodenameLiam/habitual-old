import React, { useCallback, useContext, useState } from 'react';
import { Modal, View, Text } from 'react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../Navigation/TabNavigation';
import { ScrollView } from 'react-native-gesture-handler';
import { Habit } from '../Components/Habit';
import { AppNavProps } from '../Navigation/AppNavigation';
import { AppContext } from '../Context/AppContext';
import { DEFAULT_SCHEDULE, ScheduleTypeValue } from '../Components/Scheduler';
import moment from 'moment';
import DisplayDay from '../Components/DisplayDay';
import { getRandomBytes } from 'expo-random';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type HomeNavProps = BottomTabNavigationProp<TabParamList, 'Home'>;
interface HomeProps {
	navigation: HomeNavProps;
}

export default function HomeScreen({ navigation }: HomeProps) {
	const { habits } = useContext(AppContext);
	const habitArray = Object.values(habits);
	const rootNavigation: AppNavProps = navigation.dangerouslyGetParent();

	let days = Object.keys(DEFAULT_SCHEDULE);
	const dayIndex = moment().subtract(1, 'd').day();
	const displayDays = days.slice(dayIndex + 1, days.length).concat(days.slice(0, dayIndex + 1));

	const [day, setDay] = useState<ScheduleTypeValue>(days[dayIndex] as ScheduleTypeValue);
	const [dayString, setDayString] = useState<string>('Today');
	const [date, setDate] = useState<string>(moment().format('YYYY-MM-DD'));

	const [habitToken, setHabitToken] = useState(getRandomBytes(4).join(''));

	useFocusEffect(
		useCallback(() => {
			if (rootNavigation) {
				rootNavigation.setOptions({
					title: dayString,
				});
			}
		}, [dayString])
	);

	useFocusEffect(
		useCallback(() => {
			setHabitToken(getRandomBytes(4).join(''));
		}, [navigation])
	);

	const handleDayChange = (day: ScheduleTypeValue, index: number) => {
		setDay(day);
		setDayString(getDayString(index));
		setDate(moment().subtract(index, 'd').format('YYYY-MM-DD'));
	};

	const getDayString = (index: number) => {
		if (index == 0) return 'Today';
		else if (index == 1) return 'Yesterday';
		else return moment().subtract(index, 'd').format('MMMM Do');
	};

	const getAlphaValue = (displayDay: string, index: number) => {
		let habitDayLength = 0;
		let habitDayCompleteLength = 0;

		habitArray.forEach((habit) => {
			if (habit.schedule[displayDay as ScheduleTypeValue]) {
				habitDayLength += 1;

				const date =
					habit.dates[
						moment()
							.subtract(6 - index, 'd')
							.format('YYYY-MM-DD')
					] ?? 0;
				if (date.progress === habit.progressTotal) habitDayCompleteLength += 1;
			}
		});
		return habitDayCompleteLength === 0 ? 1 : 1 - habitDayCompleteLength / habitDayLength;
	};

	return (
		<View style={{ flex: 1 }}>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					padding: 20,
					paddingBottom: 10,
				}}>
				{displayDays.map((displayDay, index) => (
					<DisplayDay
						key={index}
						alpha={getAlphaValue(displayDay, index)}
						selectedDay={day}
						displayDay={displayDay as ScheduleTypeValue}
						displayIndex={index}
						handleDayChange={handleDayChange}
					/>
				))}
			</View>

			<ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
				<View style={{ flex: 1, padding: 10, paddingTop: 0 }}>
					{habits &&
						habitArray.map((habit) => {
							if (habit.schedule[day]) {
								const progress = habit.dates[date] ? habit.dates[date].progress : 0;

								return (
									<Habit
										key={habit.id + day + habitToken}
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

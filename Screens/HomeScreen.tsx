import React, { useCallback, useContext, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { RouteProp, useFocusEffect, useTheme } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../Navigation/TabNavigation';
import { ScrollView } from 'react-native-gesture-handler';
import { Habit } from '../Components/Habit';
import { AppNavProps, AppStackParamList, RootNavProps } from '../Navigation/AppNavigation';
import { AppContext } from '../Context/AppContext';
import { DEFAULT_SCHEDULE, ScheduleTypeValue } from '../Components/Scheduler';
import moment from 'moment';

export type HomeNavProps = BottomTabNavigationProp<TabParamList, 'Home'>;
interface HomeProps {
	navigation: HomeNavProps;
}

export default function HomeScreen({ navigation }: HomeProps) {
	const { colors } = useTheme();
	const { habits } = useContext(AppContext);
	const habitArray = Object.values(habits);
	const rootNavigation: AppNavProps = navigation.dangerouslyGetParent();

	let days = Object.keys(DEFAULT_SCHEDULE);
	const dayIndex = moment().day() - 1;
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

	const dayDimensions = Dimensions.get('window').width / 9.5;

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
				{displayDays.map((schedule, index) => (
					<TouchableOpacity
						key={index}
						onPress={() => hanndleDayChange(schedule as ScheduleTypeValue, 6 - index)}
						style={{
							width: dayDimensions,
							height: dayDimensions,
							backgroundColor: colors.card,
							justifyContent: 'center',
							alignItems: 'center',
							borderRadius: 100,
						}}>
						<Text
							style={{
								fontFamily: 'Montserrat_600SemiBold',
								fontSize: 20,
								color: colors.text,
							}}>
							{moment()
								.subtract(6 - index, 'd')
								.format('D')}
						</Text>
						<Text
							style={{
								fontFamily: 'Montserrat_600SemiBold',
								fontSize: 8,
								color: colors.text,
							}}>
							{schedule}
						</Text>
					</TouchableOpacity>
				))}
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

import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp, useTheme } from '@react-navigation/native';

import { notificationAsync, NotificationFeedbackType } from 'expo-haptics';
import moment from 'moment';
import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
// import { Directions, FlingGestureHandler, TouchableOpacity } from 'react-native-gesture-handler';
import TextTicker from 'react-native-text-ticker';
import { ColourButtonGroup } from 'Components/ColourButtonGroup';
import Icon from 'Components/Icon';
import { DEFAULT_SCHEDULE, ScheduleTypeValue } from 'Components/Scheduler';
import { AppContext } from 'Context/AppContext';
import { GradientContext } from 'Context/GradientContext';
import { AppNavProps } from 'Navigation/AppNavigation';
import { TabParamList } from 'Navigation/TabNavigation';
import { IHabit, mergeDates } from 'Controllers/HabitController';
import { GradientColours, GreyColours } from 'Styles/Colours';

type NavProps = BottomTabNavigationProp<TabParamList, 'Calendar'>;
type RouteProps = RouteProp<TabParamList, 'Calendar'>;
interface CalendarProps {
	navigation: AppNavProps;
	route: RouteProps;
}

type dateRange = 'Weekly' | 'Monthly' | 'Yearly';

export default function CalendarScreen ({ navigation, route }: CalendarProps) {
    const { colors } = useTheme();
    const { habits, updateHabit } = useContext(AppContext);
    const { colour } = useContext(GradientContext);

    const [range, setRange] = useState<dateRange>('Weekly');
    const [weekIndex, setWeekIndex] = useState<number>(0);

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
            .startOf('w');

        const styles = StyleSheet.create({
            arrow: {
                alignItems: 'center',
                borderRadius: 5,
                height: 25,
                justifyContent: 'center',
                marginLeft: 10,
                marginRight: 10,
                width: 25
            },
            dayContainer: {
                alignItems: 'center',
                backgroundColor: colors.card,
                borderRadius: 10,
                height: weeklyCellContainer,
                justifyContent: 'center',
                margin: 3,
                width: weeklyCellContainer
            },
            dayTitle: {
                color: colors.text,
                fontFamily: 'Montserrat_700Bold',
                fontSize: 16
            },
            weekTitle: {
                color: colors.text,
                fontFamily: 'Montserrat_700Bold',
                fontSize: 18,
                textAlign: 'center',
                width: '60%'
            }
        });

        const getBackgroundColour = (habit: IHabit, index: number) => {
            const weekStart = moment().subtract(weekIndex, 'w').startOf('w').add(1, 'd');
            const date = weekStart.add(index, 'd').format('YYYY-MM-DD');

            if (habit.dates[date] && habit.dates[date].progress > 0) {
                let progress: number | string = habit.dates[date].progress / habit.dates[date].progressTotal;
                progress = (Math.round(progress * 10) / 10) * 100;
                if (progress <= 10) progress = 20;
                if (progress >= 100) progress = '';

                return GradientColours[habit.gradient].solid + progress;
            }

            return colors.card;
        };

        const handlePress = (habit: IHabit, index: number) => {
            const weekStart = moment().subtract(weekIndex, 'w').startOf('w').add(1, 'd');
            const date = weekStart.clone().add(index, 'd');

            const dateString = date.format('YYYY-MM-DD');

            const newProgress =
				habit.dates[dateString] && habit.dates[dateString].progress >= habit.dates[dateString].progressTotal
				  ? 0
				  : habit.progressTotal;

            updateHabit({
                ...habit,
                dates: mergeDates(habit.dates, dateString, newProgress, habit.progressTotal)
            });
            notificationAsync(NotificationFeedbackType.Success);
        };

        const renderDisabledIcon = (habit: IHabit, day: string, scheduleValue: ScheduleTypeValue) => {
            if (habit.dates[day] && habit.dates[day].progress > 0) return false;
            if (!habit.schedule[scheduleValue]) return true;
            return false;
        };

        return (
            <View style={{ alignItems: 'center' }}>
                <View
                    style={{
					  display: 'flex',
					  flexDirection: 'row',
					  marginBottom: 15,
					  alignItems: 'center'
                    }}
                >
                    <TouchableOpacity
                        onPress={() => setWeekIndex(weekIndex + 1)}
                        style={[
						  styles.arrow,
						  {
						    backgroundColor: GradientColours[colour].solid + 50
						  }
                        ]}
                    >
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
						    backgroundColor: GradientColours[colour].solid + 50
						  }
                        ]}
                    >
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
					  marginLeft: weeklyTextContainer
                    }}
                >
                    {Object.keys(DEFAULT_SCHEDULE).map((day) => (
                        <View key={day} style={styles.dayContainer}>
                            <Text style={styles.dayTitle}>{day[0]}</Text>
                        </View>
                    ))}
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    // contentContainerStyle={{ flexGrow: 1 }}
                >
                    <View style={{ paddingBottom: 350 }}>
                        {Object.keys(habits).map((id) => {
						  const habit = habits[id];
						  return (
                                <View
                                    key={id}
                                    style={{
									  display: 'flex',
									  flexDirection: 'row',
									  alignItems: 'center'
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('View', { id: id })}
                                        style={{
										  width: weeklyTextContainer,
										  paddingRight: 10,
										  // backgroundColor: 'red',
										  height: weeklyCellContainer,
										  justifyContent: 'center'
                                        }}
                                    >
                                        <TextTicker
                                            scroll={false}
                                            animationType='bounce'
                                            duration={5000}
                                            bounceDelay={1500}
                                            marqueeDelay={1000}
                                            bouncePadding={{ left: 0, right: 0 }}
                                            style={[styles.dayTitle]}
                                        >
                                            {habit.name}
                                        </TextTicker>
                                    </TouchableOpacity>

                                    {Object.keys(DEFAULT_SCHEDULE).map((day, index) => {
									  const schedule = Object.keys(DEFAULT_SCHEDULE);
									  const scheduleValue = schedule[index] as ScheduleTypeValue;
									  const date = weekEnd
									    .clone()
									    .subtract(6 - index, 'd')
									    .format('YYYY-MM-DD');

									  const isDisabled = weekStart.clone().add(index, 'd').isAfter(moment());

									  return (
                                            <TouchableOpacity
                                                key={day}
                                                disabled={isDisabled}
                                                onPress={() => handlePress(habit, index)}
                                                style={[
												  styles.dayContainer,
												  {
												    backgroundColor: getBackgroundColour(habit, index)
												  }
                                                ]}
                                            >
                                                {renderDisabledIcon(habit, date, scheduleValue) && (
                                                    <Icon
                                                        family='fontawesome'
                                                        name='ban'
                                                        size={20}
                                                        colour={GreyColours.GREY2}
                                                    />
                                                )}
                                            </TouchableOpacity>
									  );
                                    })}
                                </View>
						  );
                        })}
                    </View>
                </ScrollView>
            </View>
        );
    };

    const renderSwitch = () => {
        const switchFunctions = [() => setRange('Weekly'), () => setRange('Monthly'), () => setRange('Yearly')];
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

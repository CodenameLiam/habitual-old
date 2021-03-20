import { RouteProp, useFocusEffect, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    InteractionManager,
    TouchableOpacity
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card } from 'Components/Card/Card';
import { AppContext } from 'Context/AppContext';
import { AppStackParamList } from 'Navigation/AppNavigation';

import { CalendarList, DateObject } from 'react-native-calendars';
import moment from 'moment';
import { GradientColours, GreyColours } from 'Styles/Colours';
import { mergeDates } from 'Controllers/HabitController';
import { notificationAsync, NotificationFeedbackType } from 'expo-haptics';
import DisplayDay, { displayDays } from 'Components/DisplayDay';
import { ScheduleTypeValue } from 'Components/Scheduler';
import Icon from 'Components/Icon';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import ProgressCircle, { getProgress } from 'Components/ProgressCircle';
import { styles } from './ViewScreen.styles';
import { sortDates, getDaysToDisable, getMarkedDates, getInitialDate } from 'Helpers';

export type ViewNavProps = StackNavigationProp<AppStackParamList, 'View'>;
export type ViewRoute = RouteProp<AppStackParamList, 'View'>;


// Constants
const today = moment().format('YYYY-MM-DD');
const yearDateArray = Array.from(Array(365)).map((value, index) =>
    moment().subtract(364, 'd').add(index, 'd').format('YYYY-MM-DD')
);
const yearlyDateDimensions = (Dimensions.get('screen').width - 60) / 53 - 1;
interface ViewProps {
	navigation: ViewNavProps;
	route: ViewRoute;
}

const ViewScreen: React.FC<ViewProps> = ({ navigation, route }: ViewProps) => {
    const { colors } = useTheme();

    // Habit state
    const { habits, updateHabit } = useContext(AppContext);
    const { id } = route.params;
    const habit = habits[id];

    // Ready state
    const [isReady, setIsReady] = useState(false);
    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            setIsReady(true);
        });
    }, []);

    // Day state
    const [day, setDay] = useState<ScheduleTypeValue>(getInitialDate(habit.schedule, displayDays));
    const [date, setDate] = useState(today);
    const [month, setMonth] = useState(today);
    const allDates = Object.keys(habit.dates);
    const sortedDates = sortDates(allDates);
    const markedDates = getMarkedDates(habit, today, month, allDates);

    // Progress from child
    const [circleProgress, setCircleProgress] = useState(getProgress(habit, date));

    useFocusEffect(
        useCallback(() => {
            navigation.setOptions({
                title: habit.name
            });
        }, [navigation, habit.name])
    );

    const handleCalendarPress = (day: DateObject): void => {
        const date = habit.dates[day.dateString];
        const newProgress = date && date.progress >= date.progressTotal ? 0 : habit.progressTotal;

        updateHabit({
            ...habit,
            dates: mergeDates(habit.dates, day.dateString, newProgress, habit.progressTotal)
        });
        notificationAsync(NotificationFeedbackType.Success);
    };

    const getAlphaValue = (index: number): number => {
        const indexDate = moment()
            .subtract(6 - index, 'd')
            .format('YYYY-MM-DD');

        if (indexDate === date) {
            // return 0.2;

            return circleProgress >= habit.progressTotal ? 0 : 1 - circleProgress / habit.progressTotal;
        }

        return habit.dates[indexDate]
            ? habit.dates[indexDate].progress >= habit.progressTotal
                ? 0
                : 1 - habit.dates[indexDate].progress / habit.progressTotal
            : 1;
    };

    const getYearAlphaValue = (day: string): string | number => {
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

    const handleDayChange = (day: ScheduleTypeValue, index: number): void => {
        const dayString = moment().subtract(index, 'd').format('YYYY-MM-DD');
        setDay(day);
        setDate(dayString);
    // setProgress(habit.dates[dayString] ? habit.dates[dayString].progress : 0);
    };

    const getCurrentStreak = (date: string): {
        currentStreak: number;
        dayPointer: string;
    } => {
        let currentStreak = 0;
        let dayPointerIndex = 0;
        let dayPointer = moment(date)
            .subtract(dayPointerIndex + 1, 'd')
            .format('YYYY-MM-DD');

        let dayIndex = moment(dayPointer).format('ddd').toUpperCase();

        do {
            if (habit.dates[dayPointer] && habit.dates[dayPointer].progress >= habit.dates[dayPointer].progressTotal) {
                currentStreak++;
            }
            dayPointerIndex++;
            dayPointer = moment(date)
                .subtract(dayPointerIndex + 1, 'd')
                .format('YYYY-MM-DD');
            dayIndex = moment(dayPointer).format('ddd').toUpperCase();
        } while (
            (habit.dates[dayPointer] && habit.dates[dayPointer].progress >= habit.dates[dayPointer].progressTotal) ||
			habit.schedule[dayIndex as ScheduleTypeValue] === false
        );

        if (
            (habit.dates[date] && habit.dates[date].progress >= habit.dates[date].progressTotal) ||
			habit.schedule[dayIndex as ScheduleTypeValue] === false
        ) {
            currentStreak++;
        }

        return { currentStreak, dayPointer };
    };

    const getHighestStreak = (): number => {
        let highestStreak = 0;

        if (sortedDates.length > 0) {
            let dayPointer = today;
            const streak = getCurrentStreak(dayPointer);

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

                const streak = getCurrentStreak(dayPointer);
                dayPointer = streak.dayPointer;

                if (streak.currentStreak > highestStreak) {
                    highestStreak = streak.currentStreak;
                }
            } while (new Date(dayPointer).getTime() >= new Date(sortedDates[0]).getTime());
        }

        return highestStreak;
    };

    const getTotalComplete = (): number => {
        return Object.keys(markedDates).filter((date) => markedDates[date].selected === true).length;
    };

    const getCompletionRate = (): number => {
        const startDate = moment(sortedDates[0]);

        const daysToDisable = getDaysToDisable(habit);

        let unselectedDays = 0;
        let completedDays = getTotalComplete();

        let totalDays = moment().add(1, 'd').diff(startDate, 'd');

        if (totalDays === 0) {
            totalDays = 1;
        }

        for (let m = startDate.clone(); m.diff(moment()) <= 0; m.add(1, 'days')) {
            if (daysToDisable.includes(m.day())) {
                const markedDate = markedDates[m.format('YYYY-MM-DD')];
                if (markedDate && markedDate.selected) {
                    unselectedDays++;
                } else {
                    completedDays++;
                }
            }
        }

        totalDays -= unselectedDays;
        completedDays -= unselectedDays;

        const completionRate = (completedDays / totalDays) * 100;

        return Math.round(completionRate * 10) / 10;
    };

    const updateHabitDebounced = AwesomeDebouncePromise(
        (progress: number) =>
            updateHabit({
                ...habit,
                dates: mergeDates(habit.dates, date, progress, habit.progressTotal)
            }),
        200
    );

    const updateHabitAsync = async (progress: number): Promise<void> => {
        updateHabitDebounced(progress);
    };

    // const scrollRef = useRef<ScrollView>(null);

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View
                style={{
				  display: 'flex',
				  flexDirection: 'row',
				  justifyContent: 'space-between',
				  padding: 20,
				  paddingBottom: 0
                }}
            >
                {displayDays.map((displayDay, index) => {
				  const date = moment()
				    .subtract(6 - index, 'd')
				    .format('YYYY-MM-DD');

				  const markedDate = markedDates[date];

				  return (
                        <DisplayDay
                            key={displayDay + index}
                            disabled={markedDate && markedDate.disabled}
                            alpha={getAlphaValue(index)}
                            selectedDay={day}
                            displayDay={displayDay as ScheduleTypeValue}
                            displayIndex={index}
                            gradient={habit.gradient}
                            handleDayChange={handleDayChange}
                        />
				  );
                })}
            </View>

            <ProgressCircle
                habit={habit}
                date={date}
                progress={getProgress(habit, date)}
                gradient={GradientColours[habit.gradient].solid}
                updateHabit={updateHabitAsync}
                setCircleProgress={setCircleProgress}
            />

            <Text
                style={{
				  fontFamily: 'Montserrat_600SemiBold',
				  fontSize: 20,
				  padding: 15,
				  textAlign: 'center',
				  color: colors.text
                }}
            >
				Yearly Progress
            </Text>

            <View style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                <View
                    style={{
					  display: 'flex',
					  flexWrap: 'wrap',
					  height: 7 * 7
                    }}
                >
                    {yearDateArray.map((day, index) => {
					  return (
                            <View
                                key={index + day}
                                style={{
								  height: yearlyDateDimensions,
								  width: yearlyDateDimensions,
								  backgroundColor:
										habit.dates[day] && habit.dates[day].progress > 0
										  ? GradientColours[habit.gradient].solid + getYearAlphaValue(day)
										  : colors.border,
								  margin: 0.9,
								  borderRadius: 1
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
				  color: colors.text
                }}
            >
				Stats
            </Text>

            <View style={{ display: 'flex', flexDirection: 'row', marginRight: 15 }}>
                <Card title='Current Streak' themeText={true} style={{ ...styles.statCard, marginTop: 0 }}>
                    <View
                        style={[
						  styles.statBar,
						  {
						    backgroundColor: GradientColours[habit.gradient].solid
						  }
                        ]}
                    />
                    <View style={styles.statIconContainer}>
                        <Icon family='fontawesome5' name='fire' colour={colors.text} size={30} />
                        <Text
                            style={[
							  styles.statIconText,
							  {
							    color: colors.text
							  }
                            ]}
                        >
                            {isReady && getCurrentStreak(today).currentStreak}
                        </Text>
                    </View>
                </Card>
                <Card title='Highest Streak' themeText={true} style={{ ...styles.statCard, marginTop: 0 }}>
                    <View
                        style={[
						  styles.statBar,
						  {
						    backgroundColor: GradientColours[habit.gradient].solid
						  }
                        ]}
                    />
                    <View style={styles.statIconContainer}>
                        <Icon family='fontawesome5' name='crown' colour={colors.text} size={30} />
                        <Text
                            style={[
							  styles.statIconText,
							  {
							    color: colors.text
							  }
                            ]}
                        >
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
				  marginBottom: 15
                }}
            >
                <Card title='Total Complete' themeText={true} style={styles.statCard}>
                    <View
                        style={[
						  styles.statBar,
						  {
						    backgroundColor: GradientColours[habit.gradient].solid
						  }
                        ]}
                    />
                    <View style={styles.statIconContainer}>
                        <Icon family='fontawesome5' name='check' colour={colors.text} size={30} />
                        <Text
                            style={[
							  styles.statIconText,
							  {
							    color: colors.text
							  }
                            ]}
                        >
                            {isReady && getTotalComplete()}
                        </Text>
                    </View>
                </Card>
                <Card title='Completion Rate' themeText={true} style={styles.statCard}>
                    <View
                        style={[
						  styles.statBar,
						  {
						    backgroundColor: GradientColours[habit.gradient].solid
						  }
                        ]}
                    />
                    <View style={styles.statIconContainer}>
                        <Icon family='fontawesome5' name='percentage' colour={colors.text} size={30} />
                        <Text
                            style={[
							  styles.statIconText,
							  {
							    color: colors.text
							  }
                            ]}
                        >
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
                    onDayPress={handleCalendarPress}
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
					  textSectionTitleColor: GreyColours.GREY2
                    }}
                />
            )}

            <TouchableOpacity style={{ padding: 30 }} onPress={() => updateHabit({ ...habit, dates: {} })}>
                <Text style={{ color: 'red' }}>Reset</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default ViewScreen;

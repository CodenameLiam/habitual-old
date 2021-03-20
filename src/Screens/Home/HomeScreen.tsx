import React, { useCallback, useContext, useState } from 'react';
import { View } from 'react-native';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from 'Navigation/TabNavigation';
import { ScrollView } from 'react-native-gesture-handler';
import { Habit } from 'Components/Habit';
import { AppNavProps, AppStackParamList } from 'Navigation/AppNavigation';
import { AppContext } from 'Context/AppContext';
import { ScheduleTypeValue } from 'Components/Scheduler';
import moment from 'moment';
import DisplayDay, { dayIndex, days, displayDays } from 'Components/DisplayDay';
import { getRandomBytes } from 'expo-random';
import { TimerContext } from 'Context/TimerContext';
import { getDayString } from 'Helpers/DateHelpers';

export type HomeNavProps = BottomTabNavigationProp<TabParamList, 'Home'>;
export type HomeRoute = RouteProp<AppStackParamList, 'Tabs'>;
interface HomeProps {
    navigation: HomeNavProps;
    route: HomeRoute;
}

const HomeScreen: React.FC<HomeProps> = ({ navigation, route }) => {
    // AsyncStorage.clear();

    const { habits } = useContext(AppContext);
    const { activeTimer } = useContext(TimerContext);
    const habitArray = habits && Object.values(habits);
    const rootNavigation: AppNavProps = navigation.dangerouslyGetParent();

    const [day, setDay] = useState<ScheduleTypeValue>(days[dayIndex] as ScheduleTypeValue);
    const [dayString, setDayString] = useState<string>('Today');
    const [date, setDate] = useState<string>(moment().format('YYYY-MM-DD'));

    const [habitId, setHabitId] = useState(getRandomBytes(4).join(''));

    useFocusEffect(
        useCallback(() => {
            if (rootNavigation) {
                rootNavigation.setOptions({
                    title: dayString,
                });
            }
        }, [dayString]),
    );

    useFocusEffect(
        useCallback(() => {
            setHabitId(getRandomBytes(4).join(''));
        }, [navigation]),
    );

    const habitKey = (progress: number): string => {
        if (!navigation.isFocused()) {
            return progress.toString();
        }
        return habitId;
    };

    const handleDayChange = (day: ScheduleTypeValue, index: number): void => {
        setDay(day);
        setDayString(getDayString(index));
        setDate(moment().subtract(index, 'd').format('YYYY-MM-DD'));
    };

    const getAlphaValue = (displayDay: string, index: number): number => {
        let habitDayLength = 0;
        let habitDayCompleteLength = 0;

        habits &&
            habitArray.forEach(habit => {
                if (habit.schedule[displayDay as ScheduleTypeValue]) {
                    habitDayLength += 1;

                    const date =
                        habit.dates[
                            moment()
                                .subtract(6 - index, 'd')
                                .format('YYYY-MM-DD')
                        ] ?? 0;
                    if (date.progress >= date.progressTotal) habitDayCompleteLength += 1;
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
                }}
            >
                {displayDays.map((displayDay, index) => (
                    <DisplayDay
                        key={index + habitKey(getAlphaValue(displayDay, index))}
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
                        habitArray.map(habit => {
                            if (habit.schedule[day]) {
                                const progress = habit.dates[date]
                                    ? habit.dates[date].progress >= habit.progressTotal
                                        ? habit.progressTotal
                                        : habit.dates[date].progress
                                    : 0;

                                return (
                                    <Habit
                                        key={habit.id + day + habitKey(progress)}
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
                                        timerActive={habit.id === activeTimer}
                                        // firstMount={firstMount}
                                    />
                                );
                            } else {
                                return <></>;
                            }
                        })}
                </View>
            </ScrollView>
        </View>
    );
};

export default HomeScreen;

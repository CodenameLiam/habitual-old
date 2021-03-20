import { useTheme } from '@react-navigation/native';

import { impactAsync, ImpactFeedbackStyle, notificationAsync, NotificationFeedbackType } from 'expo-haptics';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Dimensions, Easing, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { TimerContext } from 'Context/TimerContext';
import { IHabit } from 'Controllers/HabitController';
import { GreyColours } from 'Styles/Colours';
import { getTimeString } from 'Components/Habit';
import Icon from '../Icon/Icon';

interface ProgressCircleProps {
	habit: IHabit;
	date: string;
	progress: number;
	gradient: string;
	updateHabit: (count: number) => void;
	setCircleProgress: React.Dispatch<React.SetStateAction<number>>;
}

export default function ProgressCircle ({
    habit,
    date,
    progress,
    gradient,
    updateHabit,
    setCircleProgress
}: ProgressCircleProps) {
    const { colors } = useTheme();
    const { type, progressTotal } = habit;

    useEffect(() => {
        setCount(getProgress(habit, date));
    }, [date]);

    // Count values
    const [count, setCount] = useState(progress);

    // Timer values
    let interval: NodeJS.Timeout;
    const { activeTimer, setActiveTimer } = useContext(TimerContext);
    const [isTimerActive, setIsTimerActive] = useState(activeTimer == habit.id);

    // Circle values
    const AnimatedCircle = Animated.createAnimatedComponent(Circle);
    const dimension = Dimensions.get('screen').width - 50;
    const radius = dimension / 2 - 15;
    const circumference = radius * 2 * Math.PI;

    // Progress values
    const progressAnimation = useRef(new Animated.Value(activeTimer ? progress : 0)).current;
    const interpolatedSize = progressAnimation.interpolate({
        inputRange: [0, habit.progressTotal],
        outputRange: [radius * Math.PI * 2, 0]
    });

    const animateProgress = () => {
        Animated.timing(progressAnimation, {
            toValue: count >= progressTotal ? progressTotal : count,
            duration: isTimerActive ? 1200 : 500,
            useNativeDriver: true,
            easing: isTimerActive ? Easing.linear : Easing.out(Easing.quad)
        }).start();
    };

    const getProgressString = (count: number) => {
        return type === 'timer' ? getTimeString(count) : count;
    };

    const countRef = useRef<boolean>(false);
    const updateCountRef = () => (countRef.current = true);

    useEffect(() => {
        animateProgress();
        setCircleProgress(count);
        countRef.current && updateHabit(count);
        !countRef.current && updateCountRef();
        isTimerActive && incrementTimer();
        return () => {
            clearInterval(interval);
        };
    }, [count, isTimerActive]);

    useEffect(() => {
        setActiveTimer(isTimerActive ? habit.id : undefined);
    }, [isTimerActive]);

    const incrementTimer = () => {
        if (count == progressTotal) {
            setIsTimerActive(false);
            notificationAsync(NotificationFeedbackType.Success);
        }

        if (isTimerActive && type == 'timer') {
            interval = setInterval(() => {
                setCount(count + 1);
            }, 1000);
        }
    };

    const toggleTimer = () => {
        if (count < progressTotal) {
            setIsTimerActive(!isTimerActive);
            impactAsync(ImpactFeedbackStyle.Medium);
        }
    };

    const removeProgress = () => {
        count > 0 && setCount(count - 1);
    };

    const addProgress = () => {
        impactAsync(ImpactFeedbackStyle.Medium);
        setCount(count + 1);
    };

    const completeHabit = () => {
        count < progressTotal && notificationAsync(NotificationFeedbackType.Success);
        setCount(count >= progressTotal ? 0 : progressTotal);
        setIsTimerActive(false);
    };

    return (
        <View>
            <View
                style={{
				  backgroundColor: colors.background,
				  height: Dimensions.get('screen').width,
				  display: 'flex',
				  justifyContent: 'center',
				  alignItems: 'center'
                }}
            >
                <Text
                    style={{
					  fontFamily: 'Montserrat_800ExtraBold',
					  fontSize: 30,
					  color: colors.text
                    }}
                >
                    {getProgressString(count)} / {getProgressString(progressTotal)}
                </Text>
                <Svg
                    width={dimension}
                    height={dimension}
                    style={{
					  position: 'absolute'
                    }}
                >
                    <Circle
                        stroke={gradient + '50'}
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
					  transform: [{ rotate: '-90deg' }]
                    }}
                >
                    <AnimatedCircle
                        stroke={gradient}
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
				  marginBottom: 20
                }}
            >
                {type === 'count' && (
                    <React.Fragment>
                        <TouchableOpacity
                            onPress={removeProgress}
                            style={[
							  styles.count,
							  {
							    marginRight: 10,
							    backgroundColor: count > 0 ? gradient + 50 : GreyColours.GREY2 + 50
							  }
                            ]}
                        >
                            <Icon
                                family='fontawesome'
                                name='minus'
                                size={24}
                                colour={count > 0 ? gradient : GreyColours.GREY2}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={addProgress}
                            style={[
							  styles.count,
							  {
							    marginRight: 10,
							    backgroundColor: gradient + 50
							  }
                            ]}
                        >
                            <Icon family='fontawesome' name='plus' size={24} colour={gradient} />
                        </TouchableOpacity>
                    </React.Fragment>
                )}
                {type === 'timer' && (
                    <TouchableOpacity
                        onPress={toggleTimer}
                        style={[
						  styles.count,
						  {
						    marginRight: 10,
						    backgroundColor: gradient + 50
						  }
                        ]}
                    >
                        <Icon family='antdesign' name='clockcircle' size={24} colour={gradient} />
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    onPress={completeHabit}
                    style={[
					  styles.count,
					  {
					    backgroundColor: gradient + 50
					  }
                    ]}
                >
                    <Icon family='fontawesome' name='check' size={24} colour={gradient} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

// Progress state
export const getProgress = (habit: IHabit, date: string): number => {
    return habit.dates[date] ? habit.dates[date].progress : 0;
};

const styles = StyleSheet.create({
    count: {
        alignItems: 'center',
        borderRadius: 5,
        height: 45,
        justifyContent: 'center',
        overflow: 'hidden',
        width: 45
    },
    statBar: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        top: 0,
        width: 10
    },
    statCard: {
        alignItems: 'center',
        flex: 1,
        marginRight: 0,
        overflow: 'hidden'
    },
    statIconContainer: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        padding: 5
    },
    statIconText: {
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 30,
        paddingLeft: 15,
        textAlign: 'center'
    }
});

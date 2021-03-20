import { useTheme } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect, useRef, useContext } from 'react';

import { View, Text, Dimensions, TouchableOpacity, Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { GradientContext } from 'Context/GradientContext';
import { GradientColours, GradientType } from 'Styles/Colours';
import { DEFAULT_SCHEDULE, ScheduleTypeValue } from 'Components/Scheduler';

export const days = Object.keys(DEFAULT_SCHEDULE);
export const dayIndex = moment().subtract(1, 'd').day();
export const displayDays = days
    .slice(dayIndex + 1, days.length)
    .concat(days.slice(0, dayIndex + 1));

interface DisplayDayProps {
	alpha: number;
	disabled?: boolean;
	selectedDay: ScheduleTypeValue;
	displayDay: ScheduleTypeValue;
	displayIndex: number;
	gradient?: GradientType;
	handleDayChange: (day: ScheduleTypeValue, index: number) => void;
}

const DisplayDay: React.FC<DisplayDayProps> = ({
    alpha,
    disabled,
    selectedDay,
    displayDay,
    displayIndex,
    gradient,
    handleDayChange
}) => {
    const { colors } = useTheme();
    const { colour } = useContext(GradientContext);

    const dimension = Dimensions.get('screen').width / 9;
    const radius = dimension / 2 - 2;
    const circumference = radius * 2 * Math.PI;

    const progressAnimation = useRef(new Animated.Value(alpha)).current;
    const interpolatedSize = progressAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, radius * Math.PI * 2]
    });

    const AnimatedCircle = Animated.createAnimatedComponent(Circle);

    const animateProgress = (): void => {
        Animated.timing(progressAnimation, {
            toValue: alpha,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.out(Easing.quad)
        }).start();
    };

    const getCircleColour = (): string => {
        return disabled ? colors.border : GradientColours[gradient ?? colour].solid;
    };

    useEffect(() => {
        animateProgress();
    }, [alpha]);

    return (
        <TouchableOpacity
            onPress={() => handleDayChange(displayDay, 6 - displayIndex)}
            style={{
			  width: dimension,
			  height: dimension,
			  justifyContent: 'center',
			  alignItems: 'center',
			  borderRadius: 100
            }}>
            <Text
                style={{
				  fontFamily: 'Montserrat_600SemiBold',
				  color: displayDay === selectedDay ? colors.text : colors.border
                }}>
                {moment()
				  .subtract(6 - displayIndex, 'd')
				  .format('D')}
            </Text>
            <Text
                style={{
				  fontFamily: 'Montserrat_600SemiBold',
				  fontSize: 8,
				  color: displayDay === selectedDay ? colors.text : colors.border
                }}>
                {displayDay}
            </Text>
            <View style={{ position: 'absolute' }}>
                <Svg width={dimension} height={dimension}>
                    <Circle
                        stroke={getCircleColour() + '50'}
                        cx={dimension / 2}
                        cy={dimension / 2}
                        r={radius}
                        strokeWidth={3}
                    />
                </Svg>
                <Svg
                    width={dimension}
                    height={dimension}
                    style={{
					  position: 'absolute',
					  transform: [{ rotate: '-90deg' }]
                    }}>
                    <AnimatedCircle
                        stroke={getCircleColour()}
                        cx={dimension / 2}
                        cy={dimension / 2}
                        r={radius}
                        strokeWidth={3}
                        strokeDashoffset={interpolatedSize}
                        strokeDasharray={[circumference, circumference]}
                    />
                </Svg>
            </View>
        </TouchableOpacity>
    );
};

export default DisplayDay;

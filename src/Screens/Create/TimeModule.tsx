import styled from '@emotion/native';
import Icon from 'Components/Icon';
import { TimePicker } from 'Components/TimePicker';
import { IHabit } from 'Controllers/HabitController';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { GradientColours, GreyColours } from 'Styles';
import { RowBetween, MarginLeft, MarginRight } from 'Styles/Globals';
import {
    ProgressText,
    ProgressTextInput,
    ProgressTimeInput,
    SqaureButton,
} from './CreateScreen.styles';
import BottomSheet from 'reanimated-bottom-sheet';

interface TimeModuleProps {
    habit: IHabit;
    handleOpen: () => void;
}

export const TimeModule: React.FC<TimeModuleProps> = ({ habit, handleOpen }) => {
    const getFormattedTimeCount = () => {
        const h = Math.floor(habit.progressTotal / 3600);
        const m = Math.floor((habit.progressTotal % 3600) / 60);

        const hString = h > 0 ? `${h} hr ` : '';
        const mString = m > 0 || (m == 0 && h == 0) ? `${m} m ` : '';

        return hString + mString;
    };

    return (
        <ProgressTimeInput onPress={handleOpen}>
            <ProgressText colour={GradientColours[habit.gradient].solid}>
                {getFormattedTimeCount()}
            </ProgressText>
        </ProgressTimeInput>
    );
};

interface TimeModalProps {
    minutes: number;
    hours: number;
    handleTimeChange: (values: { hours: number; minutes: number }) => void;
}

const TimeModalContainer = styled.View`
    background-color: ${(props) => props.theme.colors.card};
    padding: 16px;
    height: 100%;
`;

export const TimeModal = ({ minutes, hours, handleTimeChange }: TimeModalProps) => {
    return (
        <TimeModalContainer>
            <TimePicker
                value={{ hours, minutes }}
                hoursUnit='hr'
                minutesUnit='m'
                onChange={handleTimeChange}
            />
        </TimeModalContainer>
    );
};

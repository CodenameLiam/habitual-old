import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { GradientShape } from 'Styles/Colours';
import { Container, ScheduleButton, ScheduleText } from './Scheduler.styles';

interface ScheduleProps {
    gradient: GradientShape;
    schedule: ScheduleType;
    setSchedule: (newSchedule: ScheduleType) => void;
}

const dimensions = Dimensions.get('screen').width / 10;

export const Scheduler = ({ gradient, schedule, setSchedule }: ScheduleProps) => {
    const handleSchedule = (day: ScheduleTypeValue) => {
        const tempSchedule = schedule;
        tempSchedule[day] = !tempSchedule[day];
        setSchedule(tempSchedule);
        impactAsync(ImpactFeedbackStyle.Light);
    };

    return (
        <Container>
            {Object.keys(schedule).map((day) => (
                <ScheduleButton
                    key={day}
                    dimensions={dimensions}
                    onPress={() => handleSchedule(day as ScheduleTypeValue)}>
                    {schedule[day as ScheduleTypeValue] && (
                        <LinearGradient
                            colors={[gradient.start, gradient.end]}
                            style={StyleSheet.absoluteFill}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        />
                    )}
                    <ScheduleText grey={!schedule[day as ScheduleTypeValue]}>{day[0]}</ScheduleText>
                </ScheduleButton>
            ))}
        </Container>
    );
};

export type ScheduleTypeValue = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

export interface ScheduleType {
    MON: boolean;
    TUE: boolean;
    WED: boolean;
    THU: boolean;
    FRI: boolean;
    SAT: boolean;
    SUN: boolean;
}

export const DEFAULT_SCHEDULE: ScheduleType = {
    MON: false,
    TUE: false,
    WED: false,
    THU: false,
    FRI: false,
    SAT: false,
    SUN: false,
};

export const EVERYDAY_SCHEDULE: ScheduleType = {
    MON: true,
    TUE: true,
    WED: true,
    THU: true,
    FRI: true,
    SAT: true,
    SUN: true,
};

export const WEEKDAY_SCHEDULE: ScheduleType = {
    MON: true,
    TUE: true,
    WED: true,
    THU: true,
    FRI: true,
    SAT: false,
    SUN: false,
};

export const WEEKEND_SCHEDULE: ScheduleType = {
    MON: false,
    TUE: false,
    WED: false,
    THU: false,
    FRI: false,
    SAT: true,
    SUN: true,
};

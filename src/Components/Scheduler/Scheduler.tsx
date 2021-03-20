import { useTheme } from '@react-navigation/native';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { GradientShape, GreyColours } from 'Styles/Colours';

interface ScheduleProps {
    gradient: GradientShape;
    schedule: ScheduleType;
    setSchedule: (newSchedule: ScheduleType) => void;
}

export const Scheduler = ({ gradient, schedule, setSchedule }: ScheduleProps) => {
    const { colors } = useTheme();

    const dimensions = Dimensions.get('screen').width / 10;

    const styles = StyleSheet.create({
        container: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 5,
            paddingBottom: 15,
        },
        schedule: {
            backgroundColor: colors.background,
            height: dimensions,
            width: dimensions,
            borderRadius: dimensions,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
        },
        gradient: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        },
        text: { fontFamily: 'Montserrat_600SemiBold', fontSize: 16 },
    });

    const handleSchedule = (day: ScheduleTypeValue) => {
        const tempSchedule = schedule;
        tempSchedule[day] = !tempSchedule[day];
        setSchedule(tempSchedule);
        impactAsync(ImpactFeedbackStyle.Light);
    };

    return (
        <View style={styles.container}>
            {Object.entries(schedule).map((day) => (
                <TouchableOpacity
                    key={`${day[0]}- ${day[1]}`}
                    style={styles.schedule}
                    onPress={() => handleSchedule(day[0] as ScheduleTypeValue)}>
                    {day[1] && (
                        <LinearGradient
                            colors={[gradient.start, gradient.end]}
                            style={styles.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        />
                    )}
                    <Text
                        style={[
                            styles.text,
                            day[1] ? { color: '#fff' } : { color: GreyColours.GREY2 },
                        ]}>
                        {day[0][0]}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
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

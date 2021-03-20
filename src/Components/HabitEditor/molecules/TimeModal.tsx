import { useTheme } from '@react-navigation/native';
import TimePicker from 'Components/TimePicker';
import React from 'react';
import { View } from 'react-native';

interface TimeModalProps {
    minutes: number;
    hours: number;
    handleTimeType: (values: { hours: number; minutes: number }) => void;
}

export const TimeModal: React.FC<TimeModalProps> = ({ minutes, hours, handleTimeType }) => {
    const { colors } = useTheme();

    return (
        <View
            style={{
                backgroundColor: colors.card,
                padding: 16,
                height: '100%',
            }}
        >
            <TimePicker value={{ hours, minutes }} hoursUnit="hr" minutesUnit="m" onChange={handleTimeType} />
        </View>
    );
};

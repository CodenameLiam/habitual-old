import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@react-navigation/native';
import { styles } from './TimePicker.styles';

export type ValueMap = {
	hours: number;
	minutes: number;
};

export type TimePickerProps = {
	value?: ValueMap;
	onChange?: ({ hours, minutes }: ValueMap) => void;
	hoursUnit?: string;
	minutesUnit?: string;
	zeroPadding?: boolean;
};

const zeroPad = (num: number): string => {
    if (num >= 0 && num <= 9) return `0${num}`;
    return num.toString();
};

const MAX_HOURS = 23;
const MAX_MINUTES = 59;

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, hoursUnit, minutesUnit, zeroPadding = false }) => {
    const { colors } = useTheme();
    const [internalHours, setInternalHours] = useState(value?.hours ?? 1);
    const [internalMinutes, setInternalMinutes] = useState(value?.minutes ?? 0);

    useEffect(() => {
        setInternalHours(value?.hours ?? 1);
        setInternalMinutes(value?.minutes ?? 0);
    }, [value]);

    const getLabel = (i: number, unit: string | undefined): string => {
        const numString = zeroPadding ? zeroPad(i) : i.toString();
        return `${numString} ${unit ?? ''}`;
    };

    const getHoursItems = (): JSX.Element[] => {
        const items: JSX.Element[] = [];
        for (let i = 0; i <= MAX_HOURS; i++) {
            items.push(<Picker.Item key={i} value={i} label={getLabel(i, hoursUnit)} color={colors.text} />);
        }
        return items;
    };

    const getMinutesItems = (): JSX.Element[] => {
        const items: JSX.Element[] = [];
        for (let i = 0; i <= MAX_MINUTES; i++) {
            items.push(<Picker.Item key={i} value={i} label={getLabel(i, minutesUnit)} color={colors.text} />);
        }
        return items;
    };

    const handleChangeHours = (hours: number): void => {
        setInternalHours(hours);
        const newValue = {
            minutes: internalMinutes,
            hours
        };
        onChange?.(newValue);
    };

    const handleChangeMinutes = (minutes: number): void => {
        setInternalMinutes(minutes);
        const newValue = {
            minutes,
            hours: internalHours
        };
        onChange?.(newValue);
    };

    return (
        <View style={styles.container}>
            <Picker
                style={[styles.picker]}
                selectedValue={internalHours}
                onValueChange={(itemValue) => handleChangeHours(itemValue as number)}
            >
                {getHoursItems()}
            </Picker>
            <Picker
                style={styles.picker}
                selectedValue={internalMinutes}
                onValueChange={(itemValue) => handleChangeMinutes(itemValue as number)}
            >
                {getMinutesItems()}
            </Picker>
        </View>
    );
};

export default TimePicker;

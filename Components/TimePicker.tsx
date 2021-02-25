import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@react-navigation/native';

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

const MAX_HOURS = 23;
const MAX_MINUTES = 59;

export function TimePicker({ value, onChange, hoursUnit, minutesUnit, zeroPadding = false }: TimePickerProps) {
	const { colors } = useTheme();
	const [internalHours, setInternalHours] = useState(value?.hours ?? 1);
	const [internalMinutes, setInternalMinutes] = useState(value?.minutes ?? 0);

	useEffect(() => {
		setInternalHours(value?.hours ?? 1);
		setInternalMinutes(value?.minutes ?? 0);
	}, [value]);

	const getLabel = (i: number, unit: string | undefined) => {
		const numString = zeroPadding ? zeroPad(i) : i.toString();
		return `${numString} ${unit ?? ''}`;
	};

	const getHoursItems = () => {
		const items = [];
		for (let i = 0; i <= MAX_HOURS; i++) {
			items.push(<Picker.Item key={i} value={i} label={getLabel(i, hoursUnit)} color={colors.text} />);
		}
		return items;
	};

	const getMinutesItems = () => {
		const items = [];
		for (let i = 1; i <= MAX_MINUTES; i++) {
			items.push(<Picker.Item key={i} value={i} label={getLabel(i, minutesUnit)} color={colors.text} />);
		}
		return items;
	};

	const handleChangeHours = (hours: number) => {
		setInternalHours(hours);
		const newValue = {
			minutes: internalMinutes,
			hours,
		};
		onChange?.(newValue);
	};

	const handleChangeMinutes = (minutes: number) => {
		setInternalMinutes(minutes);
		const newValue = {
			minutes,
			hours: internalHours,
		};
		onChange?.(newValue);
	};

	return (
		<View style={styles.container}>
			<Picker
				style={[styles.picker]}
				selectedValue={internalHours}
				onValueChange={(itemValue) => handleChangeHours(itemValue)}
			>
				{getHoursItems()}
			</Picker>
			<Picker
				style={styles.picker}
				selectedValue={internalMinutes}
				onValueChange={(itemValue) => handleChangeMinutes(itemValue)}
			>
				{getMinutesItems()}
			</Picker>
		</View>
	);
}

const zeroPad = (num: number) => {
	if (num >= 0 && num <= 9) return `0${num}`;
	return num.toString();
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
	},
	picker: {
		flex: 1,
	},
});

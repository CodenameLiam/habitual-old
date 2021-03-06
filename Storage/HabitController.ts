import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useEffect, useState } from 'react';
import { HabitProps, HabitType } from '../Components/Habit';
import { IconProps } from '../Components/Icon';
import { ScheduleType } from '../Components/Scheduler';
import { AppContext } from '../Context/AppContext';
import { GradientType } from '../Styles/Colours';
import { getData, storeData } from './StorageController';

const HABITS_KEY = '@Habits';

const getAllHabits = async () => {
	return await getData(HABITS_KEY);
};

export interface IHabit {
	id: string;
	name: string;
	icon: Partial<IconProps>;
	progressTotal: number;
	type: HabitType;
	schedule: ScheduleType;
	gradient: GradientType;
	dates: IHabitDate;
}

export interface IHabitDate {
	[date: string]: number;
}

export interface IHabitRecord {
	[id: string]: IHabit;
}

export const useHabits = () => {
	const [habits, setHabits] = useState<IHabitRecord>({});

	useEffect(() => {
		parseHabits();
	}, []);

	const parseHabits = async () => {
		const allHabits = await getAllHabits();
		allHabits && setHabits(allHabits);
	};

	const createHabit = async (habit: IHabit) => {
		let newHabits = { ...habits };
		newHabits[habit.id] = habit;

		setHabits(newHabits);
		storeData(HABITS_KEY, newHabits);
	};

	const updateHabit = async (habit: IHabit) => {
		let newHabits = { ...habits };
		newHabits[habit.id] = habit;

		setHabits(newHabits);
		storeData(HABITS_KEY, newHabits);
	};

	return { habits, setHabits, createHabit, updateHabit };
};

export const mergeDates = (dates: IHabitDate, date: string, progress: number) => {
	let newDates = { ...dates };
	newDates[date] = progress;
	return newDates;
};

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { HabitProps } from '../Components/Habit';
import { getData, storeData } from './StorageController';

const HABITS_KEY = '@Habits';

export const createHabit = async (habit: HabitProps) => {
	let allHabits = await getAllHabits();
	allHabits == null && (allHabits = {});
	allHabits[habit.id] = habit;
	await storeData(HABITS_KEY, allHabits);

	// console.log('\n\n');
	// console.log(allHabits);
};

const getAllHabits = async () => {
	return await getData(HABITS_KEY);
	// console.log(habits);
};

export const useHabits = () => {
	const [habits, setHabits] = useState<HabitProps[]>();

	useEffect(() => {
		parseHabits();
	}, []);

	const parseHabits = async () => {
		const allHabits = await getAllHabits();
		setHabits(Object.values(allHabits));
		// console.log(Object.values(allHabits));
	};

	const refetch = () => parseHabits();

	return { habits, setHabits, refetch };
};

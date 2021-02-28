import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useEffect, useState } from 'react';
import { HabitProps } from '../Components/Habit';
import { AppContext } from '../Context/AppContext';
import { getData, storeData } from './StorageController';

const HABITS_KEY = '@Habits';

export const createHabit = async (habit: HabitProps) => {
	let allHabits = await getAllHabits();
	allHabits == null && (allHabits = {});
	allHabits[habit.id] = habit;
	await storeData(HABITS_KEY, allHabits);
};

const getAllHabits = async () => {
	return await getData(HABITS_KEY);
};

export const useInitialHabits = () => {
	const [habits, setHabits] = useState<HabitProps[]>([]);

	useEffect(() => {
		parseHabits();
	}, []);

	const parseHabits = async () => {
		const allHabits = await getAllHabits();
		allHabits && setHabits(Object.values(allHabits));
	};

	return { habits, setHabits };
};

export const useHabits = () => {
	const [habits, setHabits] = useState<HabitProps[]>([]);

	useEffect(() => {
		parseHabits();
	}, []);

	const parseHabits = async () => {
		const allHabits = await getAllHabits();
		console.log(allHabits);
		allHabits && setHabits(Object.values(allHabits));
	};

	const createHabit = async (habit: HabitProps) => {
		setHabits([...habits, habit]);

		let allHabits = await getAllHabits();
		allHabits == null && (allHabits = {});
		allHabits[habit.id] = habit;
		await storeData(HABITS_KEY, allHabits);
	};

	const updateHabit = async (habit: HabitProps) => {
		console.log(habits);

		// console.log(habit);
		// console.log('\n\n\n');
	};

	return { habits, setHabits, createHabit, updateHabit };
};

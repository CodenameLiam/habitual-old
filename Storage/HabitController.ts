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

// export const useInitialHabits = () => {
// 	const [habits, setHabits] = useState<HabitProps[]>([]);

// 	useEffect(() => {
// 		parseHabits();
// 	}, []);

// 	const parseHabits = async () => {
// 		const allHabits = await getAllHabits();
// 		allHabits && setHabits(Object.values(allHabits));
// 	};

// 	return { habits, setHabits };
// };

export interface IHabitRecord {
	[id: string]: HabitProps;
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

	const createHabit = async (habit: HabitProps) => {
		let newHabits = { ...habits };
		newHabits[habit.id] = habit;

		setHabits(newHabits);
		storeData(HABITS_KEY, newHabits);
	};

	const updateHabit = async (habit: HabitProps) => {
		let newHabits = { ...habits };
		newHabits[habit.id] = habit;

		setHabits(newHabits);
		storeData(HABITS_KEY, newHabits);
	};

	return { habits, setHabits, createHabit, updateHabit };
};

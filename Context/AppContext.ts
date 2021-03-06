import { createContext } from 'react';
import { HabitProps } from '../Components/Habit';
import { IHabit, IHabitRecord } from '../Storage/HabitController';

interface IAppContext {
	habits: IHabitRecord;
	setHabits: React.Dispatch<React.SetStateAction<IHabitRecord>>;
	createHabit: (habit: IHabit) => Promise<void>;
	updateHabit: (habit: IHabit) => Promise<void>;
}

const DEFAULT_VALUE = {
	habits: {},
	setHabits: () => {},
	createHabit: async () => {},
	updateHabit: async () => {},
};

export const AppContext = createContext<IAppContext>(DEFAULT_VALUE);

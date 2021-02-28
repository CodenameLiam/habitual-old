import { createContext } from 'react';
import { HabitProps } from '../Components/Habit';

interface IAppContext {
	habits: HabitProps[];
	setHabits: React.Dispatch<React.SetStateAction<HabitProps[]>>;
	createHabit: (habit: HabitProps) => Promise<void>;
	updateHabit: (habit: HabitProps) => Promise<void>;
}

const DEFAULT_VALUE = {
	habits: [],
	setHabits: () => {},
	createHabit: async () => {},
	updateHabit: async () => {},
};

export const AppContext = createContext<IAppContext>(DEFAULT_VALUE);

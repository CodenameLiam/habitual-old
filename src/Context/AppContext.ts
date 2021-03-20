import React, { createContext } from 'react';
import { IHabit, IHabitRecord } from 'Controllers/HabitController';

interface IAppContext {
	habits: IHabitRecord;
	setHabits: React.Dispatch<React.SetStateAction<IHabitRecord>>;
	createHabit: (habit: IHabit) => Promise<void>;
	updateHabit: (habit: IHabit) => Promise<void>;
	deleteHabit: (id: string) => Promise<void>;
}

const DEFAULT_VALUE = {
    habits: {},
    setHabits: () => {},
    createHabit: async () => {},
    updateHabit: async () => {},
    deleteHabit: async () => {}
};

export const AppContext = createContext<IAppContext>(DEFAULT_VALUE);

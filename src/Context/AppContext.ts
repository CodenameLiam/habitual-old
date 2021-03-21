import { createContext } from 'react';
import { IHabit, IHabitRecord } from 'Controllers/HabitController';
import { GradientType } from 'Styles';

interface IAppContext {
    habits: IHabitRecord;
    // setHabits: React.Dispatch<React.SetStateAction<IHabitRecord>>;
    createHabit: (habit: IHabit) => Promise<void>;
    updateHabit: (habit: IHabit) => Promise<void>;
    deleteHabit: (id: string) => Promise<void>;
    colour: GradientType;
    setColour: (colour: GradientType) => Promise<void>;
}

const DEFAULT_VALUE: IAppContext = {
    habits: {},
    createHabit: async () => {},
    updateHabit: async () => {},
    deleteHabit: async () => {},
    colour: 'GREEN',
    setColour: async () => {},
};

export const AppContext = createContext<IAppContext>(DEFAULT_VALUE);

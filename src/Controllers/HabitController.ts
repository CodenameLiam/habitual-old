import React, { useEffect, useState } from 'react';
import { HabitType } from 'Components/Habit';
import { IconProps } from 'Components/Icon/Icon';
import { ScheduleType } from 'Components/Scheduler';
import { GradientType } from '../Styles/Colours';
import { getData, storeData } from './StorageController';

const HABITS_KEY = '@Habits';

const getAllHabits = async (): Promise<any> => {
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

export interface IHabitDateValue {
	progressTotal: number;
	progress: number;
}

export interface IHabitDate {
	[date: string]: IHabitDateValue;
}

export interface IHabitRecord {
	[id: string]: IHabit;
}

interface UseHabits {
    habits: IHabitRecord;
    setHabits: React.Dispatch<React.SetStateAction<IHabitRecord>>;
    createHabit: (habit: IHabit) => Promise<void>;
    updateHabit: (habit: IHabit) => Promise<void>;
    deleteHabit: (id: string) => Promise<void>;
}

export const useHabits = (): UseHabits => {
    const [habits, setHabits] = useState<IHabitRecord>({});

    const parseHabits = async (): Promise<void> => {
        const allHabits = await getAllHabits();
        allHabits && setHabits(allHabits);
    };

    const createHabit = async (habit: IHabit): Promise<void> => {
        const newHabits = { ...habits };
        newHabits[habit.id] = habit;

        setHabits(newHabits);
        storeData(HABITS_KEY, newHabits);
    };

    const updateHabit = async (habit: IHabit): Promise<void>  => {
        const newHabits = { ...habits };
        newHabits[habit.id] = habit;

        setHabits(newHabits);
        storeData(HABITS_KEY, newHabits);
    };

    const deleteHabit = async (id: string): Promise<void> => {
        const newHabits = { ...habits };
        delete newHabits[id];

        setHabits(newHabits);
        storeData(HABITS_KEY, newHabits);
    };

    useEffect(() => {
        parseHabits();
    }, []);

    return { habits, setHabits, createHabit, updateHabit, deleteHabit };
};

export const mergeDates = (
    dates: IHabitDate,
    date: string,
    progress: number,
    progressTotal: number
): IHabitDate => {
    const newDates = dates;
    newDates[date] = { progress: progress, progressTotal: progressTotal };
    return newDates;
};

import { useEffect, useState } from 'react';
import { HabitType } from 'Components/Habit';
import { IconProps } from 'Components/Icon/Icon';
import { DEFAULT_SCHEDULE, EVERYDAY_SCHEDULE, ScheduleType } from 'Components/Scheduler';
import { GradientType } from '../Styles/Colours';
import { getData, storeData } from './StorageController';
import { getRandomBytes } from 'expo-random';
import { getRandomColour } from 'Components/ColourPicker/GetRandomColour';

const HABITS_KEY = '@Habits';

export const getDefaultHabit = (gradient: GradientType): IHabit => {
    return {
        id: getRandomBytes(8).join(''),
        name: '',
        icon: { family: 'fontawesome5', name: 'icons' },
        type: 'count',
        progressTotal: 1,
        schedule: { ...EVERYDAY_SCHEDULE },
        gradient: gradient,
        dates: {},
    };
};

// const newHabit: IHabit = {
//     id: habit ? habit.id : getRandomBytes(8).join(''),
//     name: name,
//     icon: icon,
//     gradient: localGradient,
//     progressTotal: count,
//     type: type,
//     schedule: schedule,
//     dates: habit ? habit.dates : {},
// };

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

    const deleteHabit = async (id: string) => {
        let newHabits = { ...habits };
        delete newHabits[id];

        setHabits(newHabits);
        storeData(HABITS_KEY, newHabits);
    };

    return { habits, setHabits, createHabit, updateHabit, deleteHabit };
};

export const mergeDates = (
    dates: IHabitDate,
    date: string,
    progress: number,
    progressTotal: number
) => {
    let newDates = { ...dates };
    newDates[date] = { progress: progress, progressTotal: progressTotal };
    return newDates;
};

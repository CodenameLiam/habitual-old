import { ScheduleType, ScheduleTypeValue } from 'Components/Scheduler';
import { IHabit } from 'Controllers/HabitController';
import moment from 'moment';

export interface MarkedDate {
  [x: string]: {
      selected: boolean;
      customStyles: {
          container: {
              borderRadius: number;
          };
      };
      disabled?: boolean;
  };
}

export const sortDates = (allDates: string[]): string[] => {
    return allDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
};

export const getDaysToDisable = (habit: IHabit): number[] => {
    const unselectedDays: number[] = [];
    Object.keys(habit.schedule).forEach((schedule, index) => {
        if (!habit.schedule[schedule as ScheduleTypeValue]) {
            unselectedDays.push((index + 1) % 7);
        }
    });
    return unselectedDays;
};

export const getDisabledDates = (habit: IHabit, month: string, markedDates: MarkedDate[]): MarkedDate => {
    const disabledDates: MarkedDate = {};

    const start = moment(month).clone().startOf('month').subtract(1, 'month');
    const end = moment(month).clone().endOf('month').add(1, 'month');
    const daysToDisable = getDaysToDisable(habit);

    if (daysToDisable.length >= 0) {
        for (let m = moment(start); m.diff(end, 'days') <= 0; m.add(1, 'days')) {
            if (daysToDisable.includes(m.day())) {
                const day = m.format('YYYY-MM-DD');

                disabledDates[day] = {
                    ...markedDates[day],
                    disabled: true
                };
            }
        }
    }

    return disabledDates;
};

export const getMarkedDates = (habit: IHabit, today: string, month: string, allDates: string[]): MarkedDate[] => {
    let markedDates: MarkedDate[] = allDates
        .filter((date) => habit.dates[date] && habit.dates[date].progress >= habit.dates[date].progressTotal)
        .map((date) => ({
            [date]: { selected: true, customStyles: { container: { borderRadius: 10 } } }
        }));

    markedDates[today] = { ...markedDates[today], marked: true };
    markedDates = { ...markedDates, ...getDisabledDates(habit, month, markedDates) };

    return markedDates;
};

export const getInitialDate = (schedule: ScheduleType, displayDays: string[]): ScheduleTypeValue => {
    for (let i = displayDays.length - 1; i >= 0; i--) {
        if (schedule[displayDays[i] as ScheduleTypeValue]) {
            return displayDays[i] as ScheduleTypeValue;
        }
    }

    return displayDays[0] as ScheduleTypeValue;
};


import React, { createContext } from 'react';

interface ITimerContext {
	activeTimer: string | undefined;
	setActiveTimer: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const DEFAULT_VALUE: ITimerContext = {
    activeTimer: undefined,
    setActiveTimer: () => {}
};

export const TimerContext = createContext<ITimerContext>(DEFAULT_VALUE);

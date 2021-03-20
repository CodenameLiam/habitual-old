import React, { createContext } from 'react';
import { GradientType } from 'Styles/Colours';

interface IGradientContext {
	gradient: GradientType;
	setGradient: React.Dispatch<React.SetStateAction<GradientType>>;
	colour: GradientType;
	setColour: (colour: GradientType) => Promise<void>;
}

const DEFAULT_VALUE: IGradientContext = {
    gradient: 'RED',
    setGradient: () => {},
    colour: 'RED',
    setColour: async () => {}
};

export const GradientContext = createContext<IGradientContext>(DEFAULT_VALUE);

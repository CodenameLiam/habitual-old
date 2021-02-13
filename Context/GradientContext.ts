import { createContext } from 'react';
import { GradientColours, GradientType } from '../Styles/Colours';

interface IGradientContext {
	gradient: GradientType;
	setGradient: React.Dispatch<React.SetStateAction<GradientType>>;
}

const DEFAULT_VALUE = {
	gradient: GradientColours.RED,
	setGradient: () => {},
};

export const GradientContext = createContext<IGradientContext>(DEFAULT_VALUE);

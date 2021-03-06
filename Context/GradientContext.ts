import { createContext } from 'react';
import { GradientColours, GradientType, GradientShape } from '../Styles/Colours';

interface IGradientContext {
	gradient: GradientType;
	setGradient: React.Dispatch<React.SetStateAction<GradientType>>;
}

const DEFAULT_VALUE: IGradientContext = {
	gradient: 'RED',
	setGradient: () => {},
};

export const GradientContext = createContext<IGradientContext>(DEFAULT_VALUE);

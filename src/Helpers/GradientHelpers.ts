import { GradientColours, GradientType } from 'Styles';

const getRandomInt = (max: number): number => {
    return Math.floor(Math.random() * max);
};

export const randomGradient = (): GradientType => {
    const gradientKeys = Object.keys(GradientColours);
    const randomGradientIndex = getRandomInt(gradientKeys.length);
    const randomGradientResult = gradientKeys[randomGradientIndex];
    return randomGradientResult as GradientType;
};

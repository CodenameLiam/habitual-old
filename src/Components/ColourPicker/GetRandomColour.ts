import { GradientColours, GradientType } from 'Styles';

export const getRandomColour = (): GradientType => {
    const gradientKeys = Object.keys(GradientColours);
    const randomGradientIndex = getRandomInt(gradientKeys.length);
    const randomGradientResult = gradientKeys[randomGradientIndex];
    return randomGradientResult as GradientType;
};

const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
};

// export default getRandomColour();

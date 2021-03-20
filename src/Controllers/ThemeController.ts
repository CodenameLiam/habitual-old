import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native-appearance';
import { GradientType, GreyColours } from '../Styles/Colours';
import { getValue, storeValue } from './StorageController';

export type ThemeType = 'dark' | 'light';
export const DEFAULT_COLOUR = 'GREEN';

interface UseCustomeTheme {
    theme: ThemeType | undefined;
    setTheme: (theme: ThemeType) => Promise<void>;
    toggleTheme: (theme: ThemeType) => 'light' | 'dark';
    colour: GradientType;
    setColour: (colour: GradientType) => Promise<void>;
}

export const useCustomTheme = (): UseCustomeTheme => {
    const systemTheme = useColorScheme();
    const THEME_KEY = '@Theme';
    const DEFAULT_THEME = systemTheme === 'dark' ? 'dark' : 'light';

    const COLOUR_KEY = '@Colour';

    const [theme, setCustomTheme] = useState<ThemeType | undefined>();
    const [colour, setCustomColour] = useState<GradientType>(DEFAULT_COLOUR);

    const toggleTheme = (theme: ThemeType): ThemeType => {
        return theme === 'dark' ? 'light' : 'dark';
    };

    const setTheme = async (theme: ThemeType): Promise<void> => {
        setCustomTheme(theme);
        await storeValue(THEME_KEY, theme);
    };

    const setColour = async (colour: GradientType): Promise<void> => {
        setCustomColour(colour);
        await storeValue(COLOUR_KEY, colour);
    };

    const configureTheme = async (): Promise<void> => {
        const themeSettings = await getValue(THEME_KEY);

        if (!themeSettings) {
            setTheme(DEFAULT_THEME);
        } else {
            setCustomTheme(themeSettings as ThemeType);
        }
    };

    const configureColour = async (): Promise<void> => {
        const colourSettings = await getValue(COLOUR_KEY);

        if (!colourSettings) {
            setColour(DEFAULT_COLOUR);
        } else {
            setCustomColour(colourSettings as GradientType);
        }
    };

    useEffect(() => {
        configureTheme();
        configureColour();
    }, []);

    return { theme, setTheme, toggleTheme, colour, setColour };
};

export const CustomDarkTheme = {
    dark: true,
    colors: {
        primary: '#FFFFFF',
        text: '#FFFFFF',
        background: '#0F2028',
        border: GreyColours.GREY4,
        card: '#223843',
        notification: 'red'
    }
};

export const CustomLightTheme = {
    dark: false,
    colors: {
        primary: '#FFFFFF',
        text: '#0F2028',
        background: '#f4f4f4',
        border: GreyColours.GREY2,
        card: '#fff',
        notification: 'red'
    }
};

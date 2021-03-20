import { getRandomColour } from 'Components/ColourPicker/GetRandomColour';
import { IHabitRecord } from 'Controllers/HabitController';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GradientColours, GradientType } from 'Styles/Colours';

interface HeaderBackgroundProps {
    colour: GradientType;
}

const HeaderBackground: React.FC<HeaderBackgroundProps> = ({ colour }) => {
    return (
        <LinearGradient
            colors={[GradientColours[colour].start, GradientColours[colour].end]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
        />
    );
};

export default HeaderBackground;

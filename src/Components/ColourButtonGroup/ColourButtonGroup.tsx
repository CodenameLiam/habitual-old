import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GreyColours } from 'Styles/Colours';

interface ColouredButtonGroupProps {
	colour: string;
	buttons: string[];
	activeTitle?: string;
	buttonFunctions: (() => void)[];
}

export const ColourButtonGroup = ({
    buttons,
    buttonFunctions,
    colour,
    activeTitle
}: ColouredButtonGroupProps) => {
    const width = 95 / buttons.length;

    const styles = StyleSheet.create({
        button: {
            backgroundColor: colour + '50',
            borderRadius: 5,
            width: `${width}%`
        },
        container: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' },
        text: {
            color: colour,
            fontFamily: 'Montserrat_600SemiBold',
            textAlign: 'center'
        },
        touchable: {
            padding: 8
        }
    });

    const getColour = (title: string, background: boolean) => {
        if (activeTitle !== undefined) {
            const backgroundColour = title === activeTitle ? colour : GreyColours.GREY2;
            return background
                ? { backgroundColor: backgroundColour + '50' }
                : { color: backgroundColour };
        }
    };

    return (
        <View style={styles.container}>
            {buttons.length == buttonFunctions.length &&
				buttons.map((title, index) => (
				    <View key={index + title} style={[styles.button, getColour(title, true)]}>
				        <TouchableOpacity style={styles.touchable} onPress={buttonFunctions[index]}>
				            <Text style={[styles.text, getColour(title, false)]}>{title}</Text>
				        </TouchableOpacity>
				    </View>
				))}
        </View>
    );
};

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GreyColours } from 'Styles/Colours';

interface ColouredButtonGroupProps {
	colour: string;
	buttons: string[];
	activeTitle?: string;
	buttonFunctions: (() => void)[];
}

interface GetColour {
    backgroundColor?: string,
    color?: string,
}

const getColour = (colour: string, title: string, background: boolean, activeTitle?: string): GetColour => {
    const style: GetColour = {
        backgroundColor: undefined,
        color: undefined,
    };

    if (activeTitle) {
        const backgroundColour = title === activeTitle ? colour : GreyColours.GREY2;
        if (background) {
            style.backgroundColor = backgroundColour + '50';
        } else {
            style.color = backgroundColour;
        }
    }

    return style;
};

export const ColourButtonGroup: React.FC<ColouredButtonGroupProps> = ({
    buttons,
    buttonFunctions,
    colour,
    activeTitle
}) => {
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

    return (
        <View style={styles.container}>
            {buttons.length === buttonFunctions.length &&
				buttons.map((title, index) => (
				    <View key={index + title} style={[styles.button, getColour(colour, title, false, activeTitle)]}>
				        <TouchableOpacity style={styles.touchable} onPress={buttonFunctions[index]}>
				            <Text style={[styles.text, getColour(colour, title, false, activeTitle)]}>{title}</Text>
				        </TouchableOpacity>
				    </View>
				))}
        </View>
    );
};

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ColouredButtonGroupProps {
	colour: string;
	buttons: string[];
	buttonFunctions: (() => void)[];
}

export const ColourButtonGroup = ({
	buttons,
	buttonFunctions,
	colour,
}: ColouredButtonGroupProps) => {
	const width = 95 / buttons.length;

	const styles = StyleSheet.create({
		container: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' },
		button: {
			backgroundColor: colour + '50',
			width: `${width}%`,
			borderRadius: 5,
		},
		touchable: {
			flex: 1,
			padding: 8,
		},
		text: {
			textAlign: 'center',
			fontFamily: 'Montserrat_600SemiBold',
			color: colour,
		},
	});

	return (
		<View style={styles.container}>
			{buttons.length == buttonFunctions.length &&
				buttons.map((title, index) => (
					<View key={index} style={styles.button}>
						<TouchableOpacity style={styles.touchable} onPress={buttonFunctions[index]}>
							<Text style={styles.text}>{title}</Text>
						</TouchableOpacity>
					</View>
				))}
		</View>
	);
};

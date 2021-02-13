import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { GradientType, GradientColours } from '../Styles/Colours';

interface ColourPickerProps {
	updateGradient: (gradient: GradientType) => void;
}

export const ColourPicker = ({ updateGradient }: ColourPickerProps) => {
	const colourPickerDimensions = Dimensions.get('window').width / 8.5;

	const gradientValues = Object.values(GradientColours);
	const halfGradientValues = Math.floor(gradientValues.length / 2);
	const firstColours = gradientValues.slice(0, halfGradientValues);
	const lastColours = gradientValues.slice(halfGradientValues, gradientValues.length);
	const combinedColours = [firstColours, lastColours];

	const styles = StyleSheet.create({
		swatch: {
			height: colourPickerDimensions,
			width: colourPickerDimensions,
			margin: 5,
			borderRadius: colourPickerDimensions,
			overflow: 'hidden',
		},
		gradient: {
			flex: 1,
		},
		container: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
		},
	});

	return (
		<View>
			{combinedColours.map((half, index) => (
				<View key={`Half${index}`} style={styles.container}>
					{half.map((gradient, index) => (
						<TouchableOpacity
							key={index}
							onPress={() => updateGradient(gradient)}
							style={styles.swatch}>
							<LinearGradient
								colors={[gradient.start, gradient.end]}
								style={styles.gradient}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 0 }}
							/>
						</TouchableOpacity>
					))}
				</View>
			))}
		</View>
	);
};

const getRandomInt = (max: number) => {
	return Math.floor(Math.random() * max);
};

export const randomGradient = () => {
	const gradientKeys = Object.values(GradientColours);
	const randomGradientIndex = getRandomInt(gradientKeys.length);
	const randomGradientResult = gradientKeys[randomGradientIndex];
	return randomGradientResult;
};

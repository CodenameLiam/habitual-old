import { Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AppNavProps } from '../Navigation/AppNavigation';
import { GradientColours, GradientType } from '../Styles/Colours';

interface AddProps {
	navigation: AppNavProps;
}

const getRandomInt = (max: number) => {
	return Math.floor(Math.random() * max);
};

const randomGradient = () => {
	const gradientKeys = Object.values(GradientColours);
	const randomGradientIndex = getRandomInt(gradientKeys.length);
	const randomGradientResult = gradientKeys[randomGradientIndex];
	return randomGradientResult;
};

export default function Add({ navigation }: AddProps) {
	const [gradientColours, setGradientColours] = useState<GradientType>();

	useEffect(() => {
		const gradientColour: GradientType = randomGradient();
		setGradientColours(gradientColour);

		navigation.setOptions({
			headerBackground: () => (
				<LinearGradient
					colors={[gradientColour.start, gradientColour.end]}
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						top: 0,
						bottom: 0,
					}}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
				/>
			),
		});
		// setGradientColours(randomGradient())
	}, []);

	const colourPickerDimensions = 40;

	const gradientValues = Object.values(GradientColours);
	const firstColours = gradientValues.slice(0, 4);
	const lastColours = gradientValues.slice(4, gradientValues.length);

	return (
		<ScrollView style={{ flex: 1 }} scrollEnabled={false}>
			<View style={{ flex: 1, padding: 10 }}>
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
					}}>
					{firstColours.map((gradient, index) => (
						<TouchableOpacity
							key={index}
							onPress={() =>
								navigation.setOptions({
									headerBackground: () => (
										<LinearGradient
											// Background Linear Gradient
											colors={[gradient.start, gradient.end]}
											style={{
												position: 'absolute',
												left: 0,
												right: 0,
												top: 0,
												bottom: 0,
											}}
											start={{ x: 0, y: 0 }}
											end={{ x: 1, y: 0 }}
										/>
									),
								})
							}
							style={{
								height: colourPickerDimensions,
								width: colourPickerDimensions,
								margin: 5,
								borderRadius: colourPickerDimensions,
								overflow: 'hidden',
							}}>
							<LinearGradient
								// Background Linear Gradient
								colors={[gradient.start, gradient.end]}
								style={{
									flex: 1,
								}}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 0 }}
							/>
						</TouchableOpacity>
					))}
				</View>
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
					}}>
					{lastColours.map((gradient, index) => (
						<TouchableOpacity
							key={index}
							onPress={() =>
								navigation.setOptions({
									headerBackground: () => (
										<LinearGradient
											// Background Linear Gradient
											colors={[gradient.start, gradient.end]}
											style={{
												position: 'absolute',
												left: 0,
												right: 0,
												top: 0,
												bottom: 0,
											}}
											start={{ x: 0, y: 0 }}
											end={{ x: 1, y: 0 }}
										/>
									),
								})
							}
							style={{
								height: colourPickerDimensions,
								width: colourPickerDimensions,
								margin: 5,
								borderRadius: colourPickerDimensions,
								overflow: 'hidden',
							}}>
							<LinearGradient
								colors={[gradient.start, gradient.end]}
								style={{
									flex: 1,
								}}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 0 }}
							/>
						</TouchableOpacity>
					))}
				</View>
			</View>
		</ScrollView>

		// <ScrollView>
		// 	<View style={{ height: 100 }}>
		// 		{gradientColours && (
		// 			<LinearGradient
		// 				// Background Linear Gradient
		// 				colors={[gradientColours.start, gradientColours.end]}
		// 				style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
		// 				start={{ x: 0, y: 0 }}
		// 				end={{ x: 1, y: 0 }}
		// 			/>
		// 		)}

		// 		<Text>Yeet</Text>
		// 		<Button
		// 			onPress={() =>
		// 				navigation.setOptions({
		// 					headerBackground: () => (
		// 						<LinearGradient
		// 							// Background Linear Gradient
		// 							colors={['#f4a261', '#fcbf49']}
		// 							style={{
		// 								position: 'absolute',
		// 								left: 0,
		// 								right: 0,
		// 								top: 0,
		// 								bottom: 0,
		// 							}}
		// 							start={{ x: 0, y: 0 }}
		// 							end={{ x: 1, y: 0 }}
		// 						/>
		// 					),
		// 				})
		// 			}
		// 			title='Change Header Color'
		// 			color='black'
		// 		/>
		// 	</View>
		// </ScrollView>
	);
}

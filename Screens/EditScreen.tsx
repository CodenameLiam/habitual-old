import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect } from 'react';
import HabitEdtor from '../Components/HabitEditor';
import { AppContext } from '../Context/AppContext';
import { AppStackParamList } from '../Navigation/AppNavigation';
import { GradientColours } from '../Styles/Colours';

import { StyleSheet } from 'react-native';
import { GradientContext } from '../Context/GradientContext';

export type EditNavProps = StackNavigationProp<AppStackParamList, 'Edit'>;
export type EditRoute = RouteProp<AppStackParamList, 'Edit'>;

interface EditProps {
	navigation: EditNavProps;
	route: EditRoute;
}

export default function EditScreen({ navigation, route }: EditProps) {
	const { habits } = useContext(AppContext);
	const { gradient } = useContext(GradientContext);
	const { id } = route.params;

	useEffect(() => {
		navigation.setOptions({
			headerBackground: () => (
				<LinearGradient
					colors={[GradientColours[gradient].start, GradientColours[gradient].end]}
					style={StyleSheet.absoluteFill}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
				/>
			),
		});
	}, [gradient]);

	return <HabitEdtor navigation={navigation} habit={habits[id]} resetGradient={false} />;
}

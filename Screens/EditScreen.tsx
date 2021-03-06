import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import HabitEdtor from '../Components/HabitEditor';
import { AppContext } from '../Context/AppContext';
import { AppStackParamList } from '../Navigation/AppNavigation';

export type EditNavProps = StackNavigationProp<AppStackParamList, 'Edit'>;
export type EditRoute = RouteProp<AppStackParamList, 'Edit'>;

interface EditProps {
	navigation: EditNavProps;
	route: EditRoute;
}

export default function EditScreen({ navigation, route }: EditProps) {
	const { habits } = useContext(AppContext);
	const { id } = route.params;

	return <HabitEdtor navigation={navigation} habit={habits[id]} />;
}

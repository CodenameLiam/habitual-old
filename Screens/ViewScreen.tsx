import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useContext } from 'react';
import { View, Text } from 'react-native';
import { AppContext } from '../Context/AppContext';
import { AppStackParamList } from '../Navigation/AppNavigation';
import { EditNavProps, EditRoute } from './EditScreen';

export type ViewNavProps = StackNavigationProp<AppStackParamList, 'View'>;
export type ViewRoute = RouteProp<AppStackParamList, 'View'>;

interface EditProps {
	navigation: EditNavProps;
	route: EditRoute;
}

export default function ViewScreen({ navigation, route }: EditProps) {
	// const rootNavigation: ViewNavProps = navigation.dangerouslyGetParent();
	const { habits } = useContext(AppContext);
	const { id } = route.params;

	console.log(habits[id].name);

	useFocusEffect(
		useCallback(() => {
			navigation.setOptions({ title: habits[id].name });
			// if (rootNavigation) {

			// 	rootNavigation.setOptions({
			// 		title: habits[id].name,
			// 	});
			// }
		}, [navigation, habits[id].name])
	);

	return (
		<View>
			<Text>View</Text>
		</View>
	);
}

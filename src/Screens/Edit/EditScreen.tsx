import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import HabitEdtor from 'Components/HabitEditor';
import { AppContext } from 'Context/AppContext';
import { AppStackParamList } from 'Navigation/AppNavigation';

export type EditNavProps = StackNavigationProp<AppStackParamList, 'Edit'>;
export type EditRoute = RouteProp<AppStackParamList, 'Edit'>;

interface EditProps {
	navigation: EditNavProps;
	route: EditRoute;
}

const EditScreen: React.FC<EditProps> = ({ navigation, route }) => {
    const { habits } = useContext(AppContext);
    const { id } = route.params;

    return <HabitEdtor navigation={navigation} habit={habits[id]} />;
};

export default EditScreen;

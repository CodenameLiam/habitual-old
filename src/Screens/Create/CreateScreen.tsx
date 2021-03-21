import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from 'Navigation';
import HabitEditor from 'Components/HabitEditor';

export type CreateNavProps = StackNavigationProp<AppStackParamList, 'Create'>;
export type CreateRoute = RouteProp<AppStackParamList, 'Create'>;

interface CreateProps {
    navigation: CreateNavProps;
    route: CreateRoute;
}

const CreateScreen: React.FC<CreateProps> = ({ navigation, route }) => {
    return (
        <HabitEditor
            navigation={navigation}
            gradient={route.params.gradient}
            icon={route.params.icon}
            iconBackRoute='Create'
        />
    );
};

export default CreateScreen;

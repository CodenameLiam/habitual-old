import React from 'react';
import HabitEdtor from 'Components/HabitEditor';
import { EditNavProps } from 'Screens/Edit';

interface CreateProps {
	navigation: EditNavProps;
}

const CreateScreen: React.FC<CreateProps> = ({ navigation }) => {
    return <HabitEdtor navigation={navigation} />;
};

export default CreateScreen;

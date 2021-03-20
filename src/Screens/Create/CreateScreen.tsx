import React from 'react';
import HabitEdtor from 'Components/HabitEditor';
import { EditNavProps } from 'Screens/Edit';

interface CreateProps {
	navigation: EditNavProps;
}

export default function CreateScreen ({ navigation }: CreateProps) {
    return <HabitEdtor navigation={navigation} />;
}

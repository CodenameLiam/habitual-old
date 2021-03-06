import React, { useEffect, useState } from 'react';
import { ActivityIndicator, InteractionManager, View } from 'react-native';
import HabitEdtor from '../Components/HabitEditor';
import { EditNavProps } from './EditScreen';

interface CreateProps {
	navigation: EditNavProps;
}

export default function CreateScreen({ navigation }: CreateProps) {
	return <HabitEdtor navigation={navigation} />;
	// return <View></View>;
}

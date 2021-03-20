import { getRandomBytes } from 'expo-random';
import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { EVERYDAY_SCHEDULE } from 'Components/Scheduler';
import { AppContext } from 'Context/AppContext';
import { IHabit } from 'Controllers/HabitController';

interface HabitIdeas {
	[key: string]: IHabit;
}

// type HabitIdeaType = "WATER"

const Habits: HabitIdeas = {
	WATER: {
		id: 'temp',
		name: 'Drink Water',
		progressTotal: 3,
		icon: {
			family: 'feather',
			name: 'sun',
		},
		gradient: 'BLUE',
		type: 'count',
		schedule: EVERYDAY_SCHEDULE,
		dates: {},
	},
};

export default function IdeaScreen() {
	const { createHabit } = useContext(AppContext);

	const handleCreate = () => {
		const habit: IHabit = { ...Habits['WATER'], id: getRandomBytes(8).join('') };
		createHabit(habit);
	};
	return (
		<View>
			<TouchableOpacity onPress={handleCreate}>
				<Text>Idea Drink Water</Text>
			</TouchableOpacity>
		</View>
	);
}

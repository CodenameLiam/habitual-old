import React, { createRef, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
	View,
	Button,
	Animated,
	Easing,
	Text,
	StyleSheet,
	Dimensions,
	TouchableWithoutFeedback,
	TouchableOpacity,
} from 'react-native';
import { RouteProp, useFocusEffect, useTheme } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../Navigation/TabNavigation';
import { Entypo } from '@expo/vector-icons';
import { PanGestureHandler, PanGestureHandlerGestureEvent, RectButton, ScrollView } from 'react-native-gesture-handler';
import Icon, { IconProps } from '../Components/Icon';
import TextTicker from 'react-native-text-ticker';
import Emoji from 'react-native-emoji';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientColours, GradientType } from '../Styles/Colours';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { color, round } from 'react-native-reanimated';
import { Habit } from '../Components/Habit';
import { useHabits } from '../Storage/HabitController';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRandomBytes } from 'expo-random';
import { AppStackParamList } from '../Navigation/AppNavigation';
import { AppContext } from '../Context/AppContext';

type HomeNavProps = BottomTabNavigationProp<TabParamList, 'Home'>;
type TabRouteProps = RouteProp<AppStackParamList, 'Tabs'>;

interface HomeProps {
	navigation: HomeNavProps;
	route: TabRouteProps;
}

// const habit = {
// 	// id: getRandomBytes(8).join(''),
// 	name: 'Read',
// 	icon: { family: 'feather', name: 'book' },
// 	// gradient: GradientColours.PURPLE,
// 	progress: 1,
// 	progressTotal: 4,
// 	type: 'count',
// };

export default function HomeScreen({ navigation, route }: HomeProps) {
	const { habits } = useContext(AppContext);

	// const { habits } = useHabits();
	// AsyncStorage.clear();

	// useEffect(() => {
	// 	if (refresh) {
	// 		console.log('Refresh');
	// 		console.log('\n\n\n\n\n');

	// 		console.log('Habit state');
	// 		console.log(habits);
	// 		console.log('\n\n\n\n\n');
	// 		refetch();
	// 		setRefresh(false);
	// 	}
	// }, [refresh]);

	// if (refresh) {
	// 	refetch();
	// 	setRefresh(false);
	// }

	// console.log(refresh);

	// useEffect(() => {
	// 	route.params && route.params.refresh && console.log('WOULD HAVE REFRESHED');
	// }, []);

	// AsyncStorage.clear();

	// console.log(route.params);

	// console.log(habits);

	const [day] = useState('Today');

	// AsyncStorage.clear();

	useFocusEffect(
		useCallback(() => {
			const stackNavigator = navigation.dangerouslyGetParent();
			if (stackNavigator) {
				stackNavigator.setOptions({
					title: day,
				});
			}
		}, [navigation, day])
	);

	return (
		<ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
			<View style={{ flex: 1, padding: 10 }}>
				{/* {Object.keys(GradientColours).map((color, index) => {
					const id = getRandomBytes(8).join('');
					// @ts-ignore
					return <Habit key={id} {...habit} id={id} gradient={GradientColours[color]} />;
				})} */}

				{/* <Button title='Refetch' onPress={() => refetch()} /> */}
				{/* {HabitMap.map((habit) => (
					<Habit
						key={habit.id}
						id={habit.id}
						name={habit.name}
						icon={habit.icon}
						gradient={habit.gradient}
						progress={habit.progress}
						progressTotal={habit.progressTotal}
						type={habit.type}
					/>
				))} */}

				{habits &&
					habits.map((habit) => (
						<Habit
							key={habit.id}
							id={habit.id}
							name={habit.name}
							icon={habit.icon}
							gradient={habit.gradient}
							progress={habit.progress}
							progressTotal={habit.progressTotal}
							type={habit.type}
							schedule={habit.schedule}
						/>
					))}
			</View>
		</ScrollView>
	);
}

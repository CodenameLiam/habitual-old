import React, { createRef, useCallback, useEffect, useRef, useState } from 'react';
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
import {
	PanGestureHandler,
	PanGestureHandlerGestureEvent,
	RectButton,
	ScrollView,
} from 'react-native-gesture-handler';
import Icon, { IconProps } from '../Components/Icon';
import TextTicker from 'react-native-text-ticker';
import Emoji from 'react-native-emoji';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientColours, GradientType } from '../Styles/Colours';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { round } from 'react-native-reanimated';
import { Habit } from '../Components/Habit';

type HomeNavProps = BottomTabNavigationProp<TabParamList, 'Home'>;
type HomeRouteProps = RouteProp<TabParamList, 'Home'>;

interface HomeProps {
	navigation: HomeNavProps;
	route: HomeRouteProps;
}

export default function HomeScreen({ navigation }: HomeProps) {
	const [day] = useState('Today');

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
				{/* {HabitMap.map((habit, index) => (
					<Habit
						key={index}
						name={habit.name}
						icon={habit.icon}
						gradient={habit.gradient}
						progress={habit.progress}
						progressTotal={habit.progressTotal}
						type={habit.type}
					/>
				))} */}
			</View>
		</ScrollView>
	);
}

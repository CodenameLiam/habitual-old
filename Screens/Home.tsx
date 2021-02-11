import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Button, Animated, Easing, Text } from 'react-native';
import { RouteProp, useFocusEffect, useTheme } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../Navigation/TabNavigation';
import { Entypo } from '@expo/vector-icons';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Icon, { IconProps } from '../Components/Icon';
import TextTicker from 'react-native-text-ticker';
import Emoji from 'react-native-emoji';
import { LinearGradient } from 'expo-linear-gradient';

type HomeNavProps = BottomTabNavigationProp<TabParamList, 'Home'>;
type HomeRouteProps = RouteProp<TabParamList, 'Home'>;

interface HomeProps {
	navigation: HomeNavProps;
	route: HomeRouteProps;
}

export default function Home({ navigation }: HomeProps) {
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
				{HabitMap.map((habit, index) => (
					<Habit
						key={index}
						name={habit.name}
						icon={habit.icon}
						colour={habit.colour}
						emoji={habit.emoji}
					/>
				))}
			</View>
		</ScrollView>
	);
}

const HabitMap: HabitProps[] = [
	{
		name: 'Read a Book for 15 minutes a day ',
		colour: '#ffafcc',
		icon: { family: 'fontawesome', name: 'book' },
		emoji: 'orange_book',
	},
	{
		name: 'Work Out',
		colour: '#f4a261',
		icon: { family: 'fontawesome5', name: 'dumbbell' },
		emoji: 'weight_lifter',
	},
	{
		name: 'Work on App',
		colour: '#fcbf49',
		icon: { family: 'fontawesome5', name: 'apple' },
		emoji: 'iphone',
	},
	{
		name: 'Learn French',
		colour: '#4cc9f0',
		icon: { family: 'entypo', name: 'language' },
		emoji: 'fr',
	},
	{
		name: 'Read a Book',
		colour: '#f25c54',
		icon: { family: 'fontawesome', name: 'book' },
		emoji: 'orange_book',
	},
	{
		name: 'Work Out',
		colour: '#f8961e',
		icon: { family: 'fontawesome5', name: 'dumbbell' },
		emoji: 'weight_lifter',
	},
	{
		name: 'Work on App',
		colour: '#ffbe0b',
		icon: { family: 'fontawesome5', name: 'apple' },
		emoji: 'iphone',
	},
	{
		name: 'Learn French',
		colour: '#b9e769',
		icon: { family: 'entypo', name: 'language' },
		emoji: 'fr',
	},
	{
		name: 'Go for a Swim',
		colour: '#00f5d4',
		icon: { family: 'fontawesome5', name: 'swimmer' },
		emoji: 'swimmer',
	},
	{
		name: 'Play Piano',
		colour: '#ffd670',
		icon: { family: 'materialcommunity', name: 'piano' },
		emoji: 'musical_keyboard',
	},
	//
	{
		name: 'Work on App',
		colour: '#ff9770',
		icon: { family: 'fontawesome5', name: 'apple' },
		emoji: 'iphone',
	},
	{
		name: 'Learn French',
		colour: '#ff70a6',
		icon: { family: 'entypo', name: 'language' },
		emoji: 'fr',
	},
	{
		name: 'Go for a Swim',
		colour: '#70d6ff',
		icon: { family: 'fontawesome5', name: 'swimmer' },
		emoji: 'swimmer',
	},

	{
		name: 'Play Piano',
		colour: '#9381ff',
		icon: { family: 'materialcommunity', name: 'piano' },
		emoji: 'musical_keyboard',
	},
	{
		name: 'Play Piano',
		colour: '#fe6d73',
		icon: { family: 'materialcommunity', name: 'piano' },
		emoji: 'musical_keyboard',
	},
	{
		name: 'Play Piano',
		colour: '#1dd3b0',
		icon: { family: 'materialcommunity', name: 'piano' },
		emoji: 'musical_keyboard',
	},
	{
		name: 'Play Piano',
		colour: '#5c95ff',
		icon: { family: 'materialcommunity', name: 'piano' },
		emoji: 'musical_keyboard',
	},
];

interface HabitProps {
	name: string;
	icon: Partial<IconProps>;
	emoji: string;
	colour: string;
}

const Habit = ({ name, icon, colour, emoji }: HabitProps) => {
	const growAnim = useRef(new Animated.Value(0)).current;
	const [count, setCount] = useState(1);
	const [complete, setComplete] = useState(false);

	const { colors } = useTheme();

	useEffect(() => {
		grow();
	}, [count]);

	const grow = () => {
		Animated.timing(growAnim, {
			toValue: count,
			duration: 500,
			useNativeDriver: true,
			easing: Easing.out(Easing.quad),
		}).start();
	};

	const toggleComplete = () => {
		setCount(complete ? 1 : 18);
		setComplete(!complete);
	};

	const dimensions = 35;

	return (
		<View
			style={{
				backgroundColor: colors.card,
				height: 70,
				borderRadius: 10,
				overflow: 'hidden',
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',

				justifyContent: 'space-between',
				margin: 5,
			}}
		>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					flex: 1,
				}}
			>
				<View
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						height: dimensions,
						width: dimensions,
						borderRadius: dimensions,
						margin: 15,
					}}
				>
					<Emoji name={emoji} style={{ fontSize: 18, position: 'absolute', zIndex: 1 }} />
					{/* <Icon
						family={icon.family}
						name={icon.name}
						size={18}
						colour={colors.text}
						style={{ position: 'absolute', zIndex: 1 }}
					/> */}
					<Animated.View
						style={{
							backgroundColor: colour,
							height: 35,
							width: 35,
							transform: [{ scale: growAnim }],
							overflow: 'hidden',
							borderRadius: 700,
						}}
					>
						<LinearGradient
							// Background Linear Gradient
							colors={['#f4a261', '#fcbf49']}
							style={{ flex: 1 }}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
						/>
					</Animated.View>
				</View>

				<View
					style={{
						flex: 1,
					}}
				>
					<TextTicker
						style={{
							fontFamily: 'Montserrat_500Medium',
							fontSize: 18,
							color: colors.text,
						}}
						scroll
						animationType='bounce'
						duration={3000}
						bounceDelay={1500}
						marqueeDelay={1000}
						bouncePadding={{ left: 0, right: 0 }}
						// repeatSpacer={10}
					>
						{name}
					</TextTicker>
				</View>
			</View>
			<TouchableOpacity onPress={toggleComplete} style={{ padding: 26 }}>
				{complete ? (
					<Entypo name='check' size={20} color={colors.text} />
				) : (
					<Entypo name='circle' size={14} color={colors.text} />
				)}
			</TouchableOpacity>
		</View>
	);
};

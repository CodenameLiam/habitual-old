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
import { GradientColours, GradientType } from '../Styles/Colours';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

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
				{HabitMap.map((habit, index) => (
					<Habit
						key={index}
						name={habit.name}
						icon={habit.icon}
						colour={habit.colour}
						emoji={habit.emoji}
						gradient={habit.gradient}
					/>
				))}
			</View>
		</ScrollView>
	);
}

const HabitMap: HabitProps[] = [
	{
		name: 'Read a Book for 15 minutes a day ',
		icon: { family: 'feather', name: 'book' },
		emoji: 'orange_book',
		gradient: GradientColours.MIDNIGHT,
	},
	{
		name: 'Read a Book for 15 minutes a day ',
		icon: { family: 'feather', name: 'book-open' },
		emoji: 'orange_book',
		gradient: GradientColours.PURPLE,
	},
	{
		name: 'Play Piano',
		icon: { family: 'materialcommunity', name: 'piano' },
		emoji: 'musical_keyboard',
		gradient: GradientColours.PINK,
	},
	{
		name: 'Play the Drums',
		icon: { family: 'fontawesome5', name: 'drum' },
		emoji: 'musical_keyboard',
		gradient: GradientColours.RED,
	},
	{
		name: 'Play Sax',
		icon: { family: 'materialcommunity', name: 'saxophone' },
		emoji: 'musical_keyboard',
		gradient: GradientColours.PEACH,
	},
	{
		name: 'Play Piano',
		icon: { family: 'materialcommunity', name: 'piano' },
		emoji: 'musical_keyboard',
		gradient: GradientColours.TANGERINE,
	},
	{
		name: 'Play Piano',
		icon: { family: 'materialcommunity', name: 'piano' },
		emoji: 'musical_keyboard',
		gradient: GradientColours.ORANGE,
	},
	{
		name: 'Play Piano',
		icon: { family: 'materialcommunity', name: 'piano' },
		emoji: 'musical_keyboard',
		gradient: GradientColours.BLUE,
	},
	{
		name: 'Play Piano',
		icon: { family: 'materialcommunity', name: 'piano' },
		emoji: 'musical_keyboard',
		gradient: GradientColours.VIOLET,
	},
	{
		name: 'Play Piano',
		icon: { family: 'materialcommunity', name: 'piano' },
		emoji: 'musical_keyboard',
		gradient: GradientColours.SKY,
	},
	{
		name: 'Play Piano',
		icon: { family: 'materialcommunity', name: 'piano' },
		emoji: 'musical_keyboard',
		gradient: GradientColours.GREEN,
	},
	{
		name: 'Play Piano',
		icon: { family: 'materialcommunity', name: 'piano' },
		emoji: 'musical_keyboard',
		gradient: GradientColours.LIME,
	},
];

interface HabitProps {
	name: string;
	icon: Partial<IconProps>;
	emoji: string;
	colour?: string;
	gradient: GradientType;
}

const Habit = ({ name, icon, colour, emoji, gradient }: HabitProps) => {
	const growAnim = useRef(new Animated.Value(0)).current;
	const interpolatedSize = growAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 18] });
	const [count, setCount] = useState(0);
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
		setCount(complete ? 0 : 1);
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
			}}>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					flex: 1,
				}}>
				<View
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						height: dimensions,
						width: dimensions,
						borderRadius: dimensions,
						margin: 15,
					}}>
					{/* <Emoji name={emoji} style={{ fontSize: 18, position: 'absolute', zIndex: 1 }} /> */}
					<Icon
						family={icon.family}
						name={icon.name}
						size={18}
						colour={colors.text}
						style={{ position: 'absolute', zIndex: 1 }}
					/>
					<Animated.View
						style={{
							backgroundColor: gradient.solid,
							height: 35,
							width: 35,
							transform: [{ scale: interpolatedSize }],
							overflow: 'hidden',
							borderRadius: 700,
						}}>
						<LinearGradient
							colors={[gradient.start, gradient.end]}
							locations={[0.5, 1]}
							style={{
								flex: 1,
							}}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
						/>
					</Animated.View>
				</View>

				<View
					style={{
						flex: 1,
					}}>
					<TextTicker
						style={{
							fontFamily: 'Montserrat_600SemiBold',
							fontSize: 18,
							color: colors.text,
						}}
						scroll
						animationType='bounce'
						duration={3000}
						bounceDelay={1500}
						marqueeDelay={1000}
						bouncePadding={{ left: 0, right: 0 }}>
						{name}
					</TextTicker>
				</View>
			</View>
			<TouchableOpacity onPress={toggleComplete} style={{ padding: 26 }}>
				{complete ? (
					<Entypo name='check' size={20} color={colors.text} />
				) : (
					<FontAwesome name='circle-o' size={14} color={colors.text} />
				)}
			</TouchableOpacity>
		</View>
	);
};

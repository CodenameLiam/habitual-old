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
						gradient={habit.gradient}
						progress={habit.progress}
						progressTotal={habit.progressTotal}
						type={habit.type}
						timeType={habit.timeType}
					/>
				))}
			</View>
		</ScrollView>
	);
}

const HabitMap: HabitProps[] = [
	{
		name: 'Read',
		icon: { family: 'feather', name: 'book' },
		gradient: GradientColours.RED,
		progress: 1,
		progressTotal: 1,
		type: 'check',
	},
	{
		name: 'Eat Veggies',
		icon: { family: 'feather', name: 'book-open' },
		gradient: GradientColours.PEACH,
		progress: 1,
		progressTotal: 30,
		type: 'count',
	},
	{
		name: 'Eat Veggies',
		icon: { family: 'feather', name: 'book-open' },
		gradient: GradientColours.LIME,
		progress: 0,
		progressTotal: 30,
		type: 'timer',
	},
	// {
	// 	name: 'Play Piano',
	// 	icon: { family: 'materialcommunity', name: 'piano' },
	// 	emoji: 'musical_keyboard',
	// 	gradient: GradientColours.PINK,
	// },
	// {
	// 	name: 'Play the Drums',
	// 	icon: { family: 'fontawesome5', name: 'drum' },
	// 	emoji: 'musical_keyboard',
	// 	gradient: GradientColours.RED,
	// },
	// {
	// 	name: 'Play Sax',
	// 	icon: { family: 'materialcommunity', name: 'saxophone' },
	// 	emoji: 'musical_keyboard',
	// 	gradient: GradientColours.PEACH,
	// },
	// {
	// 	name: 'Play Piano',
	// 	icon: { family: 'materialcommunity', name: 'piano' },
	// 	emoji: 'musical_keyboard',
	// 	gradient: GradientColours.TANGERINE,
	// },
	// {
	// 	name: 'Play Piano',
	// 	icon: { family: 'materialcommunity', name: 'piano' },
	// 	emoji: 'musical_keyboard',
	// 	gradient: GradientColours.ORANGE,
	// },
	// {
	// 	name: 'Play Piano',
	// 	icon: { family: 'materialcommunity', name: 'piano' },
	// 	emoji: 'musical_keyboard',
	// 	gradient: GradientColours.BLUE,
	// },
	// {
	// 	name: 'Play Piano',
	// 	icon: { family: 'materialcommunity', name: 'piano' },
	// 	emoji: 'musical_keyboard',
	// 	gradient: GradientColours.VIOLET,
	// },
	// {
	// 	name: 'Play Piano',
	// 	icon: { family: 'materialcommunity', name: 'piano' },
	// 	emoji: 'musical_keyboard',
	// 	gradient: GradientColours.SKY,
	// },
	// {
	// 	name: 'Play Piano',
	// 	icon: { family: 'materialcommunity', name: 'piano' },
	// 	emoji: 'musical_keyboard',
	// 	gradient: GradientColours.GREEN,
	// },
	// {
	// 	name: 'Play Piano',
	// 	icon: { family: 'materialcommunity', name: 'piano' },
	// 	emoji: 'musical_keyboard',
	// 	gradient: GradientColours.LIME,
	// },
];

type HabitType = 'check' | 'count' | 'timer';
type TimeType = 's' | 'm' | 'h';

interface HabitProps {
	name: string;
	icon: Partial<IconProps>;
	gradient: GradientType;
	progress: number;
	progressTotal: number;
	type: HabitType;
	timeType?: TimeType;
}

const HabitMaxInterpolation = Dimensions.get('window').width - 100;

const Habit = ({ name, icon, gradient, progress, progressTotal, type, timeType }: HabitProps) => {
	const { colors } = useTheme();
	const [count, setCount] = useState(progress);
	const [animatedCount, setAnimatedCount] = useState(progress);
	const [complete, setComplete] = useState(false);
	const [showCounter, setShowCounter] = useState(progress > 0 ? true : false);

	const progressAnimation = useRef(new Animated.Value(0)).current;
	const panRef = useRef<PanGestureHandler>(null);
	let interpolatedSize = progressAnimation.interpolate({
		inputRange: [0, progressTotal],
		outputRange: [1, 18],
	});

	const [stopPoint, setStopPoint] = useState(progress + 0.5);
	const [timerStart, setTimerStart] = useState(false);
	let interval: NodeJS.Timeout;

	useEffect(() => {
		animateProgress();
		if (timerStart && type == 'timer') {
			interval = setInterval(() => {
				setCount(count + 1);
			}, 200);
		}
		return () => {
			clearInterval(interval);
		};
	}, [count, timerStart]);

	const animateProgress = () => {
		Animated.timing(progressAnimation, {
			toValue: count,
			duration: 500,
			useNativeDriver: true,
			easing: Easing.out(Easing.quad),
		}).start();
		checkComplete();
	};

	const checkComplete = () => {
		if (count >= progressTotal) {
			setComplete(true);
			setTimerStart(false);
		} else {
			setComplete(false);
		}
	};

	const handlePress = () => {
		if (type == 'count' && !complete) {
			setCount(count + 1);
			impactAsync(ImpactFeedbackStyle.Heavy);
			setShowCounter(true);
		} else if (type == 'timer' && !complete) {
			if (timerStart == false) {
				impactAsync(ImpactFeedbackStyle.Heavy);
				setShowCounter(true);
				setTimerStart(true);
			} else {
				setTimerStart(false);
				setStopPoint(count + 0.5);
				setAnimatedCount(count);
			}
		} else {
			toggleComplete();
		}
	};

	const toggleComplete = () => {
		if (!complete) {
			impactAsync(ImpactFeedbackStyle.Heavy);
		}
		setCount(complete ? 0 : progressTotal);
		setAnimatedCount(complete ? 0 : progressTotal);
		setStopPoint(complete ? 0.5 : stopPoint);
		setComplete(!complete);
		setShowCounter(false);
		setTimerStart(false);
	};

	const dimensions = 35;

	const renderRightActions = (progress: Animated.AnimatedInterpolation) => {
		const trans = progress.interpolate({
			inputRange: [0, 1],
			outputRange: [192, 0],
			extrapolate: 'clamp',
		});
		return (
			<Animated.View
				style={{
					flexDirection: 'row',
					transform: [{ translateX: trans }],
					width: 192,
				}}
			>
				<RectButton style={[styles.rightAction]}>
					<Text style={styles.actionText}>"Test</Text>
				</RectButton>
			</Animated.View>
		);
	};

	const handleGesture = (event: PanGestureHandlerGestureEvent) => {
		if (event.nativeEvent.velocityX > 1000) {
			impactAsync(ImpactFeedbackStyle.Heavy);
			setComplete(true);
			setCount(progressTotal);
		} else {
			if (showCounter == false) {
				setShowCounter(true);
			}

			if (timerStart) {
				return;
			}

			console.log('Anim: :' + animatedCount);
			console.log('Count: ' + count);

			const interpolateX =
				animatedCount +
				(event.nativeEvent.translationX / HabitMaxInterpolation) * progressTotal;

			// @ts-ignore
			let value = Math.min(Math.max(interpolateX, 0), progressTotal);
			progressAnimation.setValue(value);

			if (value >= stopPoint && !complete && stopPoint == progressTotal - 0.5) {
				impactAsync(ImpactFeedbackStyle.Heavy);
				setComplete(true);
				setCount(progressTotal);
				setTimerStart(false);
				return;
			}
			if (complete && value < stopPoint && stopPoint == 0.5) {
				setComplete(false);
				setCount(progressTotal - 1);
				return;
			}

			if (type == 'count') {
				if (value < stopPoint - 1) {
					setCount(count - 1);
					setStopPoint(stopPoint - 1);
				}
				if (value > stopPoint && stopPoint < progressTotal) {
					setCount(count + 1);
					setStopPoint(stopPoint + 1);
					impactAsync(ImpactFeedbackStyle.Medium);
				}
				return;
			}

			if (type == 'timer') {
				// console.log(count);
				if (value < stopPoint - 1) {
					setCount(count - 1);
					setStopPoint(stopPoint - 1);
				}
				if (value > stopPoint && stopPoint < progressTotal) {
					setCount(count + 1);
					setStopPoint(stopPoint + 1);
					impactAsync(ImpactFeedbackStyle.Light);
				}
				return;
			}
		}
	};

	const handleGestureEnd = (event: PanGestureHandlerGestureEvent) => {
		if (event.nativeEvent.state == 5) {
			animateProgress();
			setAnimatedCount(count);
		} else if (event.nativeEvent.state == 2 && type !== 'check') {
			// console.log(count);
			// console.log(animatedCount);
		}
	};

	return (
		<Swipeable renderRightActions={renderRightActions} waitFor={panRef}>
			<PanGestureHandler
				ref={panRef}
				activeOffsetX={[-1000, 20]}
				failOffsetX={[0, 1000]}
				minDeltaX={0}
				onGestureEvent={handleGesture}
				onHandlerStateChange={handleGestureEnd}
			>
				<Animated.View
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
					<TouchableWithoutFeedback
						onPress={() => console.log('Press')}
						style={{
							flex: 1,
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
									margin: 15,
								}}
							>
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
									}}
								>
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
							<TextTicker
								style={{
									fontFamily: 'Montserrat_600SemiBold',
									fontSize: 18,
									color: colors.text,
								}}
								scroll={false}
								animationType='bounce'
								duration={3000}
								bounceDelay={1500}
								marqueeDelay={1000}
								bouncePadding={{ left: 0, right: 0 }}
							>
								{name}
							</TextTicker>
						</View>
					</TouchableWithoutFeedback>

					<TouchableOpacity onPress={handlePress} style={{ padding: 26 }}>
						{complete ? (
							<Entypo name='check' size={20} color={colors.text} />
						) : showCounter ? (
							<Text
								style={{ fontFamily: 'Montserrat_600SemiBold', color: colors.text }}
							>
								{type == 'count'
									? `${count}/${progressTotal}`
									: `${count}/${progressTotal}s`}
							</Text>
						) : type == 'timer' ? (
							<Icon
								family='antdesign'
								name='clockcircle'
								size={12}
								colour={colors.text}
							/>
						) : (
							<FontAwesome name='circle-o' size={14} color={colors.text} />
						)}
					</TouchableOpacity>
				</Animated.View>
			</PanGestureHandler>
		</Swipeable>
	);
};

const styles = StyleSheet.create({
	leftAction: {
		flex: 1,
		backgroundColor: '#497AFC',
		justifyContent: 'center',
	},
	actionText: {
		color: 'white',
		fontSize: 16,
		backgroundColor: 'transparent',
		padding: 10,
	},
	rightAction: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
	},
});

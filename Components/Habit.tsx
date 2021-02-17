import { useTheme } from '@react-navigation/native';
import {
	impactAsync,
	ImpactFeedbackStyle,
	notificationAsync,
	NotificationFeedbackType,
	selectionAsync,
} from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { getRandomBytes } from 'expo-random';
import React, { useEffect, useRef, useState } from 'react';
import {
	View,
	Text,
	Animated,
	Dimensions,
	Easing,
	TouchableOpacity,
	TouchableWithoutFeedback,
	StyleSheet,
} from 'react-native';
import {
	PanGestureHandler,
	RectButton,
	PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import TextTicker from 'react-native-text-ticker';
import { GradientColours, GradientType } from '../Styles/Colours';
import Icon, { IconProps } from './Icon';

export const HabitMap: HabitProps[] = [
	{
		id: getRandomBytes(8).join(''),
		name: 'Read',
		icon: { family: 'feather', name: 'book' },
		gradient: GradientColours.PURPLE,
		progress: 1,
		progressTotal: 1,
		type: 'check',
	},
	{
		id: getRandomBytes(8).join(''),
		name: 'Read',
		icon: { family: 'feather', name: 'book' },
		gradient: GradientColours.RED,
		progress: 1,
		progressTotal: 1,
		type: 'check',
	},
	{
		id: getRandomBytes(8).join(''),
		name: 'Read',
		icon: { family: 'feather', name: 'book' },
		gradient: GradientColours.PEACH,
		progress: 1,
		progressTotal: 1,
		type: 'check',
	},
	{
		id: getRandomBytes(8).join(''),
		name: 'Read',
		icon: { family: 'feather', name: 'book' },
		gradient: GradientColours.TANGERINE,
		progress: 1,
		progressTotal: 1,
		type: 'check',
	},
	{
		id: getRandomBytes(8).join(''),
		name: 'Read',
		icon: { family: 'feather', name: 'book' },
		gradient: GradientColours.ORANGE,
		progress: 1,
		progressTotal: 1,
		type: 'check',
	},
	{
		id: getRandomBytes(8).join(''),
		name: 'Read',
		icon: { family: 'feather', name: 'book' },
		gradient: GradientColours.PINK,
		progress: 1,
		progressTotal: 1,
		type: 'check',
	},
];

type HabitType = 'check' | 'count' | 'timer';

export interface HabitProps {
	id: string;
	name: string;
	icon: Partial<IconProps>;
	gradient: GradientType;
	progress: number;
	progressTotal: number;
	type: HabitType;
}

const getTimeOffset = (seconds: number): number => {
	if (seconds >= 3600) return 1800;
	else if (seconds >= 60) return 30;
	else return 0.5;
};

const getTimeString = (seconds: number): string => {
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = seconds % 60;

	const hString = h > 0 ? `${h}h` : '';
	const mString = m > 0 ? `${m}m` : '';
	const sString = s > 0 || (s == 0 && m == 0 && h == 0) ? `${s}s` : '';

	return hString + mString + sString;
};

const HabitMaxInterpolation = Dimensions.get('window').width - 120;

export const Habit = ({ name, icon, gradient, progress, progressTotal, type }: HabitProps) => {
	const { colors } = useTheme();
	const [count, setCount] = useState(progress);
	const [animatedCount, setAnimatedCount] = useState(progress);
	const [complete, setComplete] = useState(progress == progressTotal ? true : false);
	const [showCounter, setShowCounter] = useState(progress > 0 ? true : false);
	const [timerActive, setTimerActive] = useState(false);

	const progressAnimation = useRef(new Animated.Value(0)).current;
	const panRef = useRef<PanGestureHandler>(null);
	let interpolatedSize = progressAnimation.interpolate({
		inputRange: [0, progressTotal],
		outputRange: [1, 18],
	});

	const progressOffset = type == 'timer' ? getTimeOffset(progressTotal) : 0.5;
	const progressInterval = progressOffset * 2;
	let interval: NodeJS.Timeout;

	useEffect(() => {
		checkComplete();
		animateProgress();
		incrementTimer();
		return () => {
			clearInterval(interval);
		};
	}, [count, timerActive]);

	const animateProgress = () => {
		Animated.timing(progressAnimation, {
			toValue: count,
			duration: 500,
			useNativeDriver: true,
			easing: Easing.out(Easing.quad),
		}).start();
	};

	const incrementTimer = () => {
		if (timerActive && type == 'timer') {
			interval = setInterval(() => {
				setCount(count + 1);
			}, 1000);
		}
	};

	const checkComplete = () => {
		if (count >= progressTotal) {
			setComplete(true);
			setShowCounter(false);
			setTimerActive(false);
		}
	};

	const addProgress = () => {
		setShowCounter(true);
		setCount(count + 1);
		setAnimatedCount(count + 1);
		hapticFeedback(count + 1);
	};

	const hapticFeedback = (count: number) => {
		if (count == progressTotal) {
			notificationAsync(NotificationFeedbackType.Success);
		} else if (type !== 'timer') {
			impactAsync(ImpactFeedbackStyle.Medium);
		}
	};

	const toggleTimer = () => {
		setShowCounter(true);
		setTimerActive(!timerActive);
		impactAsync(ImpactFeedbackStyle.Medium);
	};

	const resetHabit = () => {
		setCount(0);
		setAnimatedCount(0);
		setComplete(false);
		setTimerActive(false);
		setShowCounter(false);
	};

	const handleComplete = () => {
		setComplete(true);
		setCount(progressTotal);
	};

	const handlePress = () => {
		if (!complete) {
			if (type == 'timer') {
				toggleTimer();
			} else {
				addProgress();
			}
		} else {
			resetHabit();
		}
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
				}}>
				<RectButton style={[styles.rightAction]}>
					<Text style={styles.actionText}>"Test</Text>
				</RectButton>
			</Animated.View>
		);
	};

	const handleGesture = (event: PanGestureHandlerGestureEvent) => {
		if (event.nativeEvent.velocityX > 1000) {
			handleComplete();
			return;
		}
		if (timerActive) {
			setTimerActive(false);
		}

		const interpolateX = event.nativeEvent.translationX / HabitMaxInterpolation;
		const scaledX = interpolateX * progressTotal;
		const progress = animatedCount + scaledX;
		const progressNormalised = Math.min(Math.max(progress, 0), progressTotal);
		progressAnimation.setValue(progressNormalised);

		if (!complete && progressNormalised >= progressTotal - progressOffset) {
			handleComplete();
			return;
		} else if (complete && progressNormalised <= progressTotal - progressOffset) {
			setComplete(false);
			return;
		}

		if (progressNormalised <= 0) {
			setCount(0);
		}

		if (progressNormalised >= count + progressOffset) {
			setCount(count + progressInterval);
			impactAsync(ImpactFeedbackStyle.Medium);
		} else if (progressNormalised <= count - progressOffset) {
			setCount(count - progressInterval);
		}
	};

	const handleGestureEnd = (event: PanGestureHandlerGestureEvent) => {
		if (event.nativeEvent.state == 5) {
			animateProgress();
			setAnimatedCount(count);
			if (complete == true) {
				notificationAsync(NotificationFeedbackType.Success);
			}
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
				onHandlerStateChange={handleGestureEnd}>
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
					}}>
					<TouchableWithoutFeedback
						onPress={() => console.log('Press')}
						style={{
							flex: 1,
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
									margin: 15,
								}}>
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
										locations={[0.3, 1]}
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
									scroll={false}
									animationType='bounce'
									duration={3000}
									bounceDelay={1500}
									marqueeDelay={1000}
									bouncePadding={{ left: 0, right: 0 }}>
									{name}
								</TextTicker>
							</View>
						</View>
					</TouchableWithoutFeedback>

					<TouchableOpacity onPress={handlePress} style={{ padding: 26 }}>
						{complete ? (
							<Icon family='entypo' name='check' size={18} colour={colors.text} />
						) : showCounter ? (
							<Text
								style={{
									fontFamily: 'Montserrat_600SemiBold',
									color: colors.text,
								}}>
								{type == 'count'
									? `${count}/${progressTotal}`
									: getTimeString(count)}
							</Text>
						) : type == 'timer' ? (
							<Icon
								family='fontawesome'
								name='clock-o'
								size={12}
								colour={colors.text}
							/>
						) : type == 'count' ? (
							<Icon
								family='fontawesome'
								name='dot-circle-o'
								size={12}
								colour={colors.text}
							/>
						) : (
							<Icon
								family='fontawesome'
								name='circle-o'
								size={12}
								colour={colors.text}
							/>
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

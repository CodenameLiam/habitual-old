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
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
	View,
	Text,
	Animated,
	Dimensions,
	Easing,
	TouchableOpacity,
	TouchableWithoutFeedback,
	StyleSheet,
	Alert,
} from 'react-native';
import {
	PanGestureHandler,
	RectButton,
	PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import TextTicker from 'react-native-text-ticker';
import { AppContext } from '../Context/AppContext';
import { GradientContext } from '../Context/GradientContext';
import { TimerContext } from '../Context/TimerContext';
import { AppNavProps, RootNavProps } from '../Navigation/AppNavigation';
import { IHabitDate, mergeDates, useHabits } from '../Storage/HabitController';
import { GradientColours, GradientType, GradientShape } from '../Styles/Colours';
import Icon, { IconProps } from './Icon';
import { ScheduleType } from './Scheduler';

export type HabitType = 'check' | 'count' | 'timer';

export interface HabitProps {
	navigation: AppNavProps;
	id: string;
	name: string;
	icon: Partial<IconProps>;
	gradient: GradientType;
	progress: number;
	progressTotal: number;
	type: HabitType;
	schedule: ScheduleType;
	date: string;
	dates: IHabitDate;
	timerActive?: boolean;
}

const getTimeOffset = (seconds: number): number => {
	if (seconds >= 3600) return 1800;
	else if (seconds >= 60) return 30;
	else return 0.5;
};

export const getTimeString = (seconds: number): string => {
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = seconds % 60;

	const hString = h > 0 ? `${h}h` : '';
	const mString = m > 0 ? `${m}m` : '';
	const sString = s > 0 || (s == 0 && m == 0 && h == 0) ? `${s}s` : '';

	return hString + mString + sString;
};

const CircleDimensions = 35;
const HabitMaxInterpolation = Dimensions.get('screen').width - 120;
const HabitTransformInterpolation = Dimensions.get('screen').width / 20.5;

export const Habit = ({
	navigation,
	id,
	name,
	icon,
	gradient,
	progress,
	progressTotal,
	type,
	schedule,
	date,
	dates,
	timerActive,
}: HabitProps) => {
	const { colors } = useTheme();
	const { updateHabit, deleteHabit } = useContext(AppContext);
	const { activeTimer, setActiveTimer } = useContext(TimerContext);

	const [count, setCount] = useState(progress);
	const [animatedCount, setAnimatedCount] = useState(progress);
	const [complete, setComplete] = useState(progress == progressTotal ? true : false);
	const [showCounter, setShowCounter] = useState(progress > 0 ? true : false);
	const [isTimerActive, setIsTimerActive] = useState(timerActive ?? false);
	const [isDragging, setIsDragging] = useState(false);

	const progressAnimation = useRef(new Animated.Value(progress)).current;
	const panRef = useRef<PanGestureHandler>(null);
	let interpolatedSize = progressAnimation.interpolate({
		inputRange: [0, progressTotal],
		outputRange: [1, HabitTransformInterpolation],
	});

	const progressOffset = type == 'timer' ? getTimeOffset(progressTotal) : 0.5;
	const progressInterval = progressOffset * 2;
	let interval: NodeJS.Timeout;

	const handleEdit = () => {
		impactAsync(ImpactFeedbackStyle.Light);

		navigation.navigate('View', { id: id });
	};

	useEffect(() => {
		isTimerActive && incrementTimer();
		!isDragging && animateProgress();
		!isDragging && runUpdateHabit();
		count >= progressTotal && handleComplete();

		return () => {
			clearInterval(interval);
		};
	}, [count, isTimerActive, isDragging, activeTimer]);

	useEffect(() => {
		if (!activeTimer) clearInterval(interval);
	}, [activeTimer]);

	const runUpdateHabit = () => {
		updateHabit({
			id: id,
			name: name,
			icon: icon,
			gradient: gradient,
			progressTotal: progressTotal,
			type: type,
			schedule: schedule,
			dates: mergeDates(dates, date, count, progressTotal),
		});
	};

	const animateProgress = () => {
		Animated.timing(progressAnimation, {
			toValue: count,
			duration: 500,
			useNativeDriver: true,
			easing: Easing.out(Easing.quad),
		}).start();
	};

	const incrementTimer = () => {
		if (isTimerActive && type == 'timer') {
			interval = setInterval(() => {
				setCount(count + 1);
			}, 1000);
		}
	};

	const addProgress = () => {
		count + 1 !== progressTotal && setShowCounter(true);
		setCount(count + 1);
		setAnimatedCount(count + 1);
		hapticFeedback(count + 1);
	};

	const resetHabit = () => {
		setCount(0);
		setAnimatedCount(0);
		setComplete(false);
		setIsTimerActive(false);
		setShowCounter(false);
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
		setIsTimerActive(!isTimerActive);
		impactAsync(ImpactFeedbackStyle.Medium);
		setActiveTimer(!isTimerActive ? id : undefined);
	};

	const handleComplete = () => {
		setComplete(true);
		setShowCounter(false);
		setIsTimerActive(false);
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

	const confirmDelete = () => {
		deleteHabit(id);
		notificationAsync(NotificationFeedbackType.Success);
	};

	const renderRightActions = (progress: Animated.AnimatedInterpolation) => {
		const trans = progress.interpolate({
			inputRange: [0, 1],
			outputRange: [192, 0],
			extrapolate: 'clamp',
		});

		const handleDelete = () => {
			Alert.alert(
				'Delete',
				'Are you sure you want to delete this habit?',
				[
					{
						text: 'Cancel',
						style: 'cancel',
					},
					{ text: 'Yes', onPress: confirmDelete },
				],
				{ cancelable: false }
			);
		};
		return (
			<Animated.View
				style={{
					flexDirection: 'row',
					transform: [{ translateX: trans }],
					width: 160,
				}}>
				<TouchableOpacity
					onPress={handleEdit}
					style={[styles.rightAction, { backgroundColor: colors.card }]}>
					<Icon family='feather' name='edit' size={30} colour={colors.text} />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={handleDelete}
					style={[styles.rightAction, { backgroundColor: colors.card }]}>
					<Icon family='feather' name='trash-2' size={30} colour={colors.text} />
				</TouchableOpacity>
			</Animated.View>
		);
	};

	const handleGesture = (event: PanGestureHandlerGestureEvent) => {
		if (event.nativeEvent.velocityX > 1000) {
			setCount(progressTotal);
			handleComplete();
			return;
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
			setShowCounter(true);
			return;
		}

		if (progressNormalised <= 0) {
			setCount(0);
			return;
		}

		if (progressNormalised >= count + progressOffset) {
			setCount(count + progressInterval);
			impactAsync(ImpactFeedbackStyle.Medium);
		} else if (progressNormalised <= count - progressOffset) {
			setCount(count - progressInterval);
		}

		if (count > 0) {
			setShowCounter(true);
		}

		if (isTimerActive) {
			setIsTimerActive(false);
		}
	};

	const handleGestureEnd = (event: PanGestureHandlerGestureEvent) => {
		if (event.nativeEvent.state == 5) {
			setIsDragging(false);
			animateProgress();
			setAnimatedCount(count);
			if (complete == true) {
				notificationAsync(NotificationFeedbackType.Success);
			}
			if (count == 0) {
				setShowCounter(false);
			}
		} else if (event.nativeEvent.state == 2) {
			setIsDragging(true);
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
				// enabled={!complete}
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
					}}>
					<TouchableWithoutFeedback
						onPress={handleEdit}
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
									height: CircleDimensions,
									width: CircleDimensions,
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
										backgroundColor: GradientColours[gradient].solid,
										height: 35,
										width: 35,
										transform: [{ scale: interpolatedSize }],
										overflow: 'hidden',
										borderRadius: 700,
									}}>
									<LinearGradient
										colors={[
											GradientColours[gradient].start,
											GradientColours[gradient].end,
										]}
										locations={[0.3, 1]}
										style={{
											flex: 1,
										}}
										start={{ x: 0, y: 0.5 }}
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
								family='antdesign'
								name='clockcircle'
								size={10}
								colour={colors.text}
							/>
						) : type == 'count' ? (
							<Icon
								family='fontawesome'
								name='circle-o'
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
		margin: 5,
		borderRadius: 10,
	},
});

import { useFocusEffect, useTheme } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	Dimensions,
	StyleSheet,
	TouchableOpacity,
	Keyboard,
	EmitterSubscription,
	InteractionManager,
} from 'react-native';
import { TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { ColourPicker, randomGradient } from '../Components/ColourPicker';
import Icon, { IconProps } from '../Components/Icon';
import { GradientContext } from '../Context/GradientContext';
import { AppNavProps, AppStackParamList } from '../Navigation/AppNavigation';
import { GradientColours, GreyColours } from '../Styles/Colours';
import BottomSheet from 'reanimated-bottom-sheet';
import { ColourButtonGroup } from '../Components/ColourButtonGroup';
import {
	DEFAULT_SCHEDULE,
	EVERYDAY_SCHEDULE,
	Scheduler,
	ScheduleType,
	WEEKDAY_SCHEDULE,
	WEEKEND_SCHEDULE,
} from '../Components/Scheduler';
import { IHabit, useHabits } from '../Storage/HabitController';
import { Habit, HabitProps, HabitType } from '../Components/Habit';
import { getRandomBytes } from 'expo-random';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Card } from '../Components/Card';
import { TimePicker } from '../Components/TimePicker';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast, { BaseToastProps, ToastProps } from 'react-native-toast-message';
import { AppContext } from '../Context/AppContext';
import {
	impactAsync,
	ImpactFeedbackStyle,
	notificationAsync,
	NotificationFeedbackType,
} from 'expo-haptics';
import { EditNavProps } from '../Screens/EditScreen';

interface EditProps {
	navigation: EditNavProps;
	habit?: IHabit;
	// resetGradient?: boolean;
}

export default function HabitEdtor({ navigation, habit }: EditProps) {
	const { colors } = useTheme();
	const { createHabit } = useContext(AppContext);
	const [localGradient, setLocalGradient] = useState(habit ? habit.gradient : randomGradient());

	useFocusEffect(
		useCallback(() => {
			navigation.setOptions({
				headerBackground: () => (
					<LinearGradient
						colors={[
							GradientColours[localGradient].start,
							GradientColours[localGradient].end,
						]}
						style={globalStyles.gradient}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
					/>
				),
			});
		}, [navigation, localGradient])
	);

	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			setIsReady(true);
		});
	}, []);

	let sheetRef = React.useRef<BottomSheet>(null);
	let timeRef = React.useRef<BottomSheet>(null);
	let shadow = useRef(new Animated.Value<number>(1)).current;

	const [name, setName] = useState(habit ? habit.name : '');
	const [count, setCount] = useState(habit ? habit.progressTotal : 1);
	const [type, setType] = useState<HabitType>(habit ? habit.type : 'count');
	const [icon, setIcon] = useState<Partial<IconProps>>({
		family: habit ? habit.icon.family : 'fontawesome5',
		name: habit ? habit.icon.name : 'icons',
	});

	const [hours, setHours] = useState(habit ? Math.floor(count / 3600) : 0);
	const [minutes, setMinutes] = useState(habit ? Math.floor((count % 3600) / 60) : 1);

	const [schedule, setSchedule] = useState<ScheduleType>(
		habit ? habit.schedule : { ...DEFAULT_SCHEDULE }
	);

	const toastConfig = {
		error: ({ text1, ...rest }: BaseToastProps) => (
			<View
				style={{
					height: 40,
					width: '90%',
					borderRadius: 6,
					backgroundColor: GradientColours.RED.solid,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center',
				}}>
				<Text style={{ color: colors.text, fontFamily: 'Montserrat_600SemiBold' }}>
					{text1}
				</Text>
			</View>
		),
	};

	const scheduleFunctions = [
		() => {
			setSchedule({ ...EVERYDAY_SCHEDULE });
			impactAsync(ImpactFeedbackStyle.Light);
		},
		() => {
			setSchedule({ ...WEEKDAY_SCHEDULE });
			impactAsync(ImpactFeedbackStyle.Light);
		},
		() => {
			setSchedule({ ...WEEKEND_SCHEDULE });
			impactAsync(ImpactFeedbackStyle.Light);
		},
	];

	const openSheet = () => {
		sheetRef.current && sheetRef.current.snapTo(0);
	};

	const closeSheet = () => {
		sheetRef.current && sheetRef.current.snapTo(1);
	};

	const openTime = () => {
		timeRef.current && timeRef.current.snapTo(0);
	};

	const handleSave = async () => {
		if (name === '') {
			Toast.show({
				type: 'error',
				text1: 'Please enter a name for your new habit',
				position: 'bottom',
				bottomOffset: 150,
			});
			notificationAsync(NotificationFeedbackType.Error);
		} else if (Object.values(schedule).every((value) => value === false)) {
			Toast.show({
				type: 'error',
				text1: 'Please schedule your habit for at least one day',
				position: 'bottom',
				bottomOffset: 150,
			});
			notificationAsync(NotificationFeedbackType.Error);
		} else if (count === 0) {
			Toast.show({
				type: 'error',
				text1: 'Please assign time to your habit',
				position: 'bottom',
				bottomOffset: 150,
			});
			notificationAsync(NotificationFeedbackType.Error);
		} else {
			const newHabit: IHabit = {
				id: habit ? habit.id : getRandomBytes(8).join(''),
				name: name,
				icon: icon,
				gradient: localGradient,
				progressTotal: count,
				type: type,
				schedule: schedule,
				dates: habit ? habit.dates : {},
			};
			notificationAsync(NotificationFeedbackType.Success);
			createHabit(newHabit);
			navigation.goBack();
			// resetGradient === true && setTimeout(() => setGradient(randomGradient), 100);
		}
	};

	const handleCountType = (text: string) => {
		setCount(Number(text));
	};

	const handleTimeType = (values: { hours: number; minutes: number }) => {
		const { hours, minutes } = values;
		setHours(hours);
		setMinutes(minutes);
		setCount(hours * 3600 + minutes * 60);
	};

	const handleCountChange = () => {
		setCount(1);
		setType('count');
		setHours(0);
		setMinutes(1);
	};

	const handleTimeChange = () => {
		setCount(60);
		setType('timer');
	};

	const keyboardDidHideListener = useRef<EmitterSubscription>();
	const onKeyboardHide = () => {
		count === 0 && setCount(1);
	};

	useEffect(() => {
		keyboardDidHideListener.current = Keyboard.addListener('keyboardDidHide', onKeyboardHide);
		return () => {
			keyboardDidHideListener.current!.remove();
		};
	}, [count]);

	const getFormattedTimeCount = () => {
		const h = Math.floor(count / 3600);
		const m = Math.floor((count % 3600) / 60);

		const hString = h > 0 ? `${h} hr ` : '';
		const mString = m > 0 || (m == 0 && h == 0) ? `${m} m ` : '';

		return hString + mString;
	};

	return (
		<React.Fragment>
			<KeyboardAwareScrollView
				contentContainerStyle={{ flex: 1 }}
				scrollEnabled={false}
				extraScrollHeight={60}>
				<ShadowModal shadow={shadow} />

				<View style={{ display: 'flex', flexDirection: 'row' }}>
					<TouchableOpacity onPress={openSheet}>
						<Card>
							<Icon
								family={icon.family}
								name={icon.name}
								size={28}
								colour={GreyColours.GREY2}
							/>
						</Card>
					</TouchableOpacity>
					<Card style={{ marginLeft: 0, flex: 1 }}>
						<TextInput
							placeholder='Name'
							placeholderTextColor={GreyColours.GREY2}
							returnKeyType='done'
							onChangeText={(name) => setName(name)}
							value={name}
							style={[
								globalStyles.cardText,
								{
									color: GradientColours[localGradient].solid,
									flex: 1,
								},
							]}
						/>
					</Card>
				</View>
				<Card title='Colour'>
					<ColourPicker updateGradient={(gradient) => setLocalGradient(gradient)} />
				</Card>
				<Card title='Schedule'>
					<Scheduler
						schedule={schedule}
						setSchedule={setSchedule}
						gradient={GradientColours[localGradient]}
					/>
					<ColourButtonGroup
						buttons={['Everyday', 'Weekdays', 'Weekend']}
						buttonFunctions={scheduleFunctions}
						colour={GradientColours[localGradient].solid}
					/>
				</Card>
				<View style={{ display: 'flex', flexDirection: 'row' }}>
					<Card title='Type' style={{ marginRight: 0 }}>
						<View style={{ display: 'flex', flexDirection: 'row' }}>
							<TouchableOpacity
								onPress={handleCountChange}
								style={[
									globalStyles.type,
									{
										backgroundColor:
											type === 'count'
												? GradientColours[localGradient].solid + 50
												: GreyColours.GREY2 + 50,
										marginRight: 10,
									},
								]}>
								<Icon
									family='fontawesome'
									name='plus'
									size={24}
									colour={
										type === 'count'
											? GradientColours[localGradient].solid
											: GreyColours.GREY2
									}
									style={{ zIndex: 1 }}
								/>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={handleTimeChange}
								style={[
									globalStyles.type,
									{
										backgroundColor:
											type === 'timer'
												? GradientColours[localGradient].solid + 50
												: GreyColours.GREY2 + 50,
									},
								]}>
								<Icon
									family='antdesign'
									name='clockcircle'
									size={24}
									colour={
										type === 'timer'
											? GradientColours[localGradient].solid
											: GreyColours.GREY2
									}
									style={{ zIndex: 1 }}
								/>
							</TouchableOpacity>
						</View>
					</Card>
					<Card title='Value' style={{ flex: 1 }}>
						{type === 'count' ? (
							<View
								style={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'space-between',
								}}>
								<TextInput
									returnKeyType='done'
									onChangeText={handleCountType}
									value={count > 0 ? count.toString() : ''}
									keyboardType='number-pad'
									style={[
										{
											color: GradientColours[localGradient].solid,
											flex: 1,
											backgroundColor: colors.background,
											borderRadius: 5,
											textAlign: 'center',
											fontFamily: 'Montserrat_800ExtraBold',
											fontSize: 20,
										},
									]}
								/>
								<TouchableOpacity
									onPress={() => count > 1 && setCount(count - 1)}
									style={[
										globalStyles.count,
										{
											marginLeft: 10,
											marginRight: 10,
											backgroundColor:
												Number(count) > 1
													? GradientColours[localGradient].solid + 50
													: GreyColours.GREY2 + 50,
										},
									]}>
									<Icon
										family='fontawesome'
										name='minus'
										size={24}
										colour={
											Number(count) > 1
												? GradientColours[localGradient].solid
												: GreyColours.GREY2
										}
									/>
								</TouchableOpacity>

								<TouchableOpacity
									onPress={() => setCount(count + 1)}
									style={[
										globalStyles.count,
										{
											backgroundColor:
												GradientColours[localGradient].solid + 50,
										},
									]}>
									<Icon
										family='fontawesome'
										name='plus'
										size={24}
										colour={GradientColours[localGradient].solid}
									/>
								</TouchableOpacity>
							</View>
						) : (
							<TouchableOpacity
								onPress={openTime}
								style={{
									flex: 1,
									backgroundColor: colors.background,
									borderRadius: 5,
									display: 'flex',
									justifyContent: 'center',
								}}>
								<Text
									style={{
										color: GradientColours[localGradient].solid,
										textAlign: 'center',
										fontFamily: 'Montserrat_800ExtraBold',
										fontSize: 20,
									}}>
									{getFormattedTimeCount()}
								</Text>
							</TouchableOpacity>
						)}
					</Card>
				</View>

				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
						margin: 10,
					}}>
					<TouchableOpacity
						onPress={handleSave}
						style={{
							height: 60,
							borderRadius: 100,
							overflow: 'hidden',
							justifyContent: 'center',
							alignItems: 'center',
							width: '100%',
							margin: 10,
						}}>
						<LinearGradient
							colors={[
								GradientColours[localGradient].start,
								GradientColours[localGradient].end,
							]}
							style={globalStyles.gradient}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
						/>
						<Text
							style={{
								fontFamily: 'Montserrat_600SemiBold',
								fontSize: 20,
								color: colors.text,
							}}>
							Save
						</Text>
					</TouchableOpacity>
				</View>

				{isReady && (
					<React.Fragment>
						<BottomSheet
							ref={sheetRef}
							snapPoints={['100%', 0]}
							initialSnap={1}
							renderContent={() => (
								<IconModal setIcon={setIcon} closeSheet={closeSheet} />
							)}
							renderHeader={() => <HeaderModal sheetRef={sheetRef} height={240} />}
							callbackNode={shadow}
						/>
						<BottomSheet
							ref={timeRef}
							snapPoints={['100%', 0]}
							initialSnap={1}
							renderContent={() => (
								<TimeModal
									minutes={minutes}
									hours={hours}
									handleTimeType={handleTimeType}
								/>
							)}
							renderHeader={() => <HeaderModal sheetRef={timeRef} height={550} />}
							callbackNode={shadow}
						/>
					</React.Fragment>
				)}
			</KeyboardAwareScrollView>
			<Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
		</React.Fragment>
	);
}

interface ShadowModalProps {
	shadow: Animated.Value<number>;
}

const ShadowModal = ({ shadow }: ShadowModalProps) => {
	const animatedShadowOpacity = Animated.interpolate(shadow, {
		inputRange: [0, 1],
		outputRange: [0.5, 0],
	});

	return (
		<Animated.View
			pointerEvents='none'
			style={[
				modalStyles.shadowContainer,
				{
					opacity: animatedShadowOpacity,
				},
			]}
		/>
	);
};

interface TimeModalProps {
	minutes: number;
	hours: number;
	handleTimeType: (values: { hours: number; minutes: number }) => void;
}

const TimeModal = ({ minutes, hours, handleTimeType }: TimeModalProps) => {
	const { colors } = useTheme();

	return (
		<View
			style={{
				backgroundColor: colors.card,
				padding: 16,
				height: '100%',
			}}>
			<TimePicker
				value={{ hours, minutes }}
				hoursUnit='hr'
				minutesUnit='m'
				onChange={handleTimeType}
			/>
		</View>
	);
};

interface HeaderModalProps {
	sheetRef: React.RefObject<BottomSheet>;
}

interface IconGroup {
	label: string;
	icons: Partial<IconProps>[];
}

const IconOptions: IconGroup[] = [
	{
		label: 'IDK',
		icons: [
			{ family: 'feather', name: 'book' },
			{ family: 'feather', name: 'award' },
			{ family: 'feather', name: 'book-open' },
			{ family: 'feather', name: 'bookmark' },
			{ family: 'feather', name: 'briefcase' },
			{ family: 'feather', name: 'camera' },
			{ family: 'feather', name: 'compass' },
			{ family: 'feather', name: 'film' },
			{ family: 'feather', name: 'gift' },
			{ family: 'feather', name: 'headphones' },
			{ family: 'feather', name: 'heart' },
			{ family: 'feather', name: 'moon' },
			{ family: 'feather', name: 'sun' },
			{ family: 'feather', name: 'monitor' },
			{ family: 'feather', name: 'music' },
			{ family: 'feather', name: 'pen-tool' },
			{ family: 'feather', name: 'smile' },
			{ family: 'feather', name: 'tablet' },
			{ family: 'feather', name: 'database' },
			{ family: 'feather', name: 'server' },
			{ family: 'feather', name: 'star' },
			{ family: 'feather', name: 'thumbs-up' },
			{ family: 'feather', name: 'phone' },
			{ family: 'feather', name: 'tool' },
			{ family: 'feather', name: 'tv' },
			{ family: 'feather', name: 'twitch' },
			{ family: 'feather', name: 'twitter' },
			{ family: 'feather', name: 'instagram' },
			{ family: 'feather', name: 'facebook' },
			{ family: 'feather', name: 'linkedin' },
			{ family: 'feather', name: 'youtube' },
			{ family: 'feather', name: 'video' },
			{ family: 'materialcommunity', name: 'baguette' },
			{ family: 'materialcommunity', name: 'baseball' },
			{ family: 'materialcommunity', name: 'baseball-bat' },
			{ family: 'materialcommunity', name: 'basketball' },
			{ family: 'materialcommunity', name: 'basketball-hoop' },
			{ family: 'materialcommunity', name: 'bed' },
			{ family: 'materialcommunity', name: 'beer' },
			{ family: 'materialcommunity', name: 'bike' },
			{ family: 'materialcommunity', name: 'billiards' },
			{ family: 'materialcommunity', name: 'bowling' },
			{ family: 'materialcommunity', name: 'brain' },
			{ family: 'materialcommunity', name: 'calculator' },
			{ family: 'materialcommunity', name: 'calendar' },
			{ family: 'materialcommunity', name: 'calendar-check' },
			{ family: 'materialcommunity', name: 'calendar-heart' },
			{ family: 'materialcommunity', name: 'camera' },
			{ family: 'materialcommunity', name: 'car-sports' },
			{ family: 'materialcommunity', name: 'cart' },
			{ family: 'materialcommunity', name: 'cards' },
			{ family: 'materialcommunity', name: 'cards-club' },
			{ family: 'materialcommunity', name: 'cards-didmond' },
			{ family: 'materialcommunity', name: 'cards-heart' },
			{ family: 'materialcommunity', name: 'cards-spade' },
			{ family: 'materialcommunity', name: 'charity' },
			{ family: 'materialcommunity', name: 'chart-areaspline-variant' },
			{ family: 'materialcommunity', name: 'chart-bar' },
			{ family: 'materialcommunity', name: 'chart-pie' },
			{ family: 'materialcommunity', name: 'chef-hat' },
			{ family: 'materialcommunity', name: 'cupcake' },

			// { family: 'materialcommunity', name: 'emoticon-' },
			// { family: 'materialcommunity', name: 'emoticon-' },
			// { family: 'materialcommunity', name: 'emoticon-' },
			// { family: 'materialcommunity', name: 'emoticon-' },
			// { family: 'materialcommunity', name: 'emoticon-' },
			// { family: 'materialcommunity', name: 'emoticon-' },
			// { family: 'materialcommunity', name: 'emoticon-' },
		],
	},
	{
		label: 'Instruments',
		icons: [
			{ family: 'materialcommunity', name: 'saxophone' },
			{ family: 'fontawesome5', name: 'guitar' },
			{ family: 'fontawesome5', name: 'drum' },
			{ family: 'materialcommunity', name: 'piano' },
			{ family: 'materialcommunity', name: 'violin' },
			{ family: 'materialcommunity', name: 'trumpet' },
			{ family: 'materialcommunity', name: 'album' },
			{ family: 'materialcommunity', name: 'instrument-triangle' },
		],
	},
	{
		label: 'Emoticons',
		icons: [
			{ family: 'materialcommunity', name: 'emoticon' },
			{ family: 'materialcommunity', name: 'emoticon-angry' },
			{ family: 'materialcommunity', name: 'emoticon-confused' },
			{ family: 'materialcommunity', name: 'emoticon-cool' },
			{ family: 'materialcommunity', name: 'emoticon-cry' },
			{ family: 'materialcommunity', name: 'emoticon-excited' },
			{ family: 'materialcommunity', name: 'emoticon-frown' },
			{ family: 'materialcommunity', name: 'emoticon-happy' },
			{ family: 'materialcommunity', name: 'emoticon-kiss' },
			{ family: 'materialcommunity', name: 'emoticon-lol' },
			{ family: 'materialcommunity', name: 'emoticon-neutral' },
			{ family: 'materialcommunity', name: 'emoticon-sad' },
			{ family: 'materialcommunity', name: 'emoticon-tongue' },
			{ family: 'materialcommunity', name: 'emoticon-wink' },
		],
	},
];

interface IconModalProps {
	setIcon: React.Dispatch<React.SetStateAction<Partial<IconProps>>>;
	closeSheet: () => void;
}

const IconModal = ({ setIcon, closeSheet }: IconModalProps) => {
	const { colors } = useTheme();
	const iconWidth = Dimensions.get('screen').width / 6.6;

	const handlePress = (icon: Partial<IconProps>) => {
		setIcon(icon);
		closeSheet();
	};
	return (
		<ScrollView
			style={{
				backgroundColor: colors.card,
				padding: 16,

				height: '100%',
			}}
			showsVerticalScrollIndicator={false}>
			<View style={{ paddingBottom: 50 }}>
				{IconOptions.map((group, index) => (
					<View key={group.label}>
						<View
							style={{
								flexDirection: 'row',
								marginTop: index == 0 ? 0 : 20,
								marginBottom: 5,
								marginLeft: 10,
							}}>
							<Text
								style={{
									padding: 10,
									backgroundColor: colors.background,
									color: colors.text,
									fontSize: 16,
									fontFamily: 'Montserrat_700Bold',
									borderRadius: 10,
									overflow: 'hidden',
								}}>
								{group.label}
							</Text>
						</View>

						<View
							style={{
								width: '100%',
								display: 'flex',
								flexDirection: 'row',
								flexWrap: 'wrap',
							}}>
							{group.icons.map((icon, index) => (
								<TouchableOpacity
									key={index + icon.name}
									onPress={() => handlePress(icon)}
									style={{
										padding: 10,
										width: iconWidth,
										display: 'flex',
										alignItems: 'center',
									}}>
									<Icon
										family={icon.family}
										name={icon.name}
										colour={colors.text}
										size={30}
									/>
								</TouchableOpacity>
							))}
						</View>
					</View>
				))}
			</View>
		</ScrollView>
	);
};

interface HeaderModalProps {
	sheetRef: React.RefObject<BottomSheet>;
	height: number;
}

const HeaderModal = ({ sheetRef, height }: HeaderModalProps) => {
	const { colors } = useTheme();
	const closeSheet = () => {
		sheetRef.current && sheetRef.current.snapTo(1);
	};

	const { header } = modalStyles;
	const headerBackground = { backgroundColor: colors.card };
	const headerStyles = StyleSheet.flatten([header, headerBackground]);

	return (
		<TouchableWithoutFeedback
			style={[modalStyles.headerTouchable, { height: height }]}
			onPress={closeSheet}>
			<View style={headerStyles}>
				<View style={modalStyles.panelHeader}>
					<View style={modalStyles.panelHandle} />
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
};

const modalStyles = StyleSheet.create({
	headerTouchable: {
		display: 'flex',
		justifyContent: 'flex-end',
	},
	header: {
		height: 40,
		shadowColor: '#000000',
		paddingTop: 10,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	panelHeader: {
		alignItems: 'center',
	},
	panelHandle: {
		width: 40,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#00000040',
		marginBottom: 10,
	},
	shadowContainer: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: '#000',
		zIndex: 2,
	},
});

const globalStyles = StyleSheet.create({
	cardText: {
		fontFamily: 'Montserrat_600SemiBold',
		fontSize: 18,
	},
	type: {
		borderRadius: 5,
		overflow: 'hidden',
		height: 45,
		width: 45,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},

	count: {
		height: 45,
		width: 45,
		borderRadius: 5,
		overflow: 'hidden',
		justifyContent: 'center',
		alignItems: 'center',
	},
	gradient: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
	},
});

import { Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { useTheme } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useRef } from 'react';
import { useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	Button,
	Dimensions,
	StyleSheet,
	TouchableOpacity,
	TouchableHighlight,
	ViewComponent,
	ViewStyle,
	Keyboard,
	KeyboardEvent,
	KeyboardAvoidingView,
	InputAccessoryView,
	EmitterSubscription,
	StyleProp,
	TextStyle,
} from 'react-native';
import { TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Animated, { color, Easing, set } from 'react-native-reanimated';
import { ColourPicker, randomGradient } from '../Components/ColourPicker';
import Icon, { IconProps } from '../Components/Icon';
import { GradientContext } from '../Context/GradientContext';
import { AppNavProps } from '../Navigation/AppNavigation';
import { GradientColours, GradientType, GreyColours } from '../Styles/Colours';
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
import { createHabit } from '../Storage/HabitController';
import { HabitProps, HabitType } from '../Components/Habit';
import { getRandomBytes } from 'expo-random';
import SegmentedControl from '@react-native-community/segmented-control';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Card } from '../Components/Card';

interface CreateProps {
	navigation: AppNavProps;
}

export default function CreateScreen({ navigation }: CreateProps) {
	const { gradient, setGradient } = useContext(GradientContext);
	const { colors } = useTheme();

	let sheetRef = React.useRef<BottomSheet>(null);
	let shadow = new Animated.Value(1);

	const [name, setName] = useState('');
	const [count, setCount] = useState(1);
	const [type, setType] = useState<HabitType>('count');
	const [icon, setIcon] = useState<Partial<IconProps>>({ family: 'fontawesome5', name: 'icons' });

	const [schedule, setSchedule] = useState<ScheduleType>({ ...DEFAULT_SCHEDULE });
	const [countWidth, setCountWidth] = useState(40);

	const scheduleFunctions = [
		() => setSchedule({ ...EVERYDAY_SCHEDULE }),
		() => setSchedule({ ...WEEKDAY_SCHEDULE }),
		() => setSchedule({ ...WEEKEND_SCHEDULE }),
	];

	const openSheet = () => {
		sheetRef.current && sheetRef.current.snapTo(0);
	};

	const closeSheet = () => {
		sheetRef.current && sheetRef.current.snapTo(1);
	};

	const handleSave = () => {
		const habit: HabitProps = {
			id: getRandomBytes(8).join(''),
			name: name,
			icon: { family: 'feather', name: 'book' },
			gradient: gradient,
			progress: 0,
			progressTotal: count,
			type: 'count',
		};
		createHabit(habit);
	};

	const handleCountType = (text: string) => {
		setCount(Number(text));
	};

	const handleCountChange = () => {
		setCount(1);
		setType('count');
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

	return (
		<KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }} scrollEnabled={false} extraScrollHeight={60}>
			<ShadowModal shadow={shadow} />
			<View style={{ display: 'flex', flexDirection: 'row' }}>
				<TouchableOpacity onPress={openSheet}>
					<Card>
						<Icon family={icon.family} name={icon.name} size={28} colour={GreyColours.GREY2} />
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
								color: gradient.solid,
								flex: 1,
							},
						]}
					/>
				</Card>
			</View>
			<Card title='Colour'>
				<ColourPicker updateGradient={(gradient) => setGradient(gradient)} />
			</Card>
			<Card title='Schedule'>
				<Scheduler schedule={schedule} setSchedule={setSchedule} gradient={gradient} />
				<ColourButtonGroup
					buttons={['Everyday', 'Weekdays', 'Weekend']}
					buttonFunctions={scheduleFunctions}
					colour={gradient.solid}
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
									backgroundColor: type === 'count' ? gradient.solid + 50 : GreyColours.GREY2 + 50,
									marginRight: 10,
								},
							]}
						>
							<Icon
								family='fontawesome'
								name='plus'
								size={24}
								colour={type === 'count' ? gradient.solid : GreyColours.GREY2}
								style={{ zIndex: 1 }}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={handleTimeChange}
							style={[
								globalStyles.type,
								{
									backgroundColor: type === 'timer' ? gradient.solid + 50 : GreyColours.GREY2 + 50,
								},
							]}
						>
							<Icon
								family='antdesign'
								name='clockcircle'
								size={24}
								colour={type === 'timer' ? gradient.solid : GreyColours.GREY2}
								style={{ zIndex: 1 }}
							/>
						</TouchableOpacity>
					</View>
				</Card>
				<Card title='Value' style={{ flex: 1 }}>
					{type === 'count' ? (
						<View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
							<TextInput
								returnKeyType='done'
								onChangeText={handleCountType}
								value={count > 0 ? count.toString() : ''}
								keyboardType='number-pad'
								style={[
									{
										color: gradient.solid,
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
											Number(count) > 1 ? gradient.solid + 50 : GreyColours.GREY2 + 50,
									},
								]}
							>
								<Icon
									family='fontawesome'
									name='minus'
									size={24}
									colour={Number(count) > 1 ? gradient.solid : GreyColours.GREY2}
								/>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => setCount(count + 1)}
								style={[
									globalStyles.count,
									{
										backgroundColor: gradient.solid + 50,
									},
								]}
							>
								<Icon family='fontawesome' name='plus' size={24} colour={gradient.solid} />
							</TouchableOpacity>
						</View>
					) : (
						<Text>Clock</Text>
					)}
					{/* {type === 'count' &&
					<View style={{ display: 'flex', flexDirection: 'row' }}>
							<View
								style={{
									flex: 1,
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'space-between',
								}}
								onLayout={(event) => {
									let { width } = event.nativeEvent.layout;
									setCountWidth(width / 3 - 5);
								}}
							>
								<View
									style={{
										height: countWidth,
										width: countWidth,
										borderRadius: 5,
										backgroundColor: colors.background,
										display: 'flex',
										justifyContent: 'center',
									}}
								>
									<TextInput
										style={{
											fontFamily: 'Montserrat_800ExtraBold',
											fontSize: 20,
											color: colors.text,
											textAlign: 'center',
										}}
									>
										{count}
									</TextInput>
								</View>
					</View>  */}
				</Card>
			</View>

			<BottomSheet
				ref={sheetRef}
				snapPoints={['100%', 0]}
				initialSnap={1}
				renderContent={() => <IconModal setIcon={setIcon} closeSheet={closeSheet} />}
				renderHeader={() => <HeaderModal sheetRef={sheetRef} />}
				callbackNode={shadow}
			/>
		</KeyboardAwareScrollView>
	);

	return (
		<React.Fragment>
			<KeyboardAvoidingView></KeyboardAvoidingView>
			<ScrollView style={{ flex: 1 }} scrollEnabled={true}>
				<View style={{ flex: 1, padding: 10 }}>
					{/* <View style={keyboardOffset > 0 ? offsetStyle : normalStyle}>
						<Text>{keyboardOffset}</Text>
					</View> */}

					<View style={{ display: 'flex', flexDirection: 'row' }}>
						<TouchableOpacity
							onPress={openSheet}
							style={[
								globalStyles.card,
								{
									backgroundColor: colors.card,
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									height: 50,
									marginRight: 5,
								},
							]}
						>
							<Icon family='fontawesome5' name='icons' size={28} colour={GreyColours.GREY2} />
						</TouchableOpacity>

						<TextInput
							placeholder='Name'
							placeholderTextColor={GreyColours.GREY2}
							returnKeyType='done'
							onChangeText={(name) => setName(name)}
							value={name}
							style={[
								globalStyles.card,
								globalStyles.cardText,
								{
									backgroundColor: colors.card,
									color: gradient.solid,
									height: 50,
								},
							]}
						/>
					</View>
					<Card title='Colour'>
						<ColourPicker updateGradient={(gradient) => setGradient(gradient)} />
					</Card>
					<Card title='Schedule'>
						<Scheduler schedule={schedule} setSchedule={setSchedule} gradient={gradient} />
						<ColourButtonGroup
							buttons={['Everyday', 'Weekdays', 'Weekend']}
							buttonFunctions={scheduleFunctions}
							colour={gradient.solid}
						/>
					</Card>

					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
						}}
					>
						<Card
							title='Count'
							style={{
								flex: 1,
								marginRight: 5,
							}}
						>
							<View
								style={{
									flex: 1,
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'space-between',
								}}
								onLayout={(event) => {
									let { width } = event.nativeEvent.layout;
									setCountWidth(width / 3 - 5);
								}}
							>
								<View
									style={{
										height: countWidth,
										width: countWidth,
										borderRadius: 5,
										backgroundColor: colors.background,
										display: 'flex',
										justifyContent: 'center',
									}}
								>
									<TextInput
										style={{
											fontFamily: 'Montserrat_800ExtraBold',
											fontSize: 20,
											color: colors.text,
											textAlign: 'center',
										}}
									>
										{count}
									</TextInput>
								</View>

								<TouchableOpacity
									onPress={() => count > 1 && setCount(count - 1)}
									// onPressIn={() => {
									// 	count > 1 && setMinusActive(true);
									// 	count > 1 && setCount(count - 1);
									// }}
									// onPressOut={handlePressOut}
									style={{
										backgroundColor:
											Number(count) > 1 ? gradient.solid + 50 : GreyColours.GREY2 + 50,
										height: countWidth,
										width: countWidth,
										borderRadius: 5,
										overflow: 'hidden',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<Icon
										family='fontawesome'
										name='minus'
										size={20}
										colour={Number(count) > 1 ? gradient.solid : GreyColours.GREY2}
									/>
								</TouchableOpacity>

								<TouchableOpacity
									onPress={() => setCount(count + 1)}
									// onPressIn={() => {
									// 	setAddActive(true);
									// 	setCount(count + 1);
									// }}
									// onPressOut={handlePressOut}
									style={{
										backgroundColor: gradient.solid + 50,
										height: countWidth,
										width: countWidth,
										borderRadius: 5,
										overflow: 'hidden',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<Icon family='fontawesome' name='plus' size={20} colour={gradient.solid} />
								</TouchableOpacity>
							</View>
						</Card>
						<Card title='Reminder' style={{ flex: 1 }}></Card>
					</View>
				</View>
				<View
					style={{
						// flex: 1,
						// display: 'flex',
						// justifyContent: 'flex-end',
						// position: 'absolute',
						// left: 10,
						// right: 10,
						// bottom: -20,
						padding: 10,
						paddingTop: 20,

						// backgroundColor: 'red',
					}}
				>
					<TouchableOpacity
						onPress={handleSave}
						style={{
							display: 'flex',
							height: 50,
							flex: 1,
							borderRadius: 100,
							overflow: 'hidden',
							justifyContent: 'center',
							alignItems: 'center',
							margin: 10,
							// marginTop: 70,
						}}
					>
						<LinearGradient
							colors={[gradient.start, gradient.end]}
							style={globalStyles.gradient}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
						/>
						<Text
							style={{
								fontFamily: 'Montserrat_600SemiBold',
								fontSize: 20,
								color: colors.text,
							}}
						>
							Save
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
			<BottomSheet
				ref={sheetRef}
				snapPoints={['100%', 0]}
				initialSnap={1}
				renderContent={() => <IconModal />}
				renderHeader={() => <HeaderModal sheetRef={sheetRef} />}
				callbackNode={shadow}
			/>
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

const IconOptions: Partial<IconProps>[] = [
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
	{ family: 'materialcommunity', name: 'saxophone' },
	{ family: 'materialcommunity', name: 'piano' },
	{ family: 'fontawesome5', name: 'guitar' },
	{ family: 'fontawesome5', name: 'drum' },
];

interface IconModalProps {
	setIcon: React.Dispatch<React.SetStateAction<Partial<IconProps>>>;
	closeSheet: () => void;
}

const IconModal = ({ setIcon, closeSheet }: IconModalProps) => {
	const { colors } = useTheme();
	const iconWidth = Dimensions.get('window').width / 6.6;

	const handlePress = (icon: Partial<IconProps>) => {
		console.log(icon);
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
			showsVerticalScrollIndicator={false}
		>
			<View
				style={{
					width: '100%',
					display: 'flex',
					flexDirection: 'row',
					flexWrap: 'wrap',
					// justifyContent: 'space-evenly',
				}}
			>
				{IconOptions.map((icon, index) => (
					<TouchableOpacity
						key={index}
						onPress={() => handlePress(icon)}
						style={{
							padding: 10,
							width: iconWidth,
							// backgroundColor: 'red',
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<Icon family={icon.family} name={icon.name} colour={colors.text} size={30} />
					</TouchableOpacity>
				))}
			</View>
		</ScrollView>
	);
};

interface HeaderModalProps {
	sheetRef: React.RefObject<BottomSheet>;
}

const HeaderModal = ({ sheetRef }: HeaderModalProps) => {
	const { colors } = useTheme();
	const closeSheet = () => {
		sheetRef.current && sheetRef.current.snapTo(1);
	};

	const { header } = modalStyles;
	const headerBackground = { backgroundColor: colors.card };
	const headerStyles = StyleSheet.flatten([header, headerBackground]);

	return (
		<TouchableWithoutFeedback style={modalStyles.headerTouchable} onPress={closeSheet}>
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
		height: 240,
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
	// cardTitle: {
	// 	paddingBottom: 10,
	// 	color: '#c5c5c5',
	// 	fontFamily: 'Montserrat_600SemiBold',
	// 	fontSize: 18,
	// 	flex: 1,
	// },
	gradient: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
	},
});

import { DrawerNavigationProp, useIsDrawerOpen } from '@react-navigation/drawer';
import { RouteProp, useTheme } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp, TransitionPresets } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { RootDrawerParamList } from './RootNavigation';
import { Entypo } from '@expo/vector-icons';
import SettingsMenuIcon from 'Components/SettingsMenuIcon/SettingsMenuIcon';
import TabNavigation from './TabNavigation';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import CreateScreen from 'Screens/Create';
import Icon from 'Components/Icon';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { randomGradient } from 'Components/ColourPicker';
import { GradientColours } from '../Styles/Colours';
import EditScreen from 'Screens/Edit';
import ViewScreen from 'Screens/View';
import { AppContext } from 'Context/AppContext';
import IdeaScreen from 'Screens/Idea';

export type AppStackParamList = {
	Tabs: { timerId: string } | undefined;
	Create: undefined;
	View: { id: string };
	Edit: { id: string };
	Ideas: undefined;
};

export type RootNavProps = DrawerNavigationProp<RootDrawerParamList, 'App'>;
export type AppNavProps = StackNavigationProp<AppStackParamList, 'Tabs'>;
export type ViewRoute = RouteProp<AppStackParamList, 'View'>;

const Stack = createStackNavigator<AppStackParamList>();

interface AppNavigationProps {
	navigation: RootNavProps;
}

export default function AppNavigation({ navigation }: AppNavigationProps) {
	const { colors } = useTheme();
	const { habits } = useContext(AppContext);
	// const { activeTimer, setActiveTimer } = useContext(TimerContext);
	// const { gradient, setGradient } = useContext(GradientContext);
	const isDrawerOpen = useIsDrawerOpen();
	const [isOpen, setOpen] = useState(false);

	useEffect(() => {
		setOpen(isDrawerOpen);
	}, [isDrawerOpen]);

	const handleOpen = () => {
		impactAsync(ImpactFeedbackStyle.Light);
		setOpen(!isOpen);
		navigation.toggleDrawer();
	};

	const handleCreate = (navigation: AppNavProps) => {
		impactAsync(ImpactFeedbackStyle.Medium);
		navigation.navigate('Create');
	};

	const handleEdit = (navigation: AppNavProps, route: ViewRoute) => {
		impactAsync(ImpactFeedbackStyle.Medium);
		navigation.navigate('Edit', { id: route.params.id });
	};

	const handleIdeas = (navigation: AppNavProps) => {
		impactAsync(ImpactFeedbackStyle.Medium);
		navigation.navigate('Ideas');
	};

	const handleBack = (navigation: AppNavProps) => {
		impactAsync(ImpactFeedbackStyle.Light);
		navigation.navigate('Tabs');
		// setTimeout(() => setGradient(randomGradient), 100);
	};

	const handleStackBack = (navigation: AppNavProps) => {
		impactAsync(ImpactFeedbackStyle.Light);
		navigation.goBack();
	};

	return (
		<Stack.Navigator
			mode='modal'
			screenOptions={{
				gestureEnabled: true,
				cardOverlayEnabled: true,
				// gestureResponseDistance: { vertical: Dimensions.get('screen').height },
				headerTitleStyle: styles.headerTitle,
				...TransitionPresets.ModalPresentationIOS,
			}}
		>
			<Stack.Screen
				name='Tabs'
				component={TabNavigation}
				options={({ navigation, route }) => ({
					headerBackground: () => <View />,
					headerLeft: () => (
						<TouchableOpacity style={{ paddingLeft: 25 }} onPress={handleOpen}>
							<SettingsMenuIcon
								type='cross'
								active={isOpen}
								onPress={() => {}}
								underlayColor='transparent'
								color={colors.text}
							/>
						</TouchableOpacity>
					),
					headerRight: () => (
						<TouchableOpacity style={{ paddingRight: 25 }} onPress={() => handleCreate(navigation)}>
							<Entypo name='plus' size={38} color={colors.text} />
						</TouchableOpacity>
					),
				})}
			/>
			<Stack.Screen
				name='Create'
				component={CreateScreen}
				options={({ navigation }) => ({
					headerStatusBarHeight: 2,
					headerStyle: { height: 60 },
					title: 'Create Habit',
					headerBackground: () => (
						<LinearGradient
							colors={[GradientColours[randomGradient()].start, GradientColours[randomGradient()].end]}
							style={styles.gradient}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
						/>
					),
					headerLeft: () => (
						<TouchableOpacity
							style={{
								padding: 8,
							}}
							onPress={() => handleBack(navigation)}
						>
							<Feather name='chevron-left' size={34} color={colors.text} />
						</TouchableOpacity>
					),
					headerRight: () => (
						<TouchableOpacity
							style={{
								padding: 10,
								paddingRight: 16,
							}}
							onPress={() => handleIdeas(navigation)}
						>
							<Icon family='antdesign' name='appstore-o' size={28} colour={colors.text} />
						</TouchableOpacity>
					),
				})}
			/>
			<Stack.Screen
				name='View'
				component={ViewScreen}
				options={({ navigation, route }) => ({
					headerStatusBarHeight: 2,
					headerStyle: { height: 60 },
					title: 'View Habit',
					headerBackground: () => (
						<LinearGradient
							colors={[
								GradientColours[habits[route.params.id].gradient].start,
								GradientColours[habits[route.params.id].gradient].end,
							]}
							style={styles.gradient}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
						/>
					),
					headerLeft: () => (
						<TouchableOpacity
							style={{
								padding: 8,
							}}
							onPress={() => handleBack(navigation)}
						>
							<Feather name='chevron-left' size={34} color={colors.text} />
						</TouchableOpacity>
					),
					headerRight: () => (
						<TouchableOpacity
							style={{
								padding: 10,
								paddingRight: 16,
							}}
							onPress={() => handleEdit(navigation, route)}
						>
							<Icon family='feather' name='edit' size={28} colour={colors.text} />
						</TouchableOpacity>
					),
				})}
			/>
			<Stack.Screen
				name='Edit'
				component={EditScreen}
				options={({ navigation, route }) => ({
					headerStatusBarHeight: 2,
					headerStyle: { height: 60 },
					title: 'Edit Habit',
					headerBackground: () => (
						<LinearGradient
							colors={[
								GradientColours[habits[route.params.id].gradient].start,
								GradientColours[habits[route.params.id].gradient].end,
							]}
							style={styles.gradient}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
						/>
					),
					headerLeft: () => (
						<TouchableOpacity
							style={{
								padding: 8,
							}}
							onPress={() => handleStackBack(navigation)}
						>
							<Feather name='chevron-left' size={34} color={colors.text} />
						</TouchableOpacity>
					),
				})}
			/>
			<Stack.Screen
				name='Ideas'
				component={IdeaScreen}
				options={({ navigation }) => ({
					headerStatusBarHeight: 2,
					headerStyle: { height: 60 },
					title: 'Habit Ideas',
					headerBackground: () => <View />,
					headerLeft: () => (
						<TouchableOpacity
							style={{
								padding: 8,
							}}
							onPress={() => handleStackBack(navigation)}
						>
							<Feather name='chevron-left' size={34} color={colors.text} />
						</TouchableOpacity>
					),
				})}
			/>
		</Stack.Navigator>
	);
}

const styles = StyleSheet.create({
	headerTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 20 },
	gradient: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
	},
});
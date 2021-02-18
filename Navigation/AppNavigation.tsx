import { DrawerNavigationProp, useIsDrawerOpen } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import {
	createStackNavigator,
	StackNavigationProp,
	TransitionPresets,
} from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import { View, Button, StyleSheet, Text, Vibration } from 'react-native';
import { RootDrawerParamList } from './RootNavigation';
import { Entypo } from '@expo/vector-icons';
import SettingsMenuIcon from '../Components/SettingsMenuIcon';
import TabNavigation from './TabNavigation';
import { Feather } from '@expo/vector-icons';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import CreateScreen from '../Screens/CreateScreen';
import IconScreen from '../Components/Icon';
import Icon from '../Components/Icon';
import { GradientContext } from '../Context/GradientContext';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { randomGradient } from '../Components/ColourPicker';

export type AppStackParamList = {
	Tabs: undefined;
	Add: undefined;
	Edit: undefined;
	Icons: undefined;
	Ideas: undefined;
};

export type RootNavProps = DrawerNavigationProp<RootDrawerParamList, 'App'>;
export type AppNavProps = StackNavigationProp<AppStackParamList, 'Tabs'>;

const Stack = createStackNavigator<AppStackParamList>();

interface AppNavigationProps {
	navigation: RootNavProps;
}

export default function AppNavigation({ navigation }: AppNavigationProps) {
	const { colors } = useTheme();
	const { gradient, setGradient } = useContext(GradientContext);
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

	const handleAdd = (navigation: AppNavProps) => {
		impactAsync(ImpactFeedbackStyle.Medium);
		navigation.navigate('Add');
	};

	const handleBack = (navigation: AppNavProps) => {
		navigation.navigate('Tabs');
		setTimeout(() => setGradient(randomGradient), 200);
	};

	return (
		<Stack.Navigator
			mode='modal'
			screenOptions={{
				...TransitionPresets.ModalPresentationIOS,
				gestureEnabled: true,
				cardOverlayEnabled: true,
				headerTitleStyle: styles.headerTitle,
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
								onPress={handleOpen}
								underlayColor='transparent'
								color={colors.text}
							/>
						</TouchableOpacity>
					),
					headerRight: () => (
						<TouchableOpacity
							style={{ paddingRight: 25 }}
							onPress={() => handleAdd(navigation)}
						>
							<Entypo name='plus' size={38} color={colors.text} />
						</TouchableOpacity>
					),
				})}
			/>
			<Stack.Screen
				name='Add'
				component={CreateScreen}
				options={({ navigation }) => ({
					headerStatusBarHeight: 2,
					headerStyle: { height: 60 },
					title: 'Create Habit',
					headerBackground: () => (
						<LinearGradient
							colors={[gradient.start, gradient.end]}
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
								paddingRight: 12,
							}}
							onPress={() => navigation.navigate('Ideas')}
						>
							<Icon
								family='antdesign'
								name='appstore-o'
								size={28}
								colour={colors.text}
							/>
						</TouchableOpacity>
					),
				})}
			/>
			<Stack.Screen
				name='Icons'
				component={IconScreen}
				options={({ navigation }) => ({
					headerStatusBarHeight: 2,
					headerStyle: { height: 60 },
					title: 'Select Icon',
					headerBackground: () => (
						<LinearGradient
							colors={[gradient.start, gradient.end]}
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
							onPress={() => navigation.goBack()}
						>
							<Feather name='chevron-left' size={34} color={colors.text} />
						</TouchableOpacity>
					),
				})}
			/>
			<Stack.Screen
				name='Ideas'
				component={IconScreen}
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
							onPress={() => navigation.goBack()}
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

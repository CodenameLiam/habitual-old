import { DrawerNavigationProp, useIsDrawerOpen } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import {
	createStackNavigator,
	StackNavigationProp,
	TransitionPresets,
} from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
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

export type AppStackParamList = {
	Tabs: undefined;
	Add: undefined;
	Edit: undefined;
	Icons: undefined;
};

export type RootNavProps = DrawerNavigationProp<RootDrawerParamList, 'App'>;
export type AppNavProps = StackNavigationProp<AppStackParamList, 'Tabs'>;

const Stack = createStackNavigator<AppStackParamList>();

interface AppNavigationProps {
	navigation: RootNavProps;
}

export default function AppNavigation({ navigation }: AppNavigationProps) {
	const { colors } = useTheme();
	const isDrawerOpen = useIsDrawerOpen();
	const [isOpen, setOpen] = useState(false);

	useEffect(() => {
		setOpen(isDrawerOpen);
	}, [isDrawerOpen]);

	const handleOpen = () => {
		setOpen(!isOpen);
		navigation.toggleDrawer();
	};

	return (
		<Stack.Navigator
			mode='modal'
			screenOptions={{
				...TransitionPresets.ModalPresentationIOS,
				gestureEnabled: true,
				cardOverlayEnabled: true,
				headerTitleStyle: styles.headerTitle,
			}}>
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
							onPress={() => navigation.push('Add')}>
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
					headerLeft: () => (
						<TouchableOpacity
							style={{
								padding: 8,
							}}
							onPress={() => navigation.goBack()}>
							<Feather name='chevron-left' size={34} color={colors.text} />
						</TouchableOpacity>
					),
					headerRight: () => (
						<TouchableOpacity
							style={{
								padding: 10,
								paddingRight: 12,
							}}
							onPress={() => navigation.push('Icons')}>
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

					headerLeft: () => (
						<TouchableOpacity
							style={{
								padding: 8,
							}}
							onPress={() => navigation.goBack()}>
							<Feather name='chevron-left' size={34} color={colors.text} />
						</TouchableOpacity>
					),
					// headerRight: () => (
					// 	<TouchableOpacity
					// 		style={{
					// 			padding: 10,
					// 			paddingRight: 12,
					// 		}}
					// 		onPress={() => handleSave(navigation)}>
					// 		<Icon
					// 			family='antdesign'
					// 			name='appstore-o'
					// 			size={28}
					// 			colour={colors.text}
					// 		/>
					// 	</TouchableOpacity>
					// ),
				})}
			/>
		</Stack.Navigator>
	);
}

const styles = StyleSheet.create({
	headerTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 20 },
});

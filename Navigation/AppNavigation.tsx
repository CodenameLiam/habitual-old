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

export type AppStackParamList = {
	Tabs: undefined;
	Add: undefined;
	Edit: undefined;
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

	const handleSave = (navigation: AppNavProps) => {
		navigation.goBack();
		console.log('This is where shit would be saved');
	};

	return (
		<Stack.Navigator
			mode='modal'
			screenOptions={{
				...TransitionPresets.ModalPresentationIOS,
				gestureEnabled: true,
				cardOverlayEnabled: true,
				headerTitleStyle: styles.header,
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
							onPress={() => navigation.push('Add')}
						>
							<Entypo name='plus' size={38} color={colors.text} />
						</TouchableOpacity>
					),
				})}
			/>
			<Stack.Screen
				name='Add'
				component={Modal}
				options={({ navigation }) => ({
					headerStatusBarHeight: 5,
					title: 'Create Habit',
					headerLeft: () => (
						<TouchableOpacity
							style={{ paddingLeft: 5 }}
							onPress={() => navigation.goBack()}
						>
							<Feather name='chevron-left' size={36} color={colors.text} />
						</TouchableOpacity>
					),
					headerRight: () => (
						<TouchableOpacity
							style={{ paddingRight: 25 }}
							onPress={() => handleSave(navigation)}
						>
							<Feather name='save' size={30} color={colors.text} />
						</TouchableOpacity>
					),
				})}
			/>
		</Stack.Navigator>
	);
}

interface ModalProps {
	navigation: AppNavProps;
}

const Modal = ({ navigation }: ModalProps) => {
	return (
		<ScrollView>
			<View style={{ height: 100 }}>
				<LinearGradient
					// Background Linear Gradient
					colors={['#f4a261', '#fcbf49']}
					style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
				/>
				<Text>Yeet</Text>
				<Button
					onPress={() =>
						navigation.setOptions({
							headerBackground: () => (
								<LinearGradient
									// Background Linear Gradient
									colors={['#f4a261', '#fcbf49']}
									style={{
										position: 'absolute',
										left: 0,
										right: 0,
										top: 0,
										bottom: 0,
									}}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 0 }}
								/>
							),
						})
					}
					title='Change Header Color'
					color='black'
				/>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	header: { fontFamily: 'Montserrat_700Bold', fontSize: 20 },
});

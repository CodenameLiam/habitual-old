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
import { BlurView } from 'expo';

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

	return (
		<Stack.Navigator
			mode='modal'
			screenOptions={{
				...TransitionPresets.ModalPresentationIOS,
				gestureEnabled: true,
				cardOverlayEnabled: true,
			}}
		>
			<Stack.Screen
				name='Tabs'
				component={TabNavigation}
				options={({ navigation, route }) => ({
					headerTitleStyle: styles.header,
					headerBackground: () => <View />,
					headerLeft: () => (
						<View style={{ paddingLeft: 25 }}>
							<SettingsMenuIcon
								type='cross'
								active={isOpen}
								onPress={handleOpen}
								underlayColor='transparent'
								color={colors.text}
							/>
						</View>
					),
					headerRight: () => (
						<View
							style={{ paddingRight: 25 }}
							onTouchEnd={() => navigation.push('Add')}
						>
							<Entypo name='plus' size={38} color={colors.text} />
						</View>
					),
				})}
			/>
			<Stack.Screen name='Add' component={Modal} options={{ headerStatusBarHeight: 5 }} />
		</Stack.Navigator>
	);
}

interface ModalProps {
	navigation: AppNavProps;
}

const Modal = ({ navigation }: ModalProps) => {
	return (
		<View>
			<Text>Yeet</Text>
			<Button onPress={() => navigation.pop()} title='Close Modal' color='coral' />
		</View>
	);
};

const styles = StyleSheet.create({
	header: { fontFamily: 'Montserrat_700Bold', fontSize: 20 },
});

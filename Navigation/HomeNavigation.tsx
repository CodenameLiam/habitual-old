import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import {
	CardStyleInterpolators,
	createStackNavigator,
	StackHeaderProps,
	TransitionPresets,
} from '@react-navigation/stack';
// import Home from '../Screens/Home';
import { DrawerNavigationProp, useIsDrawerOpen } from '@react-navigation/drawer';
import { RootStackParamList } from './RootNavigation';
import { AppNavigationProps } from './AppNavigation';
import SettingsMenuIcon from '../Components/SettingsMenuIcon';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Entypo } from '@expo/vector-icons';

const Stack = createStackNavigator();

interface HomeProps {
	appNavigation: AppNavigationProps;
}

export default function HomeNavigation({ appNavigation }: HomeProps) {
	const { colors } = useTheme();
	const isDrawerOpen = useIsDrawerOpen();
	const [isOpen, setOpen] = useState(false);

	useEffect(() => {
		setOpen(isDrawerOpen);
	}, [isDrawerOpen]);

	const handleOpen = (navigation: any) => {
		setOpen(!isOpen);
		navigation.toggleDrawer();
	};

	return (
		<Stack.Navigator
			mode='modal'
			// headerMode='none'
			screenOptions={{
				...TransitionPresets.ModalPresentationIOS,
				gestureEnabled: true,
				cardOverlayEnabled: true,
			}}>
			<Stack.Screen
				name='Home'
				component={Home}
				options={({ navigation }) => ({
					headerLeft: () => (
						<View style={{ paddingLeft: 25 }}>
							<SettingsMenuIcon
								type='cross'
								active={isOpen}
								onPress={() => handleOpen(navigation)}
								underlayColor='transparent'
								color={colors.text}
							/>
						</View>
					),
					headerRight: () => (
						<View
							style={{ paddingRight: 25 }}
							onTouchEnd={() => navigation.push('Modal')}>
							<Entypo name='plus' size={35} color={colors.text} />
						</View>
					),
				})}
			/>
			<Stack.Screen name='Modal' component={Modal} />
		</Stack.Navigator>
	);
}

const Modal = ({ navigation }: any) => {
	return (
		<View style={styles.modal}>
			<Button onPress={() => navigation.pop()} title='Close Modal' color='coral' />
		</View>
	);
};
const Home = ({ navigation }: any) => {
	return (
		<View style={styles.page}>
			<Button onPress={() => navigation.push('Modal')} title='Open Modal' color='coral' />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	page: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		// backgroundColor: 'white',
	},
	modal: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		// backgroundColor: 'royalblue',
	},
});

// interface HeaderProps {
// 	navigation: any;
// }

// const HomeHeader = ({ navigation }: HeaderProps) => {
// 	const { colors } = useTheme();
// 	const isDrawerOpen = useIsDrawerOpen();
// 	const [isOpen, setOpen] = useState(false);

// 	useEffect(() => {
// 		setOpen(isDrawerOpen);
// 	}, [isDrawerOpen]);

// 	const handleOpen = () => {
// 		setOpen(!isOpen);
// 		navigation.toggleDrawer();
// 	};

// 	return (
// 		<View style={{ backgroundColor: 'red' }}>
// 			<SafeAreaView>
// 				<SettingsMenuIcon
// 					type='cross'
// 					active={isOpen}
// 					onPress={handleOpen}
// 					underlayColor='transparent'
// 					color={colors.text}
// 				/>
// 			</SafeAreaView>
// 		</View>
// 	);
// };

import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Alert,
	Pressable,
	TouchableWithoutFeedback,
	Button,
	TouchableOpacity,
	Modal,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppNavigationProps } from '../Navigation/AppNavigation';
import { useTheme } from '@react-navigation/native';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SettingsMenuIcon from '../Components/SettingsMenuIcon';

interface HomeProps {
	navigation: AppNavigationProps;
}

export default function Home({ navigation }: any) {
	// use it the same way as before (as docs recommend)
	const [modalVisible, setModalVisible] = useModalState(false);
	console.log(modalVisible);

	// const [modalVisible, setModalVisible] = useState(false);

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
		<SafeAreaView>
			{/* <Modal
				presentationStyle='pageSheet'
				animationType='slide'
				visible={modalVisible}
				onRequestClose={() => {
					console.log('Modal closed');
					setModalVisible(!modalVisible);
				}}
				onDismiss={() => {
					console.log('Modal dismissed');
					setModalVisible(!modalVisible);
				}}>
				<View style={{ flex: 1 }}>
					<Text>Hello!</Text>

					<Button title='Hide modal' onPress={() => setModalVisible(false)} />
				</View>
			</Modal>
			<Pressable
				style={[styles.button, styles.buttonOpen]}
				onPress={() => setModalVisible(true)}>
				<Text style={styles.textStyle}>Show Modal</Text>
			</Pressable> */}

			<View style={{ padding: 10, backgroundColor: 'red' }}>
				<SettingsMenuIcon
					type='cross'
					active={isOpen}
					onPress={handleOpen}
					underlayColor='transparent'
					color={colors.text}
				/>
			</View>
			<Button title='Hide modal' onPress={() => navigation.navigate('Other')} />
			{/* <View style={styles.centeredView}>
				
			</View> */}
		</SafeAreaView>
	);
}

export const useModalState = (initialState: any) => {
	const [modalVisible, setModalVisible] = useState(initialState);
	const [forceModalVisible, setForceModalVisible] = useState(false);

	const setModal = (modalState: any) => {
		// tyring to open "already open" modal
		if (modalState && modalVisible) {
			setForceModalVisible(true);
		}
		setModalVisible(modalState);
	};

	useEffect(() => {
		if (forceModalVisible && modalVisible) {
			setModalVisible(false);
		}
		if (forceModalVisible && !modalVisible) {
			setForceModalVisible(false);
			setModalVisible(true);
		}
	}, [forceModalVisible, modalVisible]);

	return [modalVisible, setModal];
};

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		// marginTop: ,
		backgroundColor: 'white',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
		height: 50,
	},
	buttonOpen: {
		backgroundColor: '#F194FF',
	},
	buttonClose: {
		backgroundColor: '#2196F3',
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
	},
});

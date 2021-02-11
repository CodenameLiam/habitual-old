import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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
	Animated,
	Easing,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import {
	RouteProp,
	TabNavigationState,
	useFocusEffect,
	useNavigation,
	useTheme,
} from '@react-navigation/native';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SettingsMenuIcon from '../Components/SettingsMenuIcon';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../Navigation/TabNavigation';
import AppNavigation, { AppNavProps } from '../Navigation/AppNavigation';

type HomeNavProps = BottomTabNavigationProp<TabParamList, 'Home'>;
type HomeRouteProps = RouteProp<TabParamList, 'Home'>;

interface HomeProps {
	navigation: HomeNavProps;
	route: HomeRouteProps;
}

export default function Home({ navigation, route }: HomeProps) {
	const [day, setDay] = useState('Today');

	const growAnim = useRef(new Animated.Value(0)).current;

	const [count, setCount] = useState(1);

	useEffect(() => {
		grow();
	}, [count]);

	const grow = () => {
		// Will change fadeAnim value to 1 in 5 seconds
		Animated.timing(growAnim, {
			toValue: count,
			duration: 1000,
			useNativeDriver: true,
			easing: Easing.out(Easing.quad),
		}).start();
	};

	const shrink = () => {
		// Will change fadeAnim value to 0 in 5 seconds
		Animated.timing(growAnim, {
			toValue: 0,
			duration: 1000,
			useNativeDriver: true,
			easing: Easing.out(Easing.cubic),
		}).start();
	};

	useFocusEffect(
		useCallback(() => {
			const stackNavigator = navigation.dangerouslyGetParent();
			if (stackNavigator) {
				stackNavigator.setOptions({
					title: day,
				});
			}
		}, [navigation, day])
	);

	const dimensions = 40;
	// const bigDimensions = growAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 650] });

	return (
		<View style={{ flex: 1, padding: 20 }}>
			{/* <Text>{growAnim}</Text> */}
			{/* <Button title='Yesterday' onPress={() => setDay('Yesterday')} />
			<Button title='Today' onPress={() => setDay('Today')} /> */}

			<Button title='Complete' onPress={() => setCount(count + 1)} />
			<Button title='UnComplete' onPress={() => setCount(count - 1)} />

			<View
				style={{
					backgroundColor: 'white',
					height: 80,
					borderRadius: 10,
					overflow: 'hidden',
				}}
			>
				<View
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						backgroundColor: 'salmon',
						height: dimensions,
						width: dimensions,
						borderRadius: dimensions,
						position: 'absolute',
						top: 20,
						left: 10,
					}}
				>
					<Animated.View
						style={{
							backgroundColor: 'salmon',
							height: 20,
							width: 20,
							transform: [{ scale: growAnim }],
							// transform: [{ scale: bigDimensions }],
							// scaleX: bigDimensions,
							// scaleY: bigDimensions,
							borderRadius: 700,
						}}
					/>
				</View>
			</View>
		</View>
	);
}

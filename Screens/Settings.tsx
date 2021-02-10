import { DrawerContentComponentProps, DrawerContentOptions } from '@react-navigation/drawer';
import React from 'react';
import { View, Text } from 'react-native';
import { ScrollView, Switch } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeType, useTheme } from '../Storage/ThemeController';

interface SettingsProps {
	theme: ThemeType;
	setTheme: (theme: ThemeType) => void;
	toggleTheme: (theme: ThemeType) => 'dark' | 'light';
}

export default function Settings({ theme, setTheme, toggleTheme }: SettingsProps) {
	const toggleThemeSwitch = () => {
		setTheme(toggleTheme(theme));
	};

	return (
		<View style={{ flex: 1, overflow: 'hidden', backgroundColor: '0F2028 ' }}>
			<View
				style={{
					position: 'absolute',
					top: 0,
					right: 0,
					height: '100%',
					width: 15,
					marginRight: -15,
					backgroundColor: 'rgb(48, 47, 60)',
					alignSelf: 'center',
					shadowColor: 'black',

					shadowRadius: 15,
					shadowOpacity: 0.3,
				}}
			/>

			<SafeAreaView style={{ flex: 1 }}>
				<Text>Test</Text>
				<Switch value={theme == 'light' ? false : true} onValueChange={toggleThemeSwitch} />
			</SafeAreaView>
		</View>
	);
}

import { DrawerContentComponentProps, DrawerContentOptions } from '@react-navigation/drawer';
import React from 'react';
import { View, Text } from 'react-native';
import { ScrollView, Switch } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ColourPicker } from 'Components/ColourPicker';
import { ThemeType } from 'Controllers/ThemeController';
import { GradientType } from 'Styles/Colours';

interface SettingsProps {
	theme: ThemeType;
	setTheme: (theme: ThemeType) => void;
	toggleTheme: (theme: ThemeType) => 'dark' | 'light';
	setColour: (colour: GradientType) => void;
}

export default function SettingsScreen ({ theme, setTheme, toggleTheme, setColour }: SettingsProps) {
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
				  shadowOpacity: 0.3
                }}
            />

            <SafeAreaView style={{ flex: 1 }}>
                <Text>Test</Text>
                <Switch value={theme != 'light'} onValueChange={toggleThemeSwitch} />
                <ColourPicker updateGradient={(gradient) => setColour(gradient)} />
            </SafeAreaView>
        </View>
    );
}

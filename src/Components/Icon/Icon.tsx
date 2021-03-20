import React from 'react';
import { View, Text, StyleProp, TextStyle } from 'react-native';

import { FontAwesome, FontAwesome5, Entypo, MaterialIcons, MaterialCommunityIcons, Feather, AntDesign, Ionicons } from '@expo/vector-icons';

export interface IconProps {
	family?:
		| 'fontawesome'
		| 'fontawesome5'
		| 'entypo'
		| 'material'
		| 'materialcommunity'
		| 'feather'
		| 'antdesign'
		| 'ion';

	name: any;
	size: number;
	colour: string;
	style?: StyleProp<TextStyle>;
}

export default function Icon ({ family, name, size, colour, style }: IconProps): JSX.Element {
    switch (family) {
        case 'entypo':
            return <Entypo name={name} size={size} color={colour} style={style} />;
        case 'fontawesome':
            return <FontAwesome name={name} size={size} color={colour} style={style} />;
        case 'fontawesome5':
            return <FontAwesome5 name={name} size={size} color={colour} style={style} />;
        case 'material':
            return <MaterialIcons name={name} size={size} color={colour} style={style} />;
        case 'materialcommunity':
            return <MaterialCommunityIcons name={name} size={size} color={colour} style={style} />;
        case 'feather':
            return <Feather name={name} size={size} color={colour} style={style} />;
        case 'antdesign':
            return <AntDesign name={name} size={size} color={colour} style={style} />;
        case 'ion':
            return <Ionicons name={name} size={size} color={colour} style={style} />;
        default:
            return <View />;
    }
}

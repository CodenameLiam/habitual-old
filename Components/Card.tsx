import { useTheme } from '@react-navigation/native';
import React from 'react';
import { ViewStyle, StyleSheet, View, Text } from 'react-native';
import { GreyColours } from '../Styles/Colours';

interface CardProps {
	children?: React.ReactNode;
	title?: string;
	style?: ViewStyle;
}

export const Card = ({ children, title, style }: CardProps) => {
	const { colors } = useTheme();

	const styles = StyleSheet.create({
		card: {
			margin: 15,
			marginBottom: 0,
			padding: 10,
			borderRadius: 5,
			backgroundColor: colors.card,
		},
		title: {
			paddingBottom: 10,
			color: GreyColours.GREY2,
			fontFamily: 'Montserrat_600SemiBold',
			fontSize: 18,
		},
	});

	return (
		<View style={[styles.card, style]}>
			{title && <Text style={styles.title}>{title}</Text>}
			{children}
		</View>
	);
};

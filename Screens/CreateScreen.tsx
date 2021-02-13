import { Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { useTheme } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { View, Text, ScrollView, Button, Dimensions, StyleSheet } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { color } from 'react-native-reanimated';
import { ColourPicker, randomGradient } from '../Components/ColourPicker';
import Icon from '../Components/Icon';
import { AppNavProps } from '../Navigation/AppNavigation';
import { GradientColours, GradientType, GreyColours } from '../Styles/Colours';

interface CreateProps {
	navigation: AppNavProps;
}

type ScheduleTypeValue = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

interface ScheduleType {
	MON: boolean;
	TUE: boolean;
	WED: boolean;
	THU: boolean;
	FRI: boolean;
	SAT: boolean;
	SUN: boolean;
}

const EVERYDAY_SCHEDULE: ScheduleType = {
	MON: true,
	TUE: true,
	WED: true,
	THU: true,
	FRI: true,
	SAT: true,
	SUN: true,
};

const WEEKDAY_SCHEDULE: ScheduleType = {
	MON: true,
	TUE: true,
	WED: true,
	THU: true,
	FRI: true,
	SAT: false,
	SUN: false,
};

const WEEKEND_SCHEDULE: ScheduleType = {
	MON: false,
	TUE: false,
	WED: false,
	THU: false,
	FRI: false,
	SAT: true,
	SUN: true,
};

export default function CreateScreen({ navigation }: CreateProps) {
	const [gradient, setGradient] = useState<GradientType>();
	const [schedule, setSchedule] = useState<ScheduleType>(EVERYDAY_SCHEDULE);
	const { colors } = useTheme();

	useEffect(() => {
		const gradient: GradientType = randomGradient();
		updateGradient(gradient);
	}, []);

	const updateGradient = (gradient: GradientType) => {
		setGradient(gradient);
		navigation.setOptions({
			headerBackground: () => (
				<LinearGradient
					colors={[gradient.start, gradient.end]}
					style={globalStyles.gradient}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
				/>
			),
		});
	};

	const scheduleFunctions = [
		() => setSchedule({ ...EVERYDAY_SCHEDULE }),
		() => setSchedule({ ...WEEKDAY_SCHEDULE }),
		() => setSchedule({ ...WEEKEND_SCHEDULE }),
	];

	if (!gradient) return <View />;

	return (
		<ScrollView style={{ flex: 1 }} scrollEnabled={false}>
			<View style={{ flex: 1, padding: 10 }}>
				<View style={{ display: 'flex', flexDirection: 'row' }}>
					<TouchableOpacity
						style={[
							globalStyles.card,
							{
								backgroundColor: colors.card,
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								height: 50,
								marginRight: 5,
							},
						]}>
						<Icon
							family='fontawesome5'
							name='icons'
							size={28}
							colour={GreyColours.GREY2}
						/>
					</TouchableOpacity>

					<TextInput
						placeholder='Name'
						placeholderTextColor={GreyColours.GREY2}
						style={[
							globalStyles.card,
							globalStyles.cardText,
							{
								backgroundColor: colors.card,
								color: gradient.solid,
								height: 50,
							},
						]}
					/>
				</View>
				<Card title='Colour'>
					<ColourPicker updateGradient={updateGradient} />
				</Card>
				<Card title='Schedule'>
					<Schedule schedule={schedule} setSchedule={setSchedule} gradient={gradient} />
					<ColourButtonGroup
						buttons={['Everyday', 'Weekdays', 'Weekend']}
						buttonFunctions={scheduleFunctions}
						colour={gradient.solid}
					/>
				</Card>
			</View>
		</ScrollView>
	);
}

interface ScheduleProps {
	gradient: GradientType;
	schedule: ScheduleType;
	setSchedule: React.Dispatch<React.SetStateAction<ScheduleType>>;
}
const Schedule = ({ gradient, schedule, setSchedule }: ScheduleProps) => {
	const { colors } = useTheme();
	const dimensions = Dimensions.get('window').width / 11;

	const styles = StyleSheet.create({
		container: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			padding: 5,
			paddingBottom: 15,
		},
		schedule: {
			backgroundColor: colors.background,
			height: dimensions,
			width: dimensions,
			borderRadius: dimensions,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			overflow: 'hidden',
		},
		text: { fontFamily: 'Montserrat_600SemiBold', fontSize: 16 },
	});

	const handleSchedule = (day: ScheduleTypeValue) => {
		const tempSchedule = schedule;
		tempSchedule[day] = !tempSchedule[day];
		setSchedule({ ...tempSchedule });
	};

	return (
		<View style={styles.container}>
			{Object.entries(schedule).map((day) => (
				<TouchableOpacity
					key={`${day[0]}- ${day[1]}`}
					style={styles.schedule}
					onPress={() => handleSchedule(day[0] as ScheduleTypeValue)}>
					{day[1] && (
						<LinearGradient
							colors={[gradient.start, gradient.end]}
							style={globalStyles.gradient}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
						/>
					)}
					<Text
						style={[
							styles.text,
							day[1] ? { color: '#fff' } : { color: GreyColours.GREY2 },
						]}>
						{day[0][0]}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	);
};

interface ColouredButtonGroupProps {
	colour: string;
	buttons: string[];
	buttonFunctions: (() => void)[];
}

const ColourButtonGroup = ({ buttons, buttonFunctions, colour }: ColouredButtonGroupProps) => {
	const width = 95 / buttons.length;

	const styles = StyleSheet.create({
		container: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' },
		button: {
			backgroundColor: colour + '50',
			width: `${width}%`,
			borderRadius: 5,
		},
		touchable: {
			flex: 1,
			padding: 8,
		},
		text: {
			textAlign: 'center',
			fontFamily: 'Montserrat_600SemiBold',
			color: colour,
		},
	});

	return (
		<View style={styles.container}>
			{buttons.length == buttonFunctions.length &&
				buttons.map((title, index) => (
					<View key={index} style={styles.button}>
						<TouchableOpacity style={styles.touchable} onPress={buttonFunctions[index]}>
							<Text style={styles.text}>{title}</Text>
						</TouchableOpacity>
					</View>
				))}
		</View>
	);
};

interface CardProps {
	children?: React.ReactNode;
	title: string;
}

const Card = ({ children, title }: CardProps) => {
	const { colors } = useTheme();

	const styles = StyleSheet.create({
		card: { margin: 10, padding: 10, borderRadius: 5, backgroundColor: colors.card },
		title: {
			paddingBottom: 10,
			color: GreyColours.GREY2,
			fontFamily: 'Montserrat_600SemiBold',
			fontSize: 18,
			flex: 1,
		},
	});

	return (
		<View style={styles.card}>
			<Text style={styles.title}>{title}</Text>
			{children}
		</View>
	);
};

const globalStyles = StyleSheet.create({
	card: { margin: 10, padding: 10, borderRadius: 5 },
	cardText: {
		fontFamily: 'Montserrat_600SemiBold',
		fontSize: 18,
		flex: 1,
	},
	cardTitle: {
		paddingBottom: 10,
		color: '#c5c5c5',
		fontFamily: 'Montserrat_600SemiBold',
		fontSize: 18,
		flex: 1,
	},
	gradient: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
	},
});

import { useFocusEffect, useTheme } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    Keyboard,
    EmitterSubscription,
    InteractionManager
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { ColourPicker } from 'Components/ColourPicker';
import Icon, { IconProps } from 'Components/Icon';
import { GradientColours, GreyColours } from 'Styles/Colours';
import BottomSheet from 'reanimated-bottom-sheet';
import { ColourButtonGroup } from 'Components/ColourButtonGroup';
import {
    EVERYDAY_SCHEDULE,
    Scheduler,
    ScheduleType,
    WEEKDAY_SCHEDULE,
    WEEKEND_SCHEDULE
} from 'Components/Scheduler';
import { IHabit } from 'Controllers/HabitController';
import { HabitType } from 'Components/Habit';
import { getRandomBytes } from 'expo-random';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Card } from 'Components/Card';
import Toast, { BaseToastProps } from 'react-native-toast-message';
import { AppContext } from 'Context/AppContext';
import { impactAsync, ImpactFeedbackStyle, notificationAsync, NotificationFeedbackType } from 'expo-haptics';
import { EditNavProps } from 'Screens/Edit';
import { globalStyles } from './HabitEditor.styles';
import { randomGradient } from 'Helpers';
import { ShadowModal, IconModal, HeaderModal, TimeModal } from './molecules';

interface EditProps {
	navigation: EditNavProps;
	habit?: IHabit;
	// resetGradient?: boolean;
}

/**
 * TODO: Modularise this file
 */

const HabitEdtor: React.FC<EditProps> = ({ navigation, habit }) => {
    const { colors } = useTheme();
    const { createHabit } = useContext(AppContext);
    const [localGradient, setLocalGradient] = useState(habit ? habit.gradient : randomGradient());

    useFocusEffect(
        useCallback(() => {
            navigation.setOptions({
                headerBackground: () => (
                    <LinearGradient
                        colors={[GradientColours[localGradient].start, GradientColours[localGradient].end]}
                        style={globalStyles.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    />
                )
            });
        }, [navigation, localGradient])
    );

    const [isReady, setIsReady] = useState(false);
    const sheetRef = React.useRef<BottomSheet>(null);
    const timeRef = React.useRef<BottomSheet>(null);
    const shadow = useRef(new Animated.Value<number>(1)).current;

    const [name, setName] = useState(habit ? habit.name : '');
    const [count, setCount] = useState(habit ? habit.progressTotal : 1);
    const [type, setType] = useState<HabitType>(habit ? habit.type : 'count');
    const [icon, setIcon] = useState<Partial<IconProps>>({
        family: habit ? habit.icon.family : 'fontawesome5',
        name: habit ? habit.icon.name : 'icons'
    });

    const [hours, setHours] = useState(habit ? Math.floor(count / 3600) : 0);
    const [minutes, setMinutes] = useState(habit ? Math.floor((count % 3600) / 60) : 1);

    const [schedule, setSchedule] = useState<ScheduleType>(habit ? habit.schedule : { ...EVERYDAY_SCHEDULE });

    const toastConfig = {
        error: ({ text1 }: BaseToastProps): JSX.Element => (
            <View
                style={{
				  height: 40,
				  width: '90%',
				  borderRadius: 6,
				  backgroundColor: GradientColours.RED.solid,
				  flexDirection: 'row',
				  alignItems: 'center',
				  justifyContent: 'center'
                }}
            >
                <Text style={{ color: colors.text, fontFamily: 'Montserrat_600SemiBold' }}>{text1}</Text>
            </View>
        )
    };

    const scheduleFunctions = [
        () => {
            setSchedule({ ...EVERYDAY_SCHEDULE });
            impactAsync(ImpactFeedbackStyle.Light);
        },
        () => {
            setSchedule({ ...WEEKDAY_SCHEDULE });
            impactAsync(ImpactFeedbackStyle.Light);
        },
        () => {
            setSchedule({ ...WEEKEND_SCHEDULE });
            impactAsync(ImpactFeedbackStyle.Light);
        }
    ];

    const openSheet = (): void => {
        sheetRef.current && sheetRef.current.snapTo(0);
    };

    const closeSheet = (): void => {
        sheetRef.current && sheetRef.current.snapTo(1);
    };

    const openTime = (): void => {
        timeRef.current && timeRef.current.snapTo(0);
    };

    const handleSave = async (): Promise<void> => {
        if (name === '') {
            Toast.show({
                type: 'error',
                text1: 'Please enter a name for your new habit',
                position: 'bottom',
                bottomOffset: 150
            });
            notificationAsync(NotificationFeedbackType.Error);
        } else if (Object.values(schedule).every((value) => value === false)) {
            Toast.show({
                type: 'error',
                text1: 'Please schedule your habit for at least one day',
                position: 'bottom',
                bottomOffset: 150
            });
            notificationAsync(NotificationFeedbackType.Error);
        } else if (count === 0) {
            Toast.show({
                type: 'error',
                text1: 'Please assign time to your habit',
                position: 'bottom',
                bottomOffset: 150
            });
            notificationAsync(NotificationFeedbackType.Error);
        } else {
            const newHabit: IHabit = {
                id: habit ? habit.id : getRandomBytes(8).join(''),
                name: name,
                icon: icon,
                gradient: localGradient,
                progressTotal: count,
                type: type,
                schedule: schedule,
                dates: habit ? habit.dates : {}
            };
            notificationAsync(NotificationFeedbackType.Success);
            createHabit(newHabit);
            navigation.goBack();
            // resetGradient === true && setTimeout(() => setGradient(randomGradient), 100);
        }
    };

    const handleCountType = (text: string): void => {
        setCount(Number(text));
    };

    const handleTimeType = (values: { hours: number; minutes: number }): void => {
        const { hours, minutes } = values;
        setHours(hours);
        setMinutes(minutes);
        setCount(hours * 3600 + minutes * 60);
    };

    const handleCountChange = (): void => {
        setCount(1);
        setType('count');
        setHours(0);
        setMinutes(1);
    };

    const handleTimeChange = (): void => {
        setCount(60);
        setType('timer');
    };

    const keyboardDidHideListener = useRef<EmitterSubscription>();
    const onKeyboardHide = (): void => {
        count === 0 && setCount(1);
    };

    const getFormattedTimeCount = (): string => {
        const h = Math.floor(count / 3600);
        const m = Math.floor((count % 3600) / 60);

        const hString = h > 0 ? `${h} hr ` : '';
        const mString = m > 0 || (m === 0 && h === 0) ? `${m} m ` : '';

        return hString + mString;
    };

    useEffect(() => {
        keyboardDidHideListener.current = Keyboard.addListener('keyboardDidHide', onKeyboardHide);
        return () => {
			keyboardDidHideListener.current!.remove();
        };
    }, [count]);

    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            setIsReady(true);
        });
    });

    return (
        <React.Fragment>
            <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }} scrollEnabled={false} extraScrollHeight={60}>
                <ShadowModal shadow={shadow} />

                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={openSheet}>
                        <Card>
                            <Icon family={icon.family} name={icon.name} size={28} colour={GreyColours.GREY2} />
                        </Card>
                    </TouchableOpacity>
                    <Card style={{ marginLeft: 0, flex: 1 }}>
                        <TextInput
                            placeholder='Name'
                            placeholderTextColor={GreyColours.GREY2}
                            returnKeyType='done'
                            onChangeText={(name) => setName(name)}
                            value={name}
                            style={[
							  globalStyles.cardText,
							  {
							    color: GradientColours[localGradient].solid,
							    flex: 1
							  }
                            ]}
                        />
                    </Card>
                </View>
                <Card title='Colour'>
                    <ColourPicker updateGradient={(gradient) => setLocalGradient(gradient)} />
                </Card>
                <Card title='Schedule'>
                    <Scheduler
                        schedule={schedule}
                        setSchedule={setSchedule}
                        gradient={GradientColours[localGradient]}
                    />
                    <ColourButtonGroup
                        buttons={['Everyday', 'Weekdays', 'Weekend']}
                        buttonFunctions={scheduleFunctions}
                        colour={GradientColours[localGradient].solid}
                    />
                </Card>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Card title='Type' style={{ marginRight: 0 }}>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <TouchableOpacity
                                onPress={handleCountChange}
                                style={[
								  globalStyles.type,
								  {
								    backgroundColor:
											type === 'count'
											  ? GradientColours[localGradient].solid + 50
											  : GreyColours.GREY2 + 50,
								    marginRight: 10
								  }
                                ]}
                            >
                                <Icon
                                    family='fontawesome'
                                    name='plus'
                                    size={24}
                                    colour={type === 'count' ? GradientColours[localGradient].solid : GreyColours.GREY2}
                                    style={{ zIndex: 1 }}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleTimeChange}
                                style={[
								  globalStyles.type,
								  {
								    backgroundColor:
											type === 'timer'
											  ? GradientColours[localGradient].solid + 50
											  : GreyColours.GREY2 + 50
								  }
                                ]}
                            >
                                <Icon
                                    family='antdesign'
                                    name='clockcircle'
                                    size={24}
                                    colour={type === 'timer' ? GradientColours[localGradient].solid : GreyColours.GREY2}
                                    style={{ zIndex: 1 }}
                                />
                            </TouchableOpacity>
                        </View>
                    </Card>
                    <Card title='Value' style={{ flex: 1 }}>
                        {type === 'count'
						  ? (
                                <View
                                    style={{
								  display: 'flex',
								  flexDirection: 'row',
								  justifyContent: 'space-between'
                                    }}
                                >
                                    <TextInput
                                        returnKeyType='done'
                                        onChangeText={handleCountType}
                                        value={count > 0 ? count.toString() : ''}
                                        keyboardType='number-pad'
                                        style={[
									  {
									    color: GradientColours[localGradient].solid,
									    flex: 1,
									    backgroundColor: colors.background,
									    borderRadius: 5,
									    textAlign: 'center',
									    fontFamily: 'Montserrat_800ExtraBold',
									    fontSize: 20
									  }
                                        ]}
                                    />
                                    <TouchableOpacity
                                        onPress={() => count > 1 && setCount(count - 1)}
                                        style={[
									  globalStyles.count,
									  {
									    marginLeft: 10,
									    marginRight: 10,
									    backgroundColor:
												count > 1
												  ? GradientColours[localGradient].solid + 50
												  : GreyColours.GREY2 + 50
									  }
                                        ]}
                                    >
                                        <Icon
                                            family='fontawesome'
                                            name='minus'
                                            size={24}
                                            colour={
                                                count > 1 ? GradientColours[localGradient].solid : GreyColours.GREY2
                                            }
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => setCount(count + 1)}
                                        style={[
									  globalStyles.count,
									  {
									    backgroundColor: GradientColours[localGradient].solid + 50
									  }
                                        ]}
                                    >
                                        <Icon
                                            family='fontawesome'
                                            name='plus'
                                            size={24}
                                            colour={GradientColours[localGradient].solid}
                                        />
                                    </TouchableOpacity>
                                </View>
						    )
						  : (
                                <TouchableOpacity
                                    onPress={openTime}
                                    style={{
								  flex: 1,
								  backgroundColor: colors.background,
								  borderRadius: 5,
								  display: 'flex',
								  justifyContent: 'center'
                                    }}
                                >
                                    <Text
                                        style={{
									  color: GradientColours[localGradient].solid,
									  textAlign: 'center',
									  fontFamily: 'Montserrat_800ExtraBold',
									  fontSize: 20
                                        }}
                                    >
                                        {getFormattedTimeCount()}
                                    </Text>
                                </TouchableOpacity>
						    )}
                    </Card>
                </View>

                <View
                    style={{
					  flex: 1,
					  justifyContent: 'center',
					  alignItems: 'center',
					  margin: 10
                    }}
                >
                    <TouchableOpacity
                        onPress={handleSave}
                        style={{
						  height: 60,
						  borderRadius: 100,
						  overflow: 'hidden',
						  justifyContent: 'center',
						  alignItems: 'center',
						  width: '100%',
						  margin: 10
                        }}
                    >
                        <LinearGradient
                            colors={[GradientColours[localGradient].start, GradientColours[localGradient].end]}
                            style={globalStyles.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        />
                        <Text
                            style={{
							  fontFamily: 'Montserrat_600SemiBold',
							  fontSize: 20,
							  color: colors.text
                            }}
                        >
							Save
                        </Text>
                    </TouchableOpacity>
                </View>

                {isReady && (
                    <React.Fragment>
                        <BottomSheet
                            ref={sheetRef}
                            snapPoints={['100%', 0]}
                            initialSnap={1}
                            renderContent={() => <IconModal setIcon={setIcon} closeSheet={closeSheet} />}
                            renderHeader={() => <HeaderModal sheetRef={sheetRef} height={240} />}
                            callbackNode={shadow}
                        />
                        <BottomSheet
                            ref={timeRef}
                            snapPoints={['100%', 0]}
                            initialSnap={1}
                            renderContent={() => (
                                <TimeModal minutes={minutes} hours={hours} handleTimeType={handleTimeType} />
                            )}
                            renderHeader={() => <HeaderModal sheetRef={timeRef} height={550} />}
                            callbackNode={shadow}
                        />
                    </React.Fragment>
                )}
            </KeyboardAwareScrollView>
            <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
        </React.Fragment>
    );
};

export default HabitEdtor;
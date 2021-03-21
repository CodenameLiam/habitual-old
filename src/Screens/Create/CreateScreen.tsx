import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    EmitterSubscription,
    InteractionManager,
    Keyboard,
    StyleSheet,
    TextInput,
    Text,
    View,
} from 'react-native';
import { getDefaultHabit, IHabit } from 'Controllers/HabitController';
import { GradientColours, GradientType, GreyColours } from 'Styles';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from 'Navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';
import HeaderBackground from 'Headers/HeaderBackground';
import Icon, { IconProps } from 'Components/Icon';
import Toast from 'react-native-toast-message';
import { ToastConfig } from 'Components/Toast/CustomToast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
    impactAsync,
    ImpactFeedbackStyle,
    notificationAsync,
    NotificationFeedbackType,
} from 'expo-haptics';
import { Card } from 'Components/Card';
import styled from '@emotion/native';
import { ColourPicker } from 'Components/ColourPicker';
import {
    EVERYDAY_SCHEDULE,
    Scheduler,
    ScheduleType,
    WEEKDAY_SCHEDULE,
    WEEKEND_SCHEDULE,
} from 'Components/Scheduler';
import { ColourButtonGroup } from 'Components/ColourButtonGroup';
import { MarginLeft, MarginRight, Row, RowBetween } from 'Styles/Globals';
import { Input, ProgressTextInput, SqaureButton } from './CreateScreen.styles';
import { getRandomColour } from 'Components/ColourPicker/GetRandomColour';
import { HabitType } from 'Components/Habit';
import { TypeModule } from './TypeModule';
import { CountModule } from './CountModule';

import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import { TimeModule } from './TimeModule';
import { DEFAULT_GESTURE_RESPONSE } from 'Components/DismissableScrollView';
import { ModalModule } from './ModalModule';
import { EditNavProps } from 'Screens/Edit';
import { AppContext } from 'Context';
import { LinearGradient } from 'expo-linear-gradient';
import { SaveModule } from './SaveModule';

export type CreateNavProps = StackNavigationProp<AppStackParamList, 'Create'>;
export type CreateRoute = RouteProp<AppStackParamList, 'Create'>;

interface CreateProps {
    navigation: CreateNavProps;
    route: CreateRoute;
}

const CreateScreen: React.FC<CreateProps> = ({ navigation, route }) => {
    return (
        <HabitEditor
            navigation={navigation}
            gradient={route.params.gradient}
            icon={route.params.icon}
        />
    );
};

export default CreateScreen;

const scheduleFunctions = [EVERYDAY_SCHEDULE, WEEKDAY_SCHEDULE, WEEKEND_SCHEDULE];

interface HabitEditorProps {
    navigation: CreateNavProps | EditNavProps;
    editHabit?: IHabit;
    gradient?: GradientType;
    icon?: Partial<IconProps>;
}

const HabitEditor: React.FC<HabitEditorProps> = ({ editHabit, navigation, gradient, icon }) => {
    const [habit, setHabit] = useState<IHabit>(editHabit ? editHabit : getDefaultHabit(gradient!));
    const [hours, setHours] = useState(Math.floor(habit.progressTotal / 3600));
    const [minutes, setMinutes] = useState(Math.floor((habit.progressTotal % 3600) / 60));
    const [isReady, setIsReady] = useState(false);
    const timeRef = useRef<BottomSheet>(null);

    // Updates the header to reflect the current gradient
    useEffect(() => {
        navigation.setOptions({
            headerBackground: () => <HeaderBackground colour={habit.gradient} />,
        });
    }, [habit.gradient]);

    // Updates the icon to reflect the selected icon
    useEffect(() => {
        icon && setHabit({ ...habit, icon: icon });
    }, [icon]);

    // Check if heavier components can be rendered
    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            setIsReady(true);
        });
    }, []);

    // Adds a listener to the keyboard hide event
    useEffect(() => {
        keyboardDidHideListener.current = Keyboard.addListener('keyboardDidHide', onKeyboardHide);
        return () => {
            keyboardDidHideListener.current!.remove();
        };
    }, [habit.progressTotal]);

    // Sets the progress to be at least 1
    const keyboardDidHideListener = useRef<EmitterSubscription>();
    const onKeyboardHide = () => {
        habit.progressTotal === 0 && setHabit({ ...habit, progressTotal: 1 });
    };

    const handleIconPress = () => {
        impactAsync(ImpactFeedbackStyle.Light);
        navigation.navigate('Icons');
    };

    const handleSchedulePress = (schedule: ScheduleType) => {
        impactAsync(ImpactFeedbackStyle.Light);
        setHabit({ ...habit, schedule: schedule });
    };

    const handleTimeOpen = () => {
        navigation.setOptions({
            gestureResponseDistance: {
                vertical: DEFAULT_GESTURE_RESPONSE,
            },
        });
        timeRef.current && timeRef.current.snapTo(0);
    };

    const handleTimeClose = () => {
        navigation.setOptions({
            gestureResponseDistance: {
                vertical: Dimensions.get('screen').height,
            },
        });
    };

    // return <></>;

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{ flex: 1 }}
            scrollEnabled={false}
            extraScrollHeight={60}>
            <View style={Row}>
                <TouchableOpacity onPress={handleIconPress}>
                    <Card>
                        <Icon
                            family={habit.icon.family}
                            name={habit.icon.name}
                            size={28}
                            colour={GreyColours.GREY2}
                        />
                    </Card>
                </TouchableOpacity>
                <Card style={{ marginLeft: 0, flex: 1 }}>
                    <Input
                        gradient={GradientColours[habit.gradient].solid}
                        placeholder='Name'
                        placeholderTextColor={GreyColours.GREY2}
                        returnKeyType='done'
                        onChangeText={(name) => setHabit({ ...habit, name: name })}
                        value={habit.name}
                    />
                </Card>
            </View>

            <Card title='Colour'>
                <ColourPicker
                    updateGradient={(gradient) => setHabit({ ...habit, gradient: gradient })}
                />
            </Card>
            <Card title='Schedule'>
                <Scheduler
                    schedule={habit.schedule}
                    setSchedule={(schedule) => setHabit({ ...habit, schedule: schedule })}
                    gradient={GradientColours[habit.gradient]}
                />
                <ColourButtonGroup
                    buttons={['Everyday', 'Weekdays', 'Weekend']}
                    buttonFunctions={scheduleFunctions.map((schedule) => () =>
                        handleSchedulePress(schedule)
                    )}
                    colour={GradientColours[habit.gradient].solid}
                />
            </Card>

            <View style={Row}>
                <TypeModule
                    habit={habit}
                    setHabit={setHabit}
                    setHours={setHours}
                    setMinutes={setMinutes}
                />
                <Card title='Value' style={{ flex: 1 }}>
                    {habit.type === 'count' ? (
                        <CountModule habit={habit} setHabit={setHabit} />
                    ) : (
                        <TimeModule habit={habit} handleOpen={handleTimeOpen} />
                    )}
                </Card>
            </View>

            {isReady && (
                <ModalModule
                    habit={habit}
                    setHabit={setHabit}
                    hours={hours}
                    setHours={setHours}
                    minutes={minutes}
                    setMinutes={setMinutes}
                    timeRef={timeRef}
                    handleTimeClose={handleTimeClose}
                />
            )}

            <SaveModule habit={habit} navigation={navigation} />

            <Toast config={ToastConfig} ref={(ref) => Toast.setRef(ref)} />
        </KeyboardAwareScrollView>
    );
};

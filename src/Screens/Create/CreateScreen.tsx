import React, { useEffect, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
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
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
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
import { Row } from 'Styles/Globals';
import { Input, SqaureButton } from './CreateScreen.styles';
import { getRandomColour } from 'Components/ColourPicker/GetRandomColour';

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

interface HabitEditorProps {
    navigation: CreateNavProps;
    editHabit?: IHabit;
    gradient?: GradientType;
    icon?: Partial<IconProps>;
}

const HabitEditor: React.FC<HabitEditorProps> = ({ editHabit, navigation, gradient, icon }) => {
    const [habit, setHabit] = useState<IHabit>(editHabit ? editHabit : getDefaultHabit(gradient!));
    const [hours, setHours] = useState(Math.floor(habit.progressTotal / 3600));
    const [minutes, setMinutes] = useState(Math.floor((habit.progressTotal % 3600) / 60));

    useEffect(() => {
        navigation.setOptions({
            headerBackground: () => <HeaderBackground colour={habit.gradient} />,
        });
    }, [habit.gradient]);

    useEffect(() => {
        icon && setHabit({ ...habit, icon: icon });
    }, [icon]);

    const handleIconPress = () => {
        impactAsync(ImpactFeedbackStyle.Light);
        navigation.navigate('Icons');
    };

    const handleSchedulePress = (schedule: ScheduleType) => {
        impactAsync(ImpactFeedbackStyle.Light);
        setHabit({ ...habit, schedule: schedule });
    };

    const handleCountChange = () => {
        setHabit({ ...habit, type: 'count', progressTotal: 1 });
        setHours(0);
        setMinutes(1);
    };

    const handleTimeChange = () => {
        setHabit({ ...habit, type: 'timer', progressTotal: 60 });
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
                <Card title='Type' style={{ marginRight: 0 }}>
                    <View style={Row}>
                        <SqaureButton
                            colour={GradientColours[habit.gradient].solid}
                            grey={habit.type === 'timer'}
                            onPress={handleCountChange}>
                            <Icon
                                family='fontawesome'
                                name='plus'
                                size={24}
                                colour={
                                    habit.type === 'count'
                                        ? GradientColours[habit.gradient].solid
                                        : GreyColours.GREY2
                                }
                                style={{ zIndex: 1 }}
                            />
                        </SqaureButton>
                        <SqaureButton
                            colour={GradientColours[habit.gradient].solid}
                            grey={habit.type === 'count'}
                            onPress={handleTimeChange}>
                            <Icon
                                family='antdesign'
                                name='clockcircle'
                                size={24}
                                colour={
                                    habit.type === 'timer'
                                        ? GradientColours[habit.gradient].solid
                                        : GreyColours.GREY2
                                }
                                style={{ zIndex: 1 }}
                            />
                        </SqaureButton>
                    </View>
                </Card>
            </View>

            <Toast config={ToastConfig} ref={(ref) => Toast.setRef(ref)} />
        </KeyboardAwareScrollView>
    );
};

const scheduleFunctions = [EVERYDAY_SCHEDULE, WEEKDAY_SCHEDULE, WEEKEND_SCHEDULE];

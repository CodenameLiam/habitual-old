import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { getDefaultHabit, IHabit } from 'Controllers/HabitController';
import { GradientType, GreyColours } from 'Styles';
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
    // resetGradient?: boolean;
}

const HabitEditor: React.FC<HabitEditorProps> = ({ editHabit, navigation, gradient, icon }) => {
    const mountRef = useRef(false);
    const [habit, setHabit] = useState<IHabit>(editHabit ? editHabit : getDefaultHabit(gradient!));

    // const setIcon = (icon: Partial<IconProps>) => {
    //     setHabit({ ...habit, icon: { ...icon } });
    // };

    useEffect(() => {
        mountRef.current &&
            navigation.setOptions({
                headerBackground: () => <HeaderBackground colour={habit.gradient} />,
            });
        mountRef.current = true;
    }, [habit.gradient]);

    useEffect(() => {
        icon && setHabit({ ...habit, icon: icon });
    }, [icon]);

    const handleIconPress = () => {
        impactAsync(ImpactFeedbackStyle.Light);
        navigation.navigate('Icons');
    };

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{ flex: 1 }}
            scrollEnabled={false}
            extraScrollHeight={60}>
            <View style={{ flexDirection: 'row' }}>
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
            </View>

            <Toast config={ToastConfig} ref={(ref) => Toast.setRef(ref)} />
        </KeyboardAwareScrollView>
    );
};

// export default function CreateScreen({ navigation }: CreateProps) {
// 	return <HabitEdtor navigation={navigation} />;
// }

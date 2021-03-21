import styled from '@emotion/native';
import { AppContext } from 'Context';
import { IHabit } from 'Controllers/HabitController';
import { notificationAsync, NotificationFeedbackType } from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { EditNavProps } from 'Screens/Edit';
import { GradientColours } from 'Styles';
import { CreateNavProps } from '.';

interface SaveModuleProps {
    habit: IHabit;
    navigation: CreateNavProps | EditNavProps;
}

export const SaveModule: React.FC<SaveModuleProps> = ({ habit, navigation }) => {
    const { createHabit } = useContext(AppContext);

    const handleSave = async () => {
        if (habit.name === '') {
            Toast.show({
                type: 'error',
                text1: 'Please enter a name for your new habit',
                position: 'bottom',
                bottomOffset: 150,
            });
            notificationAsync(NotificationFeedbackType.Error);
        } else if (Object.values(habit.schedule).every((value) => value === false)) {
            Toast.show({
                type: 'error',
                text1: 'Please schedule your habit for at least one day',
                position: 'bottom',
                bottomOffset: 150,
            });
            notificationAsync(NotificationFeedbackType.Error);
        } else if (habit.progressTotal === 0) {
            Toast.show({
                type: 'error',
                text1: 'Please assign time to your habit',
                position: 'bottom',
                bottomOffset: 150,
            });
            notificationAsync(NotificationFeedbackType.Error);
        } else {
            navigation.goBack();
            notificationAsync(NotificationFeedbackType.Success);
            createHabit(habit);
        }
    };

    return (
        <SaveContainer>
            <SaveButton onPress={handleSave}>
                <LinearGradient
                    colors={[
                        GradientColours[habit.gradient].start,
                        GradientColours[habit.gradient].end,
                    ]}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                />

                <SaveText>Save</SaveText>
            </SaveButton>
        </SaveContainer>
    );
};

const SaveContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    margin: 10px;
`;

const SaveButton = styled(TouchableOpacity)`
    height: 60px;
    border-radius: 100px;
    overflow: hidden;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 10px;
`;

const SaveText = styled.Text`
    font-family: Montserrat_600SemiBold;
    font-size: 20px;
    color: ${(props) => props.theme.colors.text};
`;

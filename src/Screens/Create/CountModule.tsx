import Icon from 'Components/Icon';
import { IHabit } from 'Controllers/HabitController';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import React, { useRef } from 'react';
import { View } from 'react-native';
import { GradientColours, GreyColours } from 'Styles';
import { RowBetween, MarginLeft, MarginRight } from 'Styles/Globals';
import { ProgressTextInput, SqaureButton } from './CreateScreen.styles';

interface CountModuleProps {
    habit: IHabit;
    setHabit: React.Dispatch<React.SetStateAction<IHabit>>;
}

export const CountModule: React.FC<CountModuleProps> = ({ habit, setHabit }) => {
    const handleProgressChange = (text: string) => {
        setHabit({ ...habit, progressTotal: Number(text) });
    };

    const handleAddProgress = () => {
        impactAsync(ImpactFeedbackStyle.Light);
        setHabit({ ...habit, progressTotal: habit.progressTotal + 1 });
    };

    const handleRemoveProgress = () => {
        impactAsync(ImpactFeedbackStyle.Light);
        setHabit({ ...habit, progressTotal: habit.progressTotal - 1 });
    };

    return (
        <View style={RowBetween}>
            <ProgressTextInput
                returnKeyType='done'
                keyboardType='number-pad'
                colour={GradientColours[habit.gradient].solid}
                onChangeText={handleProgressChange}
                value={habit.progressTotal.toString()}
            />
            <SqaureButton
                colour={GradientColours[habit.gradient].solid}
                onPress={handleRemoveProgress}
                disabled={Number(habit.progressTotal) <= 1}
                grey={Number(habit.progressTotal) <= 1}
                style={[MarginLeft, MarginRight]}>
                <Icon
                    family='fontawesome'
                    name='minus'
                    size={24}
                    colour={
                        Number(habit.progressTotal) > 1
                            ? GradientColours[habit.gradient].solid
                            : GreyColours.GREY2
                    }
                />
            </SqaureButton>
            <SqaureButton
                onPress={handleAddProgress}
                colour={GradientColours[habit.gradient].solid}
                grey={false}>
                <Icon
                    family='fontawesome'
                    name='plus'
                    size={24}
                    colour={GradientColours[habit.gradient].solid}
                />
            </SqaureButton>
        </View>
    );
};

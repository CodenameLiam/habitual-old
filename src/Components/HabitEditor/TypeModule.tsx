import { Card } from 'Components/Card';
import { HabitType } from 'Components/Habit';
import Icon from 'Components/Icon';
import { IHabit } from 'Controllers/HabitController';
import React from 'react';
import { View } from 'react-native';
import { GradientColours, GreyColours } from 'Styles';
import { Row } from 'Styles/Globals';
import { SqaureButton } from '../../Screens/Create/CreateScreen.styles';

interface TypeModuleProps {
    habit: IHabit;
    setHabit: React.Dispatch<React.SetStateAction<IHabit>>;
    setHours: React.Dispatch<React.SetStateAction<number>>;
    setMinutes: React.Dispatch<React.SetStateAction<number>>;
}

export const TypeModule: React.FC<TypeModuleProps> = ({
    habit,
    setHabit,
    setHours,
    setMinutes,
}) => {
    const handleTypeChange = (type: HabitType) => {
        setHabit({ ...habit, type: type, progressTotal: type === 'timer' ? 60 : 1 });
        setHours(0);
        setMinutes(1);
    };

    return (
        <Card title='Type' style={{ marginRight: 0 }}>
            <View style={Row}>
                <SqaureButton
                    colour={GradientColours[habit.gradient].solid}
                    grey={habit.type === 'timer'}
                    onPress={() => handleTypeChange('count')}>
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
                    onPress={() => handleTypeChange('timer')}>
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
    );
};

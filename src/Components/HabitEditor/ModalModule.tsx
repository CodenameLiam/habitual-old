import styled from '@emotion/native';
import { IHabit } from 'Controllers/HabitController';
import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { TimeModal } from './TimeModule';

interface ModalModuleProps {
    habit: IHabit;
    setHabit: React.Dispatch<React.SetStateAction<IHabit>>;
    hours: number;
    setHours: React.Dispatch<React.SetStateAction<number>>;
    minutes: number;
    setMinutes: React.Dispatch<React.SetStateAction<number>>;
    timeRef: React.RefObject<BottomSheet>;
    handleTimeClose: () => void;
}

export const ModalModule: React.FC<ModalModuleProps> = ({
    habit,
    setHabit,
    hours,
    setHours,
    minutes,
    setMinutes,
    timeRef,
    handleTimeClose,
}) => {
    const shadowRef = useRef(new Animated.Value<number>(1)).current;

    const handleTimeChange = (values: { hours: number; minutes: number }) => {
        const { hours, minutes } = values;
        setHours(hours);
        setMinutes(minutes);
        setHabit({ ...habit, progressTotal: hours * 3600 + minutes * 60 });
    };

    return (
        <React.Fragment>
            <ShadowModal shadow={shadowRef} />
            <BottomSheet
                ref={timeRef}
                onCloseEnd={handleTimeClose}
                snapPoints={['100%', 0]}
                initialSnap={1}
                renderContent={() => (
                    <TimeModal
                        minutes={minutes}
                        hours={hours}
                        handleTimeChange={handleTimeChange}
                    />
                )}
                renderHeader={() => <HeaderModal sheetRef={timeRef} />}
                callbackNode={shadowRef}
            />
        </React.Fragment>
    );
};

interface ShadowModalProps {
    shadow: Animated.Value<number>;
}

const ShadowModalContainer = styled(Animated.View)`
    background-color: #000;
    z-index: 2;
`;

export const ShadowModal = ({ shadow }: ShadowModalProps) => {
    const animatedShadowOpacity = Animated.interpolate(shadow, {
        inputRange: [0, 1],
        outputRange: [0.5, 0],
    });

    return (
        <ShadowModalContainer
            pointerEvents='none'
            style={[StyleSheet.absoluteFill, { opacity: animatedShadowOpacity }]}
        />
    );
};

interface HeaderModalProps {
    sheetRef: React.RefObject<BottomSheet>;
}

const HeaderModalContainer = styled(TouchableWithoutFeedback)`
    justify-content: flex-end;
    height: 550px;
`;

const HeaderModalHeader = styled.View`
    height: 40px;
    padding-top: 10px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    background-color: ${(props) => props.theme.colors.card};
`;

const HeaderModalPanel = styled.View`
    align-items: center;
`;

const HeaderModalHandle = styled.View`
    width: 40px;
    height: 8px;
    border-radius: 4px;
    background-color: #00000040;
    margin-bottom: 10px;
`;

export const HeaderModal = ({ sheetRef }: HeaderModalProps) => {
    const closeSheet = () => {
        sheetRef.current && sheetRef.current.snapTo(1);
    };

    return (
        <HeaderModalContainer onPress={closeSheet}>
            <HeaderModalHeader>
                <HeaderModalPanel>
                    <HeaderModalHandle />
                </HeaderModalPanel>
            </HeaderModalHeader>
        </HeaderModalContainer>
    );
};

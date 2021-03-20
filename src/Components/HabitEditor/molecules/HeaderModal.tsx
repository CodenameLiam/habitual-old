import { useTheme } from '@react-navigation/native';
import React from 'react';
import { TouchableWithoutFeedback, StyleSheet, View } from 'react-native';
import { modalStyles } from '../HabitEditor.styles';
import BottomSheet from 'reanimated-bottom-sheet';

interface HeaderModalProps {
    sheetRef: React.RefObject<BottomSheet>;
    height: number;
}

export const HeaderModal = ({ sheetRef, height }: HeaderModalProps): JSX.Element => {
    const { colors } = useTheme();
    const closeSheet = (): void => {
        sheetRef.current && sheetRef.current.snapTo(1);
    };

    const headerBackground = { backgroundColor: colors.card };
    const headerStyles = StyleSheet.flatten([modalStyles.header, headerBackground]);

    return (
        <TouchableWithoutFeedback style={[modalStyles.headerTouchable, { height: height }]} onPress={closeSheet}>
            <View style={headerStyles}>
                <View style={modalStyles.panelHeader}>
                    <View style={modalStyles.panelHandle} />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

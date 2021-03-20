import React from 'react';
import Animated from 'react-native-reanimated';
import { modalStyles } from '../HabitEditor.styles';

interface ShadowModalProps {
    shadow: Animated.Value<number>;
}

export const ShadowModal: React.FC<ShadowModalProps> = ({ shadow }) => {
    const animatedShadowOpacity = Animated.interpolate(shadow, {
        inputRange: [0, 1],
        outputRange: [0.5, 0],
    });

    return (
        <Animated.View
            pointerEvents="none"
            style={[
                modalStyles.shadowContainer,
                {
                    opacity: animatedShadowOpacity,
                },
            ]}
        />
    );
};

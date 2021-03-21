// DismissableFlatList.js

import React, { useState, useEffect, useRef } from 'react';

import { GestureHandlerRefContext } from '@react-navigation/stack';
import {
    ScrollView,
    NativeViewGestureHandlerProperties,
} from 'react-native-gesture-handler';
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { IconNavProps } from 'Screens/Icons';

const DEFAULT_GESTURE_RESPONSE = 135;
interface DismissableScrollViewProps {
    children?: React.ReactNode;
    scrollProps?: NativeViewGestureHandlerProperties;
    navigation: IconNavProps;
}

const DismissableScrollView: React.FC<DismissableScrollViewProps> = ({
    children,
    scrollProps,
    navigation,
}) => {
    const [scrolledTop, setScrolledTop] = useState(true);
    const mountRef = useRef(false);

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
        const scrolledTop = event.nativeEvent.contentOffset.y <= 0;
        setScrolledTop(scrolledTop);
    };

    useEffect(() => {
        if (mountRef.current) {
            navigation.setOptions({
                gestureResponseDistance: {
                    vertical: scrolledTop
                        ? Dimensions.get('screen').height
                        : DEFAULT_GESTURE_RESPONSE,
                },
            });
        } else {
            mountRef.current = true;
        }
    }, [scrolledTop]);

    return (
        <GestureHandlerRefContext.Consumer>
            {(ref) => (
                <ScrollView
                    waitFor={scrolledTop ? ref : undefined}
                    onScroll={onScroll}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={false}
                    {...scrollProps}
                >
                    {children}
                </ScrollView>
            )}
        </GestureHandlerRefContext.Consumer>
    );
};

export default DismissableScrollView;

// DismissableFlatList.js

import React, { useState, useCallback, useEffect, useRef } from 'react';

import { GestureHandlerRefContext } from '@react-navigation/stack';
import {
    ScrollView,
    NativeViewGestureHandlerProperties,
    TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { EditNavProps } from 'Screens/Edit';
import { IconNavProps } from 'Screens/Icons';

const DEFAULT_GESTURE_RESPONSE = 135;
interface DismissableScrollViewProps {
    children?: React.ReactNode;
    scrollProps?: NativeViewGestureHandlerProperties;
    navigation: IconNavProps;
}

const DismissableScrollView = ({
    children,
    scrollProps,
    navigation,
}: DismissableScrollViewProps) => {
    const [scrolledTop, setScrolledTop] = useState(true);
    const mountRef = useRef(false);

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
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
                    {...scrollProps}>
                    {children}
                </ScrollView>
            )}
        </GestureHandlerRefContext.Consumer>
    );
};

export default DismissableScrollView;

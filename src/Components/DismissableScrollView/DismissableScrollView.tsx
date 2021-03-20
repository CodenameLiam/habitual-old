import React, { useState, useCallback } from 'react';

import { GestureHandlerRefContext } from '@react-navigation/stack';
import { ScrollView, NativeViewGestureHandlerProperties } from 'react-native-gesture-handler';

interface DismissableScrollViewProps {
	children?: React.ReactNode;
	scrollProps?: NativeViewGestureHandlerProperties;
}

const DismissableScrollView: React.FC<DismissableScrollViewProps> = ({ children, scrollProps }) => {
    const [scrolledTop, setScrolledTop] = useState(true);
    const onScroll = useCallback(({ nativeEvent }) => {
        const scrolledTop = nativeEvent.contentOffset.y <= 0;
        setScrolledTop(scrolledTop);
    }, []);

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

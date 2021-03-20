import styled from '@emotion/native';
import React from 'react';
import { View, Text } from 'react-native';
import { BaseToastProps } from 'react-native-toast-message';
import { GradientColours } from 'Styles';

interface ToastContainerProps {
    background: string;
}

const ToastContainer = styled.View<ToastContainerProps>`
    height: 40px;
    width: 90%;
    border-radius: 6px;
    background-color: ${(props) => props.background};
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

const ToastText = styled.Text`
    font-family: 'Montserrat_600SemiBold';
    color: ${(props) => props.theme.colors.text};
`;

export const ToastConfig = {
    error: ({ text1, ...rest }: BaseToastProps) => (
        <ToastContainer background={GradientColours.RED.solid}>
            <ToastText>{text1}</ToastText>
        </ToastContainer>
    ),
};

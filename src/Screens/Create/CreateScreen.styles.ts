import styled from '@emotion/native';
import { TextInput, TouchableOpacity } from 'react-native';
import { GreyColours } from 'Styles';

interface InputProps {
    gradient: string;
}

export const Input = styled(TextInput)<InputProps>`
    flex: 1;
    color: ${(props) => props.gradient};
    font-family: Montserrat_600SemiBold;
    font-size: 18px;
`;

interface ButtonProps {
    colour: string;
    grey: boolean;
}

export const SqaureButton = styled(TouchableOpacity)<ButtonProps>`
    background-color: ${(props) => (props.grey ? GreyColours.GREY2 + 50 : props.colour + 50)};
    margin-right: 10px;
    border-radius: 5px;
    overflow: hidden;
    height: 45px;
    width: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

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

interface ProgressInputProps {
    colour: string;
}

export const ProgressTextInput = styled(TextInput)<ProgressInputProps>`
    color: ${(props) => props.colour};
    background-color: ${(props) => props.theme.colors.background};
    flex: 1;
    border-radius: 5px;
    text-align: center;
    font-family: Montserrat_800ExtraBold;
    font-size: 20px;
`;

export const ProgressText = styled.Text<ProgressInputProps>`
    color: ${(props) => props.colour};
    text-align: center;
    font-family: Montserrat_800ExtraBold;
    font-size: 20px;
`;

export const ProgressTimeInput = styled(TouchableOpacity)`
    flex: 1;
    background-color: ${(props) => props.theme.colors.background};
    border-radius: 5px;
    display: flex;
    justify-content: center;
`;

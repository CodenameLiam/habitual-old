import styled from '@emotion/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export const Container = styled.View`
    background-color: ${(props) => props.theme.colors.background};
    padding-bottom: 50px;
    align-items: center;
`;

export const LabelContainer = styled.View`
    flex-direction: row;
    margin-top: 25px;
    margin-bottom: 10px;
    margin-left: 10px;
`;

export const Label = styled.Text`
    padding: 10px;
    background-color: ${(props) => props.theme.colors.card};
    color: ${(props) => props.theme.colors.text};
    font-size: 16px;
    font-family: Montserrat_700Bold;
    border-radius: 10px;
    overflow: hidden;
`;

export const Row = styled.View`
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`;

export const IconContainer = styled(TouchableOpacity)`
    padding: 12px;

    display: flex;
    align-items: center;
`;

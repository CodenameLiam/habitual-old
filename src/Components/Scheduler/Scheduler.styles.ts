import styled from '@emotion/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GreyColours } from 'Styles';

export const Container = styled.View`
    flex-direction: row;
    justify-content: space-between;
    padding: 5px;
    padding-bottom: 15px;
`;

interface ScheduleButtonProps {
    dimensions: number;
}

export const ScheduleButton = styled(TouchableOpacity)<ScheduleButtonProps>`
    background-color: ${(props) => props.theme.colors.background};
    height: ${(props) => props.dimensions + 'px'};
    width: ${(props) => props.dimensions + 'px'};
    border-radius: ${(props) => props.dimensions + 'px'};
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
`;

interface ScheduleTextProps {
    grey: boolean;
}

export const ScheduleText = styled.Text<ScheduleTextProps>`
    font-family: 'Montserrat_600SemiBold';
    font-size: 16px;
    color: ${(props) => (props.grey ? GreyColours.GREY2 : '#ffffff')};
`;

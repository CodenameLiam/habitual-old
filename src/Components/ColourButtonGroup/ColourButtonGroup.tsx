import React from 'react';
import { GreyColours } from 'Styles/Colours';
import { ButtonContainer, Container, TextContainer, TextContent } from './ColourButtonGroup.styles';

interface ColouredButtonGroupProps {
    colour: string;
    buttons: string[];
    activeTitle?: string;
    buttonFunctions: (() => void)[];
}

export const ColourButtonGroup: React.FC<ColouredButtonGroupProps> = ({
    buttons,
    buttonFunctions,
    colour,
    activeTitle,
}) => {
    const width = 95 / buttons.length;

    const getColour = (title: string): string => {
        if (activeTitle !== undefined) {
            return title === activeTitle ? colour : GreyColours.GREY2;
        } else {
            return colour;
        }
    };

    return (
        <Container>
            {buttons.length === buttonFunctions.length &&
                buttons.map((title, index) => (
                    <ButtonContainer
                        key={index + title}
                        width={width}
                        backgroundColour={getColour(title)}>
                        <TextContainer onPress={buttonFunctions[index]}>
                            <TextContent colour={getColour(title)}>{title}</TextContent>
                        </TextContainer>
                    </ButtonContainer>
                ))}
        </Container>
    );
};

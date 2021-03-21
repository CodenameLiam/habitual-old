import styled from '@emotion/native';
import { RouteProp, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DismissableScrollView from 'Components/DismissableScrollView/DismissableScrollView';
import Icon, { IconProps } from 'Components/Icon';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { AppStackParamList } from 'Navigation';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, InteractionManager } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Container, IconContainer, Label, LabelContainer, Row } from './IconScreen.styles';

export type IconNavProps = StackNavigationProp<AppStackParamList, 'Icons'>;

interface IconScreenProps {
    navigation: IconNavProps;
}

const IconScreen: React.FC<IconScreenProps> = ({ navigation }) => {
    const { colors } = useTheme();

    const [isReady, setIsReady] = useState(false);
    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            setIsReady(true);
        });
    }, []);

    const handlePress = (icon: Partial<IconProps>) => {
        navigation.navigate('Create', { icon: icon });
        impactAsync(ImpactFeedbackStyle.Light);
    };

    return (
        <DismissableScrollView navigation={navigation}>
            <Container>
                {IconOptions.map((group, index) => (
                    <View key={group.label}>
                        <LabelContainer>
                            <Label style={{ overflow: 'hidden', borderRadius: 10 }}>
                                {group.label}
                            </Label>
                        </LabelContainer>
                        {((!isReady && index < 2) || isReady) && (
                            <Row>
                                {group.icons.map((icon, index) => (
                                    <IconContainer
                                        key={index + icon.name}
                                        onPress={() => handlePress(icon)}>
                                        <Icon
                                            family={icon.family}
                                            name={icon.name}
                                            colour={colors.text}
                                            size={34}
                                        />
                                    </IconContainer>
                                ))}
                            </Row>
                        )}
                    </View>
                ))}
            </Container>
        </DismissableScrollView>
    );
};

export default IconScreen;

interface IconGroup {
    label: string;
    icons: Partial<IconProps>[];
}

const IconOptions: IconGroup[] = [
    {
        label: 'Sport',
        icons: [
            { family: 'materialcommunity', name: 'soccer' },
            { family: 'materialcommunity', name: 'volleyball' },
            { family: 'materialcommunity', name: 'basketball' },
            { family: 'materialcommunity', name: 'baseball' },
            { family: 'materialcommunity', name: 'tennis-ball' },
            { family: 'materialcommunity', name: 'billiards' },
            { family: 'materialcommunity', name: 'bowling' },
            { family: 'materialcommunity', name: 'bullseye-arrow' },
            { family: 'materialcommunity', name: 'rugby' },
            { family: 'materialcommunity', name: 'football-helmet' },
            { family: 'materialcommunity', name: 'boxing-glove' },
            { family: 'materialcommunity', name: 'basketball-hoop' },
            { family: 'materialcommunity', name: 'baseball-bat' },
            { family: 'materialcommunity', name: 'tennis' },
            { family: 'materialcommunity', name: 'table-tennis' },
            { family: 'materialcommunity', name: 'golf' },
            { family: 'materialcommunity', name: 'hockey-sticks' },
            { family: 'materialcommunity', name: 'dumbbell' },
            { family: 'materialcommunity', name: 'weight-lifter' },
            { family: 'materialcommunity', name: 'walk' },
            { family: 'materialcommunity', name: 'run' },
            { family: 'materialcommunity', name: 'ski-cross-country' },
            { family: 'materialcommunity', name: 'ski' },
            { family: 'materialcommunity', name: 'ski-water' },
            { family: 'materialcommunity', name: 'swim' },
            { family: 'materialcommunity', name: 'bike' },
            { family: 'materialcommunity', name: 'rowing' },
            { family: 'materialcommunity', name: 'karate' },
            { family: 'materialcommunity', name: 'yoga' },
            { family: 'materialcommunity', name: 'meditation' },
        ],
    },
    {
        label: 'Art',
        icons: [
            { family: 'materialcommunity', name: 'brush' },
            { family: 'materialcommunity', name: 'pencil' },
            { family: 'materialcommunity', name: 'fountain-pen-tip' },
            { family: 'materialcommunity', name: 'palette' },
            { family: 'materialcommunity', name: 'spray' },
            { family: 'materialcommunity', name: 'drama-masks' },
            { family: 'materialcommunity', name: 'piano' },
            { family: 'materialcommunity', name: 'microphone-variant' },
            { family: 'materialcommunity', name: 'saxophone' },
            { family: 'materialcommunity', name: 'violin' },
            { family: 'materialcommunity', name: 'guitar-acoustic' },
            { family: 'materialcommunity', name: 'guitar-electric' },
            { family: 'materialcommunity', name: 'trumpet' },
            { family: 'materialcommunity', name: 'instrument-triangle' },
            { family: 'materialcommunity', name: 'album' },
            { family: 'materialcommunity', name: 'movie-roll' },
            { family: 'materialcommunity', name: 'movie-open' },
            { family: 'materialcommunity', name: 'camera' },
            { family: 'materialcommunity', name: 'music' },
            { family: 'materialcommunity', name: 'music-clef-treble' },
            { family: 'materialcommunity', name: 'music-clef-bass' },
        ],
    },
    {
        label: 'Lifestyle',
        icons: [
            { family: 'materialcommunity', name: 'book-open-variant' },
            { family: 'materialcommunity', name: 'school' },
            { family: 'materialcommunity', name: 'brain' },
            { family: 'materialcommunity', name: 'sleep' },
            { family: 'materialcommunity', name: 'bed' },
            { family: 'materialcommunity', name: 'shower' },
            { family: 'materialcommunity', name: 'chef-hat' },
            { family: 'materialcommunity', name: 'watering-can' },
            { family: 'materialcommunity', name: 'hanger' },
            { family: 'materialcommunity', name: 'hammer-wrench' },
            { family: 'materialcommunity', name: 'broom' },
            { family: 'materialcommunity', name: 'toothbrush' },
            { family: 'materialcommunity', name: 'trash-can' },
            { family: 'materialcommunity', name: 'washing-machine' },
            { family: 'materialcommunity', name: 'dog-service' },
            { family: 'materialcommunity', name: 'pill' },
            { family: 'materialcommunity', name: 'needle' },
            { family: 'materialcommunity', name: 'hospital-box' },
            { family: 'materialcommunity', name: 'cellphone' },
            { family: 'materialcommunity', name: 'television-classic' },
            { family: 'materialcommunity', name: 'laptop' },
            { family: 'materialcommunity', name: 'desktop-classic' },
            { family: 'materialcommunity', name: 'gamepad-variant' },
            { family: 'materialcommunity', name: 'headphones' },
            { family: 'materialcommunity', name: 'newspaper' },
            { family: 'materialcommunity', name: 'cash-multiple' },
            { family: 'materialcommunity', name: 'tent' },
            { family: 'materialcommunity', name: 'image-filter-hdr' },
        ],
    },
    {
        label: 'Emoticons',
        icons: [
            { family: 'materialcommunity', name: 'emoticon' },
            { family: 'materialcommunity', name: 'emoticon-angry' },
            { family: 'materialcommunity', name: 'emoticon-confused' },
            { family: 'materialcommunity', name: 'emoticon-cool' },
            { family: 'materialcommunity', name: 'emoticon-cry' },
            { family: 'materialcommunity', name: 'emoticon-excited' },
            { family: 'materialcommunity', name: 'emoticon-frown' },
            { family: 'materialcommunity', name: 'emoticon-happy' },
            { family: 'materialcommunity', name: 'emoticon-kiss' },
            { family: 'materialcommunity', name: 'emoticon-lol' },
            { family: 'materialcommunity', name: 'emoticon-neutral' },
            { family: 'materialcommunity', name: 'emoticon-sad' },
            { family: 'materialcommunity', name: 'emoticon-tongue' },
            { family: 'materialcommunity', name: 'emoticon-wink' },
            { family: 'materialcommunity', name: 'emoticon-poop' },
        ],
    },
    {
        label: 'Food',
        icons: [
            { family: 'materialcommunity', name: 'food-apple' },
            { family: 'materialcommunity', name: 'fruit-cherries' },
            { family: 'materialcommunity', name: 'fruit-grapes' },
            { family: 'materialcommunity', name: 'fruit-pineapple' },
            { family: 'materialcommunity', name: 'fruit-watermelon' },
            { family: 'materialcommunity', name: 'food-croissant' },
            { family: 'materialcommunity', name: 'baguette' },
            { family: 'materialcommunity', name: 'cheese' },
            { family: 'materialcommunity', name: 'food-drumstick' },
            { family: 'materialcommunity', name: 'food-steak' },
            { family: 'materialcommunity', name: 'food' },
            { family: 'materialcommunity', name: 'food-variant' },
            { family: 'materialcommunity', name: 'noodles' },
            { family: 'materialcommunity', name: 'pasta' },
            { family: 'materialcommunity', name: 'hamburger' },
            { family: 'materialcommunity', name: 'cupcake' },
            { family: 'materialcommunity', name: 'coffee' },
            { family: 'materialcommunity', name: 'beer' },
        ],
    },
    {
        label: 'Social',
        icons: [
            { family: 'materialcommunity', name: 'facebook' },
            { family: 'materialcommunity', name: 'facebook-messenger' },
            { family: 'materialcommunity', name: 'instagram' },
            { family: 'materialcommunity', name: 'youtube' },
            { family: 'materialcommunity', name: 'linkedin' },
            { family: 'materialcommunity', name: 'twitch' },
            { family: 'materialcommunity', name: 'twitter' },
            { family: 'materialcommunity', name: 'reddit' },
            { family: 'materialcommunity', name: 'steam' },
            { family: 'materialcommunity', name: 'microsoft-xbox' },
            { family: 'materialcommunity', name: 'sony-playstation' },
            { family: 'materialcommunity', name: 'snapchat' },
        ],
    },
    {
        label: 'Miscellaneous',
        icons: [
            { family: 'materialcommunity', name: 'one-up' },
            { family: 'materialcommunity', name: 'atom' },
            { family: 'materialcommunity', name: 'rocket' },
            { family: 'materialcommunity', name: 'atom-variant' },
            { family: 'materialcommunity', name: 'medal' },
            { family: 'materialcommunity', name: 'trophy' },
            { family: 'materialcommunity', name: 'moon-waning-crescent' },
            { family: 'materialcommunity', name: 'star' },
            { family: 'materialcommunity', name: 'death-star-variant' },
            { family: 'materialcommunity', name: 'white-balance-sunny' },
            { family: 'materialcommunity', name: 'heart' },
            { family: 'materialcommunity', name: 'hand-heart' },
            { family: 'materialcommunity', name: 'account-heart' },
            { family: 'materialcommunity', name: 'cards' },
            { family: 'materialcommunity', name: 'cards-club' },
            { family: 'materialcommunity', name: 'cards-diamond' },
            { family: 'materialcommunity', name: 'cards-spade' },
        ],
    },
];

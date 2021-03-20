import { useTheme } from '@react-navigation/native';
import Icon, { IconProps } from 'Components/Icon';
import React from 'react';
import { Dimensions, View, Text } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { IconOptions } from './IconOptions';

interface IconModalProps {
    setIcon: React.Dispatch<React.SetStateAction<Partial<IconProps>>>;
    closeSheet: () => void;
}

export const IconModal: React.FC<IconModalProps> = ({ setIcon, closeSheet }) => {
    const { colors } = useTheme();
    const iconWidth = Dimensions.get('screen').width / 6.6;

    const handlePress = (icon: Partial<IconProps>): void => {
        setIcon(icon);
        closeSheet();
    };

    return (
        <ScrollView
            style={{
                backgroundColor: colors.card,
                padding: 16,

                height: '100%',
            }}
            showsVerticalScrollIndicator={false}
        >
            <View style={{ paddingBottom: 50 }}>
                {IconOptions.map((group, index) => (
                    <View key={group.label}>
                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: index === 0 ? 0 : 20,
                                marginBottom: 5,
                                marginLeft: 10,
                            }}
                        >
                            <Text
                                style={{
                                    padding: 10,
                                    backgroundColor: colors.background,
                                    color: colors.text,
                                    fontSize: 16,
                                    fontFamily: 'Montserrat_700Bold',
                                    borderRadius: 10,
                                    overflow: 'hidden',
                                }}
                            >
                                {group.label}
                            </Text>
                        </View>

                        <View
                            style={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                            }}
                        >
                            {group.icons.map((icon, index) => (
                                <TouchableOpacity
                                    key={index + icon.name}
                                    onPress={() => handlePress(icon)}
                                    style={{
                                        padding: 10,
                                        width: iconWidth,
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Icon family={icon.family} name={icon.name} colour={colors.text} size={30} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

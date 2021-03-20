import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { GradientColours, GradientType } from 'Styles/Colours';

interface ColourPickerProps {
	updateGradient: (gradient: GradientType) => void;
}

export const ColourPicker: React.FC<ColourPickerProps> = ({ updateGradient }) => {
    const colourPickerDimensions = Dimensions.get('screen').width / 8.5;

    const gradientValues = Object.keys(GradientColours);
    const halfGradientValues = Math.floor(gradientValues.length / 2);
    const firstColours = gradientValues.slice(0, halfGradientValues);
    const lastColours = gradientValues.slice(halfGradientValues, gradientValues.length);
    const combinedColours = [firstColours, lastColours];

    const styles = StyleSheet.create({
        container: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center'
        },
        gradient: {
            flex: 1
        },
        swatch: {
            borderRadius: colourPickerDimensions,
            height: colourPickerDimensions,
            margin: 5,
            overflow: 'hidden',
            width: colourPickerDimensions
        }
    });

    const handlePress = (gradient: GradientType): void => {
        updateGradient(gradient);
        impactAsync(ImpactFeedbackStyle.Light);
    };

    return (
        <View>
            {combinedColours.map((half, index) => (
                <View key={`Half${index}`} style={styles.container}>
                    {half.map((gradient, index) => (
                        <TouchableOpacity
                            key={index + gradient}
                            onPress={() => handlePress(gradient as GradientType)}
                            style={styles.swatch}>
                            <LinearGradient
                                colors={[
								  GradientColours[gradient as GradientType].start,
								  GradientColours[gradient as GradientType].end
                                ]}
                                style={styles.gradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            ))}
        </View>
    );
};

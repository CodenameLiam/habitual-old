"use strict";
exports.__esModule = true;
exports.ColourPicker = void 0;
var expo_haptics_1 = require("expo-haptics");
var expo_linear_gradient_1 = require("expo-linear-gradient");
var react_1 = require("react");
var react_native_1 = require("react-native");
var Colours_1 = require("Styles/Colours");
exports.ColourPicker = function (_a) {
    var updateGradient = _a.updateGradient;
    var colourPickerDimensions = react_native_1.Dimensions.get('screen').width / 8.5;
    var gradientValues = Object.keys(Colours_1.GradientColours);
    var halfGradientValues = Math.floor(gradientValues.length / 2);
    var firstColours = gradientValues.slice(0, halfGradientValues);
    var lastColours = gradientValues.slice(halfGradientValues, gradientValues.length);
    var combinedColours = [firstColours, lastColours];
    var styles = react_native_1.StyleSheet.create({
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
    var handlePress = function (gradient) {
        updateGradient(gradient);
        expo_haptics_1.impactAsync(expo_haptics_1.ImpactFeedbackStyle.Light);
    };
    return (react_1["default"].createElement(react_native_1.View, null, combinedColours.map(function (half, index) { return (react_1["default"].createElement(react_native_1.View, { key: "Half" + index, style: styles.container }, half.map(function (gradient, index) { return (react_1["default"].createElement(react_native_1.TouchableOpacity, { key: index + gradient, onPress: function () { return handlePress(gradient); }, style: styles.swatch },
        react_1["default"].createElement(expo_linear_gradient_1.LinearGradient, { colors: [
                Colours_1.GradientColours[gradient].start,
                Colours_1.GradientColours[gradient].end
            ], style: styles.gradient, start: { x: 0, y: 0 }, end: { x: 1, y: 0 } }))); }))); })));
};

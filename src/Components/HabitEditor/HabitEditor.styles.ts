import { StyleSheet } from 'react-native';

export const modalStyles = StyleSheet.create({
    header: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 40,
        paddingTop: 10,
        shadowColor: '#000000',
    },
    headerTouchable: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    panelHandle: {
        backgroundColor: '#00000040',
        borderRadius: 4,
        height: 8,
        marginBottom: 10,
        width: 40,
    },
    panelHeader: {
        alignItems: 'center',
    },
    shadowContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
        zIndex: 2,
    },
});

export const globalStyles = StyleSheet.create({
    cardText: {
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 18,
    },
    count: {
        alignItems: 'center',
        borderRadius: 5,
        height: 45,
        justifyContent: 'center',
        overflow: 'hidden',
        width: 45,
    },

    gradient: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    type: {
        alignItems: 'center',
        borderRadius: 5,
        display: 'flex',
        height: 45,
        justifyContent: 'center',
        overflow: 'hidden',
        width: 45,
    },
});

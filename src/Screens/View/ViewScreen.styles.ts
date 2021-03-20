import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    count: {
        alignItems: 'center',
        borderRadius: 5,
        height: 45,
        justifyContent: 'center',
        overflow: 'hidden',
        width: 45
    },
    statBar: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        top: 0,
        width: 10
    },
    statCard: {
        alignItems: 'center',
        flex: 1,
        marginRight: 0,
        overflow: 'hidden'
    },
    statIconContainer: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        padding: 5
    },
    statIconText: {
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 30,
        paddingLeft: 15,
        textAlign: 'center'
    }

    // paragraph: {
    // 	margin: 24,
    // 	fontSize: 18,
    // 	fontWeight: 'bold',
    // 	textAlign: 'center',
    // },
    // scrollView: {
    // 	height: '20%',
    // 	width: '80%',
    // 	margin: 20,
    // 	alignSelf: 'center',
    // 	padding: 20,
    // 	borderWidth: 5,
    // 	borderRadius: 5,
    // 	borderColor: 'black',
    // 	backgroundColor: 'lightblue',
    // },
    // contentContainer: {
    // 	justifyContent: 'center',
    // 	alignItems: 'center',
    // 	backgroundColor: 'lightgrey',
    // 	paddingBottom: 50,
    // },
});
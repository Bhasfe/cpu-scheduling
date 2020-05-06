import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import Colors from '../constants/Colors';

const AlgorithmsList = props => {
    return(
        <TouchableOpacity onPress={props.onPress}>
            <View syle={styles.container}>
                <View style={styles.gridItem} >
                    <Text style={styles.title}>{props.name}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        margin : 10,
        elevation : 3,
    },
    gridItem : {
        //flex: 1,
        width : '95%',
        height : 100,
        backgroundColor : Colors.primaryColor,
        margin : 10,
        justifyContent : 'center',
        alignItems : 'center',
        borderRadius : 25,

        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,

    },
    title : {
        fontFamily : 'open-sans',
        fontSize : 20,
        color : 'white',
    }

});

export default AlgorithmsList;
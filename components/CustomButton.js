import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const CustomButton = props => {
    return (
        <TouchableOpacity onPress={props.onPress} activeOpacity={1}>
            <View style={{...styles.button,...props.style}}>
                <Text style={styles.title}>{props.title}</Text>
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    button: {
        width : 110,
        height: 35,
        borderColor : 'black',
        borderRadius : 15,
        justifyContent :'center',
        alignItems : 'center',
        backgroundColor : Colors.backgroundColor,
        marginHorizontal : 1,
        elevation : 5,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 10,
        
    },
    title : {
        fontFamily : 'open-sans',
        color: 'white'
    }
});

export default CustomButton;
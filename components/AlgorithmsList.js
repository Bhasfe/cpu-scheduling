import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet ,Image, Dimensions} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';

import {icons} from '../assets/icons'
import Colors from '../constants/Colors';

const WIDTH = Dimensions.get('window').width

const AlgorithmsList = props => {
   
    return(
        <TouchableOpacity onPress={props.onPress} style={styles.container}>
            <View style={styles.gridItem} >
                <Image 
                    style={styles.icon}
                    resizeMode="contain"
                    source = {icons[props.shortName]}
                />
                <Text style={styles.title}>{props.name}</Text>
                <View style={styles.bgBubble}></View>
            </View>
        </TouchableOpacity>
    );
}
/*renderItem={({item}) => {
    return (
        
    )
}}*/
const styles = StyleSheet.create({
    container : {
        flex: 1,
        width: (WIDTH/2)-40,
        margin:10,
    
    },
    gridItem : {
        flex: 1,
        backgroundColor : Colors.primaryColor,
        justifyContent : 'center',
        alignItems : 'center',
        borderRadius : 25,
       

    },
    title : {
        fontFamily : 'open-sans',
        fontSize : 14,
        textAlign:'center',
        padding:10,
        position:'absolute',
        bottom:10,
        zIndex:3,
        color : '#fff',
    },
    icon : {
        width:100,
        height:80,
        position:'absolute',
        zIndex:2,
        top:20,
    },
    bgBubble:{
        position:'absolute',
        width:'100%',
        height:80,
        borderTopRightRadius:170,
        borderTopLeftRadius:170,
        zIndex:0,
        bottom:0,
        borderBottomRightRadius:25,
        borderBottomLeftRadius:25,
        backgroundColor: '#E58769'
    }

});

export default AlgorithmsList;
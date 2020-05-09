import React from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';

import { ALGORITHMS } from '../data/algorithms-data';
import AlgorithmsList from '../components/AlgorithmsList';

import Colors from '../constants/Colors';

const AlgorithmsScreen = props => {

    const renderAlgorithms = itemData => {
        return (
            <AlgorithmsList
                onPress = {() => props.navigation.navigate({ routeName: 'Simulator' , params : {algorithmId : itemData.item.id}})}
                name={itemData.item.name}
                shortName={itemData.item.shortName}
            />
        );
    }

    return (
        <View style={styles.redBg}>
           <View style={styles.screen}>
            <View style={styles.description}>
                <Text style={{color: Colors.light}}>What it is exactly? Briefly, it helps you to understand how cpu scheduling works, end of the story.</Text>
                <Text style={{color: Colors.light}}>You may start with selecting an algorithm.</Text>
            </View>
            <View style={styles.flatContainer}>
                <FlatList
                        data={ALGORITHMS}
                        keyExtractor={(item, id) => item.id}
                        renderItem={renderAlgorithms}
                        style= {styles.flatList}
                        numColumns={2}
                    />
            </View>
           </View>
        </View>
    );
};

AlgorithmsScreen.navigationOptions = navigationData => {
    return ({
        headerShown : true
    })
}

const styles = StyleSheet.create({
    description:{
        flex:1,
        paddingLeft:20,
        paddingTop:20,
        paddingRight:20,
    },
    redBg:{
        backgroundColor: Colors.red,
        flex:1
    },
    screen: {
        backgroundColor:Colors.screen,
        borderTopRightRadius:40,
        borderTopLeftRadius:40,
        marginTop:20,
        flex:1
    },
    flatContainer: {
        flex: 5,
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexDirection:'row',
    },
    flatList: {
        flexDirection:'column'
    }
});

export default AlgorithmsScreen;
import React from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';

import { ALGORITHMS } from '../data/algorithms-data';
import AlgorithmsList from '../components/AlgorithmsList';


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
        <View style={styles.screen}>
            <FlatList
                data={ALGORITHMS}
                keyExtractor={(item, id) => item.id}
                renderItem={renderAlgorithms}
                style= {styles.flatList}
                numColumns={2}
            />
        </View>
    );
};

AlgorithmsScreen.navigationOptions = navigationData => {
    return ({
        headerShown : true
    })
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection:'row',
    },
    flatList: {
        flexDirection:'column'
    }
});

export default AlgorithmsScreen;
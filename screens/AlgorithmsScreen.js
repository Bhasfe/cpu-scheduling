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
            />
        );
    }

    return (
        <View style={styles.screen}>
            <FlatList
                data={ALGORITHMS}
                keyExtractor={(item, id) => item.id}
                renderItem={renderAlgorithms}
                style = {{width : '100%'}}
            // numColumns = {2}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding : 10
    },
});

export default AlgorithmsScreen;
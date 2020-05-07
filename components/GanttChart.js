import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { SJF , FCFS } from '../data/functions';

const renderSections = itemData => {
    return (
        <View style={{ ...styles.section, flex: itemData.item.cpuBurstTime1 }}>
            <View >
                <Text>{itemData.item.name}</Text>
            </View>
        </View>
    );
};

const renderTags = itemData => {
    return (
        <View style={{ ...styles.tag, flex: itemData.item.cpuBurstTime1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%' }}>
                {itemData.index === 0 ? <Text>{itemData.item.start}</Text> : <></>}
                <View style={{ marginLeft: 12, width: '100%', flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Text>{itemData.item.finish}</Text>
                </View>
            </View>
        </View>
    );
};

const renderCalculations = (itemData) => {
    if (itemData.item.name != 'idle') {
        return (
            <View style={styles.calculations}>
                <View>
                    <Text>wat({itemData.item.name}) = {itemData.item.wat}</Text>
                </View>
                <View>
                    <Text>tat({itemData.item.name}) = {itemData.item.tat}</Text>
                </View>
            </View>
        );
    }
    return null;
}

const GanttChart = props => {

    var processesCopy = [...props.processesList];
    var [finalExecution, averageWait] = [0, 0];

    console.log(props.selectedAlgorithm.functionName);
    switch (props.selectedAlgorithm.functionName) {
        case 'SJF':
            [finalExecution, averageWait] = SJF(processesCopy);
            break;
        case 'FCFS' :
            [finalExecution, averageWait] = FCFS(processesCopy);
    }

    return (
        <View style={styles.chart}>
            <FlatList
                style={styles.chart}
                keyExtractor={(item, id) => item.name}
                data={finalExecution}
                renderItem={renderSections}
                numColumns={finalExecution.length}
            />
            <FlatList
                keyExtractor={(item, id) => item.name}
                data={finalExecution}
                renderItem={renderTags}
                numColumns={finalExecution.length}
            />

            <FlatList
                keyExtractor={(item, id) => item.name}
                data={finalExecution}
                renderItem={renderCalculations}
                numColumns={finalExecution.length}
            />

            <View style={{ alignItems: 'center', marginBottom: 10 }}>
                <Text>Average waiting time = {averageWait}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    chart: {
        width: '100%',
        padding: 10,
        borderColor: '#7D7D7D',
    },
    section: {
        backgroundColor: '#ccc',
        borderColor: '#7D7D7D',
        borderWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    tag: {
        width: '100%',
        fontSize: 4,
        paddingHorizontal: 10,
    },
    calculations: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        borderColor: '#7D7D7D',
        borderWidth: 1,
    }

});

export default GanttChart;
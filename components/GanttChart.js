import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Dimensions } from 'react-native';
import { SJF, FCFS, SRTF, RR } from '../data/functions';

const windowWidth = Dimensions.get('window').width;

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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                {itemData.index === 0 ? <Text>{itemData.item.start}</Text> : <Text></Text>}
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Text>{itemData.item.finish}</Text>
                </View>
            </View>
        </View>
    );
};

var added = [];
const renderCalculations = (itemData) => {
    if (itemData.item.name != 'idle' && !added.includes(itemData.item.name)) {
        added.push(itemData.item.name);
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

    switch (props.selectedAlgorithm.functionName) {
        case 'SJF':
            [finalExecution, averageWait] = SJF(processesCopy);
            break;
        case 'FCFS':
            [finalExecution, averageWait] = FCFS(processesCopy);
            break;
        case 'SRTF':
            [finalExecution, averageWait] = SRTF(processesCopy);
            break;
        case 'RR':
            [finalExecution, averageWait] = RR(processesCopy, props.quantum);
            break;
    }

    added = [];
    var totalExecution = 0;
    var timeFinished = 0;
    var idle = 0;
    finalExecution.forEach(f => {
        totalExecution+= (f.finish-f.start)*30
        timeFinished = f.finish;
        if(f.name==='idle'){
            idle+= f.finish-f.start;
        }
    });

    var cpuUtilization = ((timeFinished-idle)/timeFinished)*100

    return (
        <View>
            <ScrollView horizontal={true} contentContainerStyle={{alignItems:'center',justifyContent:'center'}} >
                <View style={{...styles.chart,width : totalExecution>windowWidth && finalExecution.length>=6 ? totalExecution : windowWidth-40}}>
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
                </View>
            </ScrollView>
            <View style={{ alignItems: 'center', marginVertical: 10 }}>
                <Text>Average waiting time = {averageWait}</Text>
            </View>
            <View style={{ alignItems: 'center', marginVertical: 10 }}>
                <Text>CPU Utilization = %{cpuUtilization}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    chart: {
        padding: 10,
        borderColor: '#7D7D7D',
    },
    section: {
        minWidth : 35,
        backgroundColor: '#ccc',
        borderColor: '#7D7D7D',
        borderWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    tag: {
        minWidth : 35,
        fontSize: 4,
        // paddingLeft: 10,
    },
    calculations: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#7D7D7D',
        borderWidth: 1,
        marginLeft: 10,
    }

});

export default GanttChart;
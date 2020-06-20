import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Dimensions } from 'react-native';
import { SJF, FCFS, SRTF, RR, PSP, PSNP } from '../data/functions';

import Color from '../constants/Colors'
import afterIO from '../data/afterIO';
import execution from '../data/execution';

const windowWidth = Dimensions.get('window').width;

const renderSections = (itemData, burst) => {

    const BURST_TYPE = burst;

    return (
        <View style={{ ...styles.section, flex: itemData.item[BURST_TYPE] }}>
            <View >
                <Text style={{ color: Color.screen }}>{itemData.item.name}</Text>
            </View>
        </View>
    );
};

const renderTags = (itemData, burst) => {

    const BURST_TYPE = burst;

    return (
        <View style={{ ...styles.tag, flex: itemData.item[BURST_TYPE] }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                {itemData.index === 0 ? <Text style={{ color: "black" }}>{itemData.item.start}</Text> : <Text></Text>}
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Text style={{ color: "black" }} >{itemData.item.finish}</Text>
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
                    <Text style={styles.calculationsText}>wat({itemData.item.name}) = {itemData.item.wat}</Text>
                </View>
                <View>
                    <Text style={styles.calculationsText}>tat({itemData.item.name}) = {itemData.item.tat}</Text>
                </View>
            </View>
        );
    }
    return null;
}

const GanttChart = props => {

    // props coming from SimulatorScreen
    var IOdevice = props.IOdevice;
    var quantumIO = props.quantumIO;
    var quantum = props.quantum;
    var selectedPriority = props.selectedPriority;

    var processesListIO = [];

    // Take copies of coming process to send corresponding cuntion

    var [finalExecution, currentTime1] = [0, 0];

    var [finalExecutionWIO, currentTime1WIO] = [0, 0];
    var finalExecutionIO = [];
    var [finalExecutionIOtemp, currentTime1IOtemp] = [0, 0];


    const chooseAlgorithm = (functionName, processes, burst, currentTime, IOarrives) => {
        switch (functionName) {
            case 'SJF':
                return SJF(processes, burst, currentTime, IOarrives);
            case 'FCFS':
                return FCFS(processes, burst, currentTime, IOarrives);
            case 'SRTF':
                return SRTF(processes, burst, currentTime, IOarrives);
            case 'RR':
                if (burst === "IOBurstTime") return RR(processes, quantumIO, burst, currentTime, IOarrives);
                return RR(processes, quantum, burst, currentTime, IOarrives);
            case 'PSP':
                return PSP(processes, burst, currentTime, selectedPriority, IOarrives);
            case 'PSNP':
                return PSNP(processes, burst, currentTime, selectedPriority, IOarrives);

        }
    }

    // Execute first Cpu Bursts
    [finalExecutionWIO, currentTime1WIO] = chooseAlgorithm(props.selectedAlgorithm.functionName, props.processesList, "cpuBurstTime1", 0, IOarrives);

    // I/O Device Case
    var totalExecutionIO = 0;
    var IOprocesses = [];
    var IOprocessesFinal = [];

    if (IOdevice) {
        // replace arriving times for I/O devices
        var IOarrives = {};
        finalExecutionWIO.forEach(f => {
            if (f.name != "idle") {
                IOarrives[f.name] = f.finish;
            }
        })

        // Execute I/O Burst
        IOprocesses = chooseAlgorithm(props.selectedIO, props.processesList, "IOBurstTime", 0, IOarrives);

        var IOfinish = {}
        IOprocesses.forEach(f => {
            // IO finishes
            if (f.name != 'idle') IOfinish[f.name] = f.finish;
        }
        );

        processesListIO = afterIO(quantumIO, quantum, selectedPriority, props.selectedAlgorithm.functionName, props.selectedIO, props.processesList, IOfinish, currentTime1, true);


        [finalExecutionIOtemp, currentTime1IOtemp] = chooseAlgorithm(props.selectedAlgorithm.functionName, processesListIO, "cpuBurstTime1", 0, IOarrives);



        var IOarrivesFinal = {};
        finalExecutionIOtemp.forEach(f => {
            if (f.name != "idle" && f.IOBurstTime != 0 && !f.isCpu1finished) {
                IOarrivesFinal[f.name] = f.finish;
            }
        })


        IOprocessesFinal = chooseAlgorithm(props.selectedIO, processesListIO, "IOBurstTime", 0, IOarrivesFinal);


        var IOfinishFinal = {}

        IOprocessesFinal.forEach(v => {
            if (v.name != 'idle') IOfinishFinal[v.name] = v.finish;
        })

        finalExecutionIO = execution(quantumIO, quantum, selectedPriority, props.selectedAlgorithm.functionName, processesListIO, IOfinishFinal);


        IOprocessesFinal.forEach(f => {
            // totalExecutionIO is used for the GanttChart styling
            totalExecutionIO += (f.finish - f.start) * 25
        }
        );

    }

    finalExecution = IOdevice ? finalExecutionIO : finalExecutionWIO;


    // Tat and Wat calculations and assignments
    var averageWait = 0;

    var finishCPU = {}
    var finishIO = {}
    finalExecution.forEach(p => {
        if (p.name != 'idle') finishCPU[p.name] = p.finish;
    })
    IOprocessesFinal.forEach(p => {
        if (p.name != 'idle') finishIO[p.name] = p.finish;
    })

    for (let i = 0; i < props.processesList.length; i++) {
        var temp = finalExecution.filter(p => p.name === props.processesList[i].name);
        var watTotal = 0;
        temp.forEach(t => {
            watTotal += t.wat;
        });
        finalExecution.forEach(f => {
            if (f.name === props.processesList[i].name) {
                f.wat = watTotal;
                f.tat = finishIO[f.name] > finishCPU[f.name] ? finishIO[f.name] - props.processesList[i].arrivingTime : finishCPU[f.name] - props.processesList[i].arrivingTime
            }
        })
        averageWait += watTotal;
    }

    averageWait = averageWait / props.processesList.length;

    added = [];
    var totalExecution = 0;
    var timeFinished = 0;
    var idle = 0;

    finalExecution.forEach(f => {
        totalExecution += (f.finish - f.start) * 25
        timeFinished = f.finish;
        if (f.name === 'idle') {
            idle += f.finish - f.start;
        }
    });

    // Calculate cpu utilization
    var cpuUtilization = ((timeFinished - idle) / timeFinished) * 100

    return (
        <View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }} >
                <View style={{ flex: 1 }}>
                    <View style={{ ...styles.chart, width: totalExecution > windowWidth && finalExecution.length >= 7 ? totalExecution : windowWidth - 40 }}>
                        <Text>CPU Gantt Chart</Text>
                        <FlatList
                            style={styles.chart}
                            keyExtractor={(item, id) => item.name}
                            data={finalExecution}
                            renderItem={itemData => renderSections(itemData, "cpuBurstTime1")}
                            numColumns={finalExecution.length}
                        />
                        <FlatList
                            keyExtractor={(item, id) => item.name}
                            data={finalExecution}
                            renderItem={itemData => renderTags(itemData, "cpuBurstTime1")}
                            numColumns={finalExecution.length}
                        />

                    </View>
                    {IOdevice ?

                        <View style={{ ...styles.chart, width: totalExecution > windowWidth && finalExecution.length >= 7 ? totalExecution : windowWidth - 40 }}>
                            <Text>I/O Device Gantt Chart</Text>
                            <FlatList
                                style={styles.chart}
                                keyExtractor={(item, id) => item.name}
                                data={IOprocessesFinal}
                                renderItem={itemData => renderSections(itemData, "IOBurstTime")}
                                numColumns={IOprocessesFinal.length}
                            />
                            <FlatList
                                keyExtractor={(item, id) => item.name}
                                data={IOprocessesFinal}
                                renderItem={itemData => renderTags(itemData, "IOBurstTime")}
                                numColumns={IOprocessesFinal.length}
                            />
                        </View>

                        : <></>}

                    <FlatList
                        keyExtractor={(item, id) => item.name}
                        data={finalExecution}
                        renderItem={renderCalculations}
                        numColumns={props.processesList.length}
                    />
                </View>
            </ScrollView>
            <View style={{ alignItems: 'center', marginVertical: 10 }}>
                <Text style={styles.resultText}>Average waiting time = {averageWait.toFixed(2)}</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
                <Text style={styles.resultText}>CPU Utilization = {cpuUtilization.toFixed(2)} %</Text>
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
        minWidth: 35,
        backgroundColor: Color.lightRed,
        borderColor: Color.screen,
        borderWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    tag: {
        minWidth: 35,
        fontSize: 4,
    },
    calculations: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Color.borderColorSimulator,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 6,
        marginLeft: 10,
    },
    calculationsText: {
        color: Color.red,
        fontSize: 12,
        fontFamily: 'open-sans'
    },
    resultText: {
        borderColor: Color.lightRed,
        borderWidth: 1,
        color: Color.lightRed,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 20
    }

});

export default GanttChart;
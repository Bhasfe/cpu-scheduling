import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Dimensions } from 'react-native';
import { SJF, FCFS, SRTF, RR , PSP, PSNP } from '../data/functions';
import Process from '../models/process'

import Color from '../constants/Colors'

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

    // Take copies of coming process to send corresponding cuntion
    var processesCopy = [];
    var processesCopyIO = [];
    var processesCopyCpu2 = [];

    props.processesList.forEach(p => {
        if (p.IOBurstTime > 0) {
            processesCopyIO.push(new Process(
                p.name,
                p.arrivingTime,
                p.cpuBurstTime1,
                p.IOBurstTime,
                p.cpuBurstTime2,
                p.start,
                p.finish,
                p.wat,
                p.tat,
                p.priority
            ));
        }
        if (p.cpuBurstTime2 > 0) {
            processesCopyCpu2.push(new Process(
                p.name,
                p.arrivingTime,
                p.cpuBurstTime1,
                p.IOBurstTime,
                p.cpuBurstTime2,
                p.start,
                p.finish,
                p.wat,
                p.tat,
                p.priority,
            ));
        }
        processesCopy.push(new Process(
            p.name,
            p.arrivingTime,
            p.cpuBurstTime1,
            p.IOBurstTime,
            p.cpuBurstTime2,
            p.start,
            p.finish,
            p.wat,
            p.tat,
            p.priority,
        ));
    })

    var [finalExecution, averageWait,currentTime1] = [0, 0, 0];

    const chooseAlgorithm = (functionName, processes, burst,currentTime) => {
        switch (functionName) {
            case 'SJF':
                return SJF(processes, burst,currentTime);
            case 'FCFS':
                return FCFS(processes, burst,currentTime);
            case 'SRTF':
                return SRTF(processes, burst,currentTime);
            case 'RR':
                if (burst=== "IOBurstTime") return RR(processes, quantumIO, burst,currentTime);
                return RR(processes, quantum, burst,currentTime);
            case 'PSP':
                return PSP(processes, burst,currentTime,selectedPriority);
            case 'PSNP':
                return PSNP(processes, burst,currentTime,selectedPriority);
            
        }
    }

    // Execute first Cpu Bursts
    [finalExecution, averageWait,currentTime1] = chooseAlgorithm(props.selectedAlgorithm.functionName, processesCopy, "cpuBurstTime1",0);

    // I/O Device Case
    var totalExecutionIO = 0;
    var IOprocesses = [];
    var [Cpu2Processes,averageWait2,currentTime2] = [0,0,0];

    if (IOdevice) {
        // replace arriving times for times for I/O devices
        finalExecution.forEach(f => {
            if (f.name != "idle") {
                var t = processesCopyIO.find(i => i.name === f.name)
                if (t) t.arrivingTime = f.finish;
            }
        })

        // Execute I/O Burst
        IOprocesses = chooseAlgorithm(props.selectedIO, processesCopyIO, "IOBurstTime",0);

        // Second CPU Burst calculations
        if (processesCopyCpu2.length > 0) {
            IOprocesses.forEach(f => {
                totalExecutionIO += (f.finish - f.start) * 30
                if (f.name != "idle") {
                    var t = processesCopyCpu2.find(i => i.name === f.name)
                    if (t) t.arrivingTime = f.finish;
                }
            });

            // Execute Second Cpu Burst
            [Cpu2Processes, averageWait2] = chooseAlgorithm(props.selectedAlgorithm.functionName, processesCopyCpu2, "cpuBurstTime2",currentTime1);
            averageWait = (averageWait+averageWait2);
            // Wat & Tat calculations
            var watObj = {};
            var tatObj = {};
            finalExecution.forEach(p => {
                var t = Cpu2Processes.find(t => t.name == p.name);
                if(t){
                    var wat = t.wat + p.wat;
                    watObj[p.name] = wat;
                    Cpu2Processes.filter(k => k.name == t.name).forEach(k =>{
                        tatObj[p.name] = k.finish - props.processesList.find(j => j.name == k.name).arrivingTime;
                    })
                }
            });

            // convert watObj to watList
            var watList = [];
            Object.keys(watObj).forEach(o => {
                watList.push({name:o,wat:watObj[o],tat:tatObj[o]});
            })
            finalExecution = finalExecution.concat(Cpu2Processes);
        };
    }

    added = [];
    var totalExecution = 0;
    var timeFinished = 0;
    var idle = 0;

    finalExecution.forEach(f => {
        totalExecution += (f.finish - f.start) * 30
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
                    <View style={{ ...styles.chart, width: totalExecution > windowWidth && finalExecution.length >= 10 ? totalExecution : windowWidth - 40 }}>
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

                        <View style={{ ...styles.chart, width: totalExecution > windowWidth && finalExecution.length >= 10 ? totalExecution : windowWidth - 40 }}>
                            <Text>I/O Device Gantt Chart</Text>
                            <FlatList
                                style={styles.chart}
                                keyExtractor={(item, id) => item.name}
                                data={IOprocesses}
                                renderItem={itemData => renderSections(itemData, "IOBurstTime")}
                                numColumns={IOprocesses.length}
                            />
                            <FlatList
                                keyExtractor={(item, id) => item.name}
                                data={IOprocesses}
                                renderItem={itemData => renderTags(itemData, "IOBurstTime")}
                                numColumns={IOprocesses.length}
                            />
                        </View>

                        : <></>}
                    
                    <FlatList
                            keyExtractor={(item, id) => item.name}
                            data={IOdevice ? watList : finalExecution}
                            renderItem={renderCalculations}
                            numColumns={IOdevice ? watList.length : props.processesList.length}
                        />
                </View>
            </ScrollView>
            <View style={{ alignItems: 'center', marginVertical: 10 }}>
                <Text style={styles.resultText}>Average waiting time = {averageWait.toFixed(2)}</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
                <Text style={styles.resultText}>CPU Utilization = %{cpuUtilization.toFixed(2)}</Text>
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
        borderWidth: 1,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 6,
        marginLeft: 10,
    },
    calculationsText: {
        color: Color.red,
        fontSize: 11,
    },
    resultText:{
        borderColor: Color.lightRed,
        borderWidth:1,
        color: Color.lightRed, 
        paddingTop:10,
        paddingBottom:10,
        paddingLeft: 20,
        paddingRight:20,
        borderRadius:20
    }

});

export default GanttChart;
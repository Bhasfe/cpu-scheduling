import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert ,KeyboardAvoidingView } from 'react-native';
import { ALGORITHMS } from '../data/algorithms-data';
import { FlatList } from 'react-native-gesture-handler';
import CustomButton from '../components/CustomButton';

import process from '../models/process';
import GanttChart from '../components/GanttChart';


const SimulatorScreen = props => {

    const MAX_PROCESS = 5;

    const algorithmId = props.navigation.getParam('algorithmId');
    const selectedAlgorithm = ALGORITHMS.find(item => item.id === algorithmId);

    const InitialProcesses = [
        new process('P0', 0, 3),
        new process('P1', 2, 1),
        new process('P2', 4, 6),
        new process('P3', 3, 3),
    ];

    const [processesList, setProcessesList] = useState(InitialProcesses);
    const [chartEnable, setChartEnable] = useState(false);

    const renderProcesses = (itemData) => {

        let selectedProcess = processesList.find(item => item.name === itemData.item.name);
        let selectedProcessId = processesList.indexOf(selectedProcess);

        return (
            <View style={styles.rows}>
                <View style={styles.itemContainer}>
                    <Text>{itemData.item.name}</Text>
                </View>
                <View style={styles.itemContainer}>
                    <TextInput
                        placeholder='Edit'
                        keyboardType={'numeric'}
                        onChangeText={input => {
                            processesList[selectedProcessId].arrivingTime = parseInt(input);
                            setProcessesList(processesList);
                        }}
                        value={processesList[selectedProcessId.arrivingTime]}
                    />
                </View>
                <View style={styles.itemContainer}>
                    <TextInput
                        placeholder='Edit'
                        keyboardType={'numeric'}
                        onChangeText={input => {
                            processesList[selectedProcessId].cpuBurstTime1 = parseInt(input);
                            setProcessesList(processesList);
                        }}
                        value={processesList[selectedProcessId.cpuBurstTime1]}
                    />
                </View>
            </View>
        );
    };

    return (
        <View style={styles.screen}>
            <View style={styles.container}>
                <View style={{ ...styles.rows, borderWidth: 1, marginBottom: 5 }}>
                    <View style={styles.itemContainer}>
                        <Text style={styles.caption}>
                            Process
                        </Text>
                    </View>

                    <View style={styles.itemContainer}>
                        <Text style={styles.caption}>
                            Arriving Time
                        </Text>
                    </View>

                    <View style={styles.itemContainer}>
                        <Text style={styles.caption}>
                            Cpu Burst
                        </Text>
                    </View>
                </View>
                <KeyboardAvoidingView behavior="padding">
                <FlatList
                    keyExtractor={(item, id) => item.name}
                    data={processesList}
                    renderItem={renderProcesses}
                />
                 </KeyboardAvoidingView>

                {chartEnable ?
                    <GanttChart
                        processesList={processesList}
                        selectedAlgorithm = {selectedAlgorithm}
                    /> : <></>}

            </View>

                <View style={styles.buttonContainer}>
                    <View style={styles.buttonContainerRow}>

                        <CustomButton title='Add Process' onPress={() => {
                            if (processesList.length != 0 && parseInt((processesList[processesList.length - 1].name)[1]) + 1 >= MAX_PROCESS) {
                                Alert.alert("Limit exceeded", "You cannot add more process !", [{ text: 'OK' }]);
                                return (null);
                            }
                            const newName = processesList.length === 0 ? 'P0' : 'P' + (parseInt((processesList[processesList.length - 1].name)[1]) + 1);
                            setProcessesList(current => [...current, new process(newName, '10', '4')]);
                        }} ></CustomButton>


                        <CustomButton title='Delete Process' onPress={() => {
                            if (processesList.length === 0) {
                                Alert.alert("Table is empty!", "There is no process !", [{ text: 'OK' }]);
                                return (null);
                            }
                            setProcessesList(current => current.slice(0, current.length - 1));
                        }} ></CustomButton>



                        <CustomButton title='Reset' onPress={() => {
                            setProcessesList(InitialProcesses);
                            setChartEnable(false);
                        }} ></CustomButton>

                    </View>
                    <View>
                        <CustomButton title="RUN" style={{width:'100%'}} onPress={() => {
                            setChartEnable(true);
                        }} >
                        </CustomButton>
                    </View>
                </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    container: {
        width: '100%',
        marginVertical : 10
    },
    rows: {
        // flex : 1,
        flexDirection: 'row',
        borderColor: '#7D7D7D',
        marginVertical: 0.3
    },
    itemContainer: {
        flex: 1,
        borderColor: '#7D7D7D',
        borderWidth: 1,
        alignItems: 'center'
    },
    buttonContainer: {
      justifyContent: 'center',
      paddingBottom : 15
    },
    buttonContainerRow: {
        flexDirection: 'row',
        marginBottom : 10
    },
    caption: {
        fontFamily: 'open-sans-bold',
    }
});

SimulatorScreen.navigationOptions = navigationData => {

    const algorithmId = navigationData.navigation.getParam('algorithmId');
    const selectedAlgorithm = ALGORITHMS.find(item => item.id === algorithmId);

    return ({
        headerTitle: selectedAlgorithm.name,
    })
}

export default SimulatorScreen;
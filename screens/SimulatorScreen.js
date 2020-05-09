import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert ,KeyboardAvoidingView,Keyboard,TouchableWithoutFeedback } from 'react-native';
import { ALGORITHMS } from '../data/algorithms-data';
import { FlatList } from 'react-native-gesture-handler';
import CustomButton from '../components/CustomButton';
import Colors from '../constants/Colors';

import process from '../models/process';
import GanttChart from '../components/GanttChart';


const SimulatorScreen = props => {

    const MAX_PROCESS = 5;

    const algorithmId = props.navigation.getParam('algorithmId');
    const selectedAlgorithm = ALGORITHMS.find(item => item.id === algorithmId);

    const InitialProcesses = [
        new process('P0'),
        new process('P1'),
        new process('P2'),
        new process('P3'),
    ];

    const resetted = [];

    const [processesList, setProcessesList] = useState(InitialProcesses);
    const [chartEnable, setChartEnable] = useState(false);
    const [quantum,setQuantum] = useState(0);

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
                        editable = {!chartEnable}
                        placeholder = 'Edit'
                        keyboardType='number-pad'
                        onChangeText={input => {
                            processesList[selectedProcessId].arrivingTime = parseInt(input);
                            setProcessesList(processesList);
                        }}
                        value={processesList[selectedProcessId].arrivingTime}
                    />
                </View>
                <View style={styles.itemContainer}>
                    <TextInput
                        editable = {!chartEnable}
                        placeholder = 'Edit'
                        keyboardType='number-pad'
                        onChangeText={input => {
                            processesList[selectedProcessId].cpuBurstTime1 = parseInt(input);
                            setProcessesList(processesList);
                        }}
                        value={processesList[selectedProcessId].cpuBurstTime1}
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

                {selectedAlgorithm.shortName==="RR" ? 
                    <View style={styles.quantumContainer}>
                        <View style={styles.quantumLabel}>
                            <Text>Quantum : </Text>
                        </View>
                        <View style={styles.quantumInput}>
                            <TextInput
                                // placeholder='Edit'
                                keyboardType={'numeric'}
                                onChangeText={input => {
                                    setQuantum(parseInt(input));
                                }}
                                value={quantum}
                            />
                        </View>
                    </View>
                    :<></>
                    
                }
                 </KeyboardAvoidingView>

                {chartEnable ?
                    <GanttChart
                        processesList={processesList}
                        selectedAlgorithm = {selectedAlgorithm}
                        quantum = {quantum}
                    /> : <></>}

            </View>

                <View style={styles.buttonContainer}>
                    <View style={styles.buttonContainerRow}>

                        <CustomButton title='Add Process' onPress={() => {
                            if(chartEnable){
                                Alert.alert("Simulation finished", "You have to reset simulation first !", [{ text: 'OK' }]);
                                return(null);
                            }
                            if (processesList.length != 0 && parseInt((processesList[processesList.length - 1].name)[1]) + 1 >= MAX_PROCESS) {
                                Alert.alert("Limit exceeded", "You cannot add more process !", [{ text: 'OK' }]);
                                return (null);
                            }
                            const newName = processesList.length === 0 ? 'P0' : 'P' + (parseInt((processesList[processesList.length - 1].name)[1]) + 1);
                            setProcessesList(current => [...current, new process(newName)]);
                        }} ></CustomButton>


                        <CustomButton title='Delete Process' onPress={() => {
                            if(chartEnable){
                                Alert.alert("Simulation finished", "You have to reset simulation first !", [{ text: 'OK' }]);
                                return(null);
                            }
                            if (processesList.length === 0) {
                                Alert.alert("Table is empty!", "There is no process !", [{ text: 'OK' }]);
                                return (null);
                            }
                            setProcessesList(current => current.slice(0, current.length - 1));
                        }} ></CustomButton>

                        <CustomButton title='Reset' onPress={() => {
                            setProcessesList(resetted);
                            setChartEnable(false);
                            setQuantum(0);
                        }} ></CustomButton>

                    </View>
                    <View>
                        <CustomButton title="RUN" style={{width:'100%'}} onPress={() => {
                            var inputValidation = true;
                            for(let i=0;i<processesList.length;i++){
                                if(isNaN(processesList[i].arrivingTime)||isNaN(processesList[i].cpuBurstTime1)||processesList[i].cpuBurstTime1===0){
                                    Alert.alert("Invalid values!", "Please check the values !", [{ text: 'OK' }]);
                                    inputValidation = false;
                                    break;
                                }
                            }
                            if(selectedAlgorithm.shortName==='RR' && quantum ===0){
                                Alert.alert("Invalid values!", "Quantum cannot be 0 !", [{ text: 'OK' }]);
                                inputValidation = false;                            
                            }
                            if(inputValidation){
                                setChartEnable(true);
                            }
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
        marginVertical : 10,
    },
    rows: {
        // flex : 1,
        flexDirection: 'row',
        borderColor: Colors.borderColorSimulator,
        marginVertical: 0.3,
        height : 25,
    },
    itemContainer: {
        flex: 1,
        borderColor: Colors.borderColorSimulator,
        borderWidth: 1,
        alignItems: 'center',
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
    },
    quantumContainer : {
        marginVertical : 10,
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
    },
    quantumInput : {
        borderBottomColor :'black',
        borderBottomWidth : 0.5,
        width : '5%'
    },quantumLabel:{
        
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
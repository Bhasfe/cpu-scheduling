import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, KeyboardAvoidingView, ActivityIndicator} from 'react-native';
import { ALGORITHMS } from '../data/algorithms-data';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
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

    const [processesList, setProcessesList] = useState(InitialProcesses);
    const [chartEnable, setChartEnable] = useState(false);
    const [quantum, setQuantum] = useState(0);
    const [quantumRef, setQuantumRef] = useState(0);
    const [loading,setLoading] = useState(false);


    const [refInput00, setRefInput00] = useState(0);
    const [refInput01, setRefInput01] = useState(0);
    const [refInput10, setRefInput10] = useState(0);
    const [refInput11, setRefInput11] = useState(0);
    const [refInput20, setRefInput20] = useState(0);
    const [refInput21, setRefInput21] = useState(0);
    const [refInput30, setRefInput30] = useState(0);
    const [refInput31, setRefInput31] = useState(0);
    const [refInput40, setRefInput40] = useState(0);
    const [refInput41, setRefInput41] = useState(0);

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
                        ref={refInputin => {
                            if (itemData.item.name === 'P0') setRefInput00(refInputin);
                            else if (itemData.item.name === 'P1') setRefInput10(refInputin);
                            else if (itemData.item.name === 'P2') setRefInput20(refInputin);
                            else if (itemData.item.name === 'P3') setRefInput30(refInputin);
                            else if (itemData.item.name === 'P4') setRefInput40(refInputin);
                        }}
                        onSubmitEditing = {()=>{
                            if (itemData.item.name === 'P0') refInput01.focus();
                            else if (itemData.item.name === 'P1') refInput11.focus();
                            else if (itemData.item.name === 'P2') refInput21.focus();
                            else if (itemData.item.name === 'P3') refInput31.focus();
                            else if (itemData.item.name === 'P4') refInput41.focus();                           
                        }}
                        editable={!chartEnable}
                        placeholder='Edit'
                        keyboardType='number-pad'
                        onChangeText={input => {
                            processesList[selectedProcessId].arrivingTime = parseInt(input);
                            setProcessesList(processesList);
                        }}
                        value={processesList[selectedProcessId].arrivingTime}
                        style={styles.input}
                    />
                </View>
                <View style={styles.itemContainer}>
                    <TextInput
                        ref={refInputin => {
                            if (itemData.item.name === 'P0') setRefInput01(refInputin);
                            else if (itemData.item.name === 'P1') setRefInput11(refInputin);
                            else if (itemData.item.name === 'P2') setRefInput21(refInputin);
                            else if (itemData.item.name === 'P3') setRefInput31(refInputin);
                            else if (itemData.item.name === 'P4') setRefInput41(refInputin);
                        }}
                        onSubmitEditing = {()=>{
                            if (itemData.item.name === 'P0' && processesList.length>1) refInput10.focus();
                            else if (itemData.item.name === 'P1' && processesList.length>2) refInput20.focus();
                            else if (itemData.item.name === 'P2' && processesList.length>3) refInput30.focus();
                            else if (itemData.item.name === 'P3' && processesList.length>4) refInput40.focus();                          
                        }}
                        editable={!chartEnable}
                        placeholder='Edit'
                        keyboardType='number-pad'
                        onChangeText={input => {
                            processesList[selectedProcessId].cpuBurstTime1 = parseInt(input);
                            setProcessesList(processesList);
                        }}
                        value={processesList[selectedProcessId].cpuBurstTime1}
                        style={styles.input}
                    />
                </View>
            </View>
        );
    };

    return (
        <ScrollView style={{flex:1,backgroundColor:Colors.screen}}>
            <View style={styles.redBg}>
                <View style={styles.screen}>
                    <View style={styles.container}>
                        <View style={{ ...styles.rows, borderBottomWidth: 2, marginBottom: 5 }}>
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
                            {selectedAlgorithm.shortName === "RR" ?
                                <View style={styles.quantumContainer}>
                                    <View style={styles.quantumLabel}>
                                        <Text>Quantum : </Text>
                                    </View>
                                    <View style={styles.quantumInput}>
                                        <TextInput
                                            editable={!chartEnable}
                                            placeholder='Edit'
                                            ref={input => setQuantumRef(input)}
                                            keyboardType={'numeric'}
                                            onChangeText={input => {
                                                setQuantum(parseInt(input));
                                            }}
                                            value={quantum}
                                        />
                                    </View>
                                </View>
                                : <></>

                            }
                        </KeyboardAvoidingView>

                        {loading ? 
                            <View style={{flex:1,marginTop: 20}}>
                                <ActivityIndicator size="large" color={Colors.backgroundColor} />
                            </View>: <></>
                        }

                        {chartEnable ?
                            <GanttChart
                                processesList={processesList}
                                selectedAlgorithm={selectedAlgorithm}
                                quantum={quantum}
                            /> : <></>}

                    </View>

                    <View style={styles.buttonContainer}>
                        <View style={styles.buttonContainerRow}>

                            <CustomButton title='Add Process' onPress={() => {
                                if (chartEnable) {
                                    Alert.alert("Simulation finished", "You have to reset simulation first !", [{ text: 'OK' }]);
                                    return (null);
                                }
                                if (processesList.length != 0 && parseInt((processesList[processesList.length - 1].name)[1]) + 1 >= MAX_PROCESS) {
                                    Alert.alert("Limit exceeded", "You cannot add more process !", [{ text: 'OK' }]);
                                    return (null);
                                }
                                const newName = processesList.length === 0 ? 'P0' : 'P' + (parseInt((processesList[processesList.length - 1].name)[1]) + 1);
                                setProcessesList(current => [...current, new process(newName)]);
                            }} ></CustomButton>


                            <CustomButton title='Delete Process' onPress={() => {
                                if (chartEnable) {
                                    Alert.alert("Simulation finished", "You have to reset simulation first !", [{ text: 'OK' }]);
                                    return (null);
                                }
                                if (processesList.length === 0) {
                                    Alert.alert("Table is empty!", "There is no process !", [{ text: 'OK' }]);
                                    return (null);
                                }
                                setProcessesList(current => current.slice(0, current.length - 1));
                            }} ></CustomButton>

                            <CustomButton title='Reset' onPress={() => {
                                setProcessesList(InitialProcesses);
                                // Clearing Text Inputs
                                var L = processesList.length;
                                while (true) {
                                    refInput00.clear();
                                    refInput01.clear();
                                    if(--L===0) break;
                                    refInput10.clear();
                                    refInput11.clear();
                                    if(--L===0) break;
                                    refInput20.clear();
                                    refInput21.clear();
                                    if(--L===0) break;
                                    refInput30.clear();
                                    refInput31.clear();
                                    if(--L===0) break;
                                    refInput40.clear();
                                    refInput41.clear();
                                }
                                if(selectedAlgorithm.shortName==='RR'){
                                    quantumRef.clear();
                                }
                                setChartEnable(false);
                            }} ></CustomButton>

                        </View>
                        <View>
                            <CustomButton title="RUN" style={{ width: '100%' }} onPress={() => {
                                if (chartEnable) {
                                    Alert.alert("Simulation finished", "You have to reset simulation first !", [{ text: 'OK' }]);
                                    return (null);
                                }else{                               
                                var inputValidation = true;
                                for (let i = 0; i < processesList.length; i++) {
                                    if (isNaN(processesList[i].arrivingTime) || isNaN(processesList[i].cpuBurstTime1) || processesList[i].cpuBurstTime1 === 0) {
                                        Alert.alert("Invalid values!", "Please check the values !", [{ text: 'OK' }]);
                                        inputValidation = false;
                                        break;
                                    }
                                }
                                if (selectedAlgorithm.shortName === 'RR' && quantum === 0) {
                                    Alert.alert("Invalid values!", "Quantum cannot be 0 !", [{ text: 'OK' }]);
                                    inputValidation = false;
                                }
                                if (inputValidation) {
                                    setLoading(true);
                                    setTimeout(()=>{
                                        setLoading(false);
                                        setChartEnable(true);
                                    },1500)
                                }
                            }}}  >
                            </CustomButton>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 15,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        backgroundColor: Colors.screen
    },
    redBg: {
        backgroundColor: Colors.red,
        flex: 1
    },
    container: {
        width: '100%',
        marginVertical: 10,
        backgroundColor: Colors.screen
    },
    rows: {
        flexDirection: 'row',
        borderColor: Colors.borderColorSimulator,
        borderBottomWidth: 1,
        borderRadius: 20,
        marginVertical: 0.3,
        height: 35,
    },
    itemContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonContainer: {
        justifyContent: 'center',
        paddingBottom: 15
    },
    buttonContainerRow: {
        flexDirection: 'row',
        marginBottom: 10
    },
    caption: {
        fontFamily: 'open-sans-bold',
    },
    quantumContainer: {
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantumInput: {
        borderBottomColor: 'black',
        borderBottomWidth: 0.5,
    }, quantumLabel: {

    },
    input: {
        flex: 1,
        width: '100%',
        textAlign: 'center'
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
import { SJF, FCFS, SRTF, RR , PSP, PSNP } from '../data/functions';
import process from '../models/process';

const chooseAlgorithm = (quantumIO,quantum,selectedPriority,functionName,processes, burst,currentTime,IOarrives) => {

    switch (functionName) {
        case 'SJF':
            return SJF(processes, burst,currentTime,IOarrives);
        case 'FCFS':
            return FCFS(processes, burst,currentTime,IOarrives);
        case 'SRTF':
            return SRTF(processes, burst,currentTime,IOarrives);
        case 'RR':
            if (burst=== "IOBurstTime") return RR(processes, quantumIO, burst,currentTime,IOarrives);
            return RR(processes, quantum, burst,currentTime,IOarrives);
        case 'PSP':
            return PSP(processes, burst,currentTime,selectedPriority,IOarrives);
        case 'PSNP':
            return PSNP(processes, burst,currentTime,selectedPriority,IOarrives);
        
    }
}


const execution = (quantumIO,quantum,selectedPriority,functionName,processesListIO,IOfinishFinal) => {

    var [finalExecution,currentTime2] = [0,0]

    var IOarrives = {}
    var returnProcesses = [];

    processesListIO.forEach(t => {
        var arrival = t.arrivingTime;
        if(t.isTerminated && t.isCpu1finished) arrival = IOfinishFinal[t.name]
        returnProcesses.push(new process(
            t.name,
            arrival,
            t.cpuBurstTime1,
            t.IOBurstTime,
            t.cpuBurstTime2,
            t.start,
            t.finish,
            t.wat,
            t.tat,
            t.priority,
            t.isTerminated,
            t.isCpu1finished
        ))
    });

    [finalExecution,currentTime2] = chooseAlgorithm(quantumIO,quantum,selectedPriority,functionName,returnProcesses, "cpuBurstTime1",0,IOarrives)

    console.log("IOprocessesFinal");
    console.log(finalExecution);
    

    return finalExecution;


}

export default execution;
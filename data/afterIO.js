import { SJF, FCFS, SRTF, RR, PSP, PSNP } from '../data/functions';
import process from '../models/process';

const chooseAlgorithm = (quantumIO, quantum, selectedPriority, functionName, processes, burst, currentTime, IOarrives) => {

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

const afterIO = (quantumIO, quantum, selectedPriority, functionName, selectedIO, processesList, IOfinishCome, currentTime1, passed) => {

    var processesCopy = [];
    var [finalExecution, currentTime2] = [0, 0];
    var IOprocesses = [];
    var IOarrives = {};
    var IOfinish = {};
    Object.keys(IOfinishCome).forEach(j => {
        IOfinish[j] = IOfinishCome[j];
    })


    processesList.forEach(p => {
        processesCopy.push(new process(
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


    Object.keys(IOfinish).forEach(processName => {
        var t = processesCopy.find(k => k.name === processName && !k.isTerminated);
        if (t && t.cpuBurstTime2 > 0 && IOfinish[processName] < currentTime1) {
            processesCopy.push(new process(
                t.name,
                IOfinish[processName],
                t.cpuBurstTime2,
                0,
                0,
                0,
                0,
                0,
                0,
                t.priority,
                true,
                true,
            ));
            t.isTerminated = true;
            [finalExecution, currentTime2] = chooseAlgorithm(quantumIO, quantum, selectedPriority, functionName, selectedIO, processesCopy, "cpuBurstTime1", 0, IOarrives);
            IOarrives = {};
            finalExecution.forEach(f => {
                if (f.name != "idle") {
                    IOarrives[f.name] = f.finish;
                }
            })
            IOprocesses = chooseAlgorithm(quantumIO, quantum, selectedPriority, selectedIO, processesCopy, "IOBurstTime", 0, IOarrives);
            IOprocesses.forEach(f => {
                // IO finishes
                if (f.name != 'idle') IOfinish[f.name] = f.finish;
            }
            );
            passed = false;
            return;
        } else if (t.cpuBurstTime2 === 0) t.isTerminated = true;
    })

    if (passed) {

        var returnProcesses = [];
        processesCopy.forEach(p => {
            returnProcesses.push(new process(
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
                p.isTerminated,
                p.isCpu1finished
            ))
        })

        processesCopy.forEach(p => {
            if (!p.isTerminated) {
                returnProcesses.push(new process(
                    p.name,
                    IOfinish[p.name],
                    p.cpuBurstTime2,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    p.priority,
                    true,
                    true
                ))
            }
        })


        return returnProcesses;

    }
    else return afterIO(quantumIO, quantum, selectedPriority, functionName, selectedIO, processesCopy, IOfinish, currentTime2, true)

};

export default afterIO;
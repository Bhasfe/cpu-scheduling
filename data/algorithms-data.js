import algorithm from '../models/algorithm';

export const ALGORITHMS = [
    new algorithm('0a','SJF',"SJF",false,"SJF"),
    new algorithm('1a','SRTF',"SRTF",true,"SRTF"),
    new algorithm('2a','FCFS',"FCFS",false,"FCFS"),
    new algorithm('3a','Round Robin',"RR",true,"RR"),
    new algorithm('4a','Priority Scheduling (Preemptive)',"PSP",true,"PSP"),
    new algorithm('5a','Priority Scheduling (Non Preemptive)',"PSNP",false,"PSNP"),
]
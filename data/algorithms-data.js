import algorithm from '../models/algorithm';

export const ALGORITHMS = [
    new algorithm('0a','SJF',"SJF",false,"SJF"),
    new algorithm('1a','SRTF',"SRTF",true,"SRTF"),
    new algorithm('2a','FCFS',"FCFS",false,"FCFS"),
    new algorithm('3a','Round Robin',"RR",false,"RR"),
    new algorithm('4a','Priority Scheduling',"PS",true,"PS"),
    new algorithm('5a','Multilevel Queue Scheduling',"MLQ",true,"MLQ"),
]
import algorithm from '../models/algorithm';

export const ALGORITHMS = [
    new algorithm('0a','SJF',"SJF",false,"SJF"),
    new algorithm('1a','SRTF',"SRTF",true,()=>{console.log('SRTF function!');}),
    new algorithm('2a','FCFS',"FCFS",false,"FCFS"),
    new algorithm('3a','Round Robin',"RR",()=>{console.log('RR function !');}),
    new algorithm('4a','Priority Scheduling',"PS",()=>{console.log('Priority Scheduling function !');}),
    new algorithm('5a','Multilevel Queue Scheduling',"MLQ",()=>{console.log('Multilevel Queue Scheduling Function !');}),
]
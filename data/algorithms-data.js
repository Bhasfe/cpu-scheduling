import algorithm from '../models/algorithm';

export const ALGORITHMS = [
    new algorithm('0a','SJF',false,"SJF"),
    new algorithm('1a','SRTF',true,()=>{console.log('SRTF function!');}),
    new algorithm('2a','FCFS',false,"FCFS"),
    new algorithm('3a','Round Robin',()=>{console.log('RR function !');}),
    new algorithm('4a','Priority Scheduling',()=>{console.log('Priority Scheduling function !');}),
    new algorithm('5a','Multilevel Queue Scheduling',()=>{console.log('Multilevel Queue Scheduling Function !');}),
]
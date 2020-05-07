import process from '../models/process';

export const SJF = (processesCopy) => {

    var currentTime = 0;

    var finalExecution = [];
    var averageWait = 0;

    var flag = processesCopy.length;

    do {
        console.log("Current time = " + currentTime);
        var filtered = processesCopy.filter(p => p.arrivingTime <= currentTime && (!finalExecution.includes(p)||p.name==='idle'));
        if (filtered.length != 0) {
            var min = filtered[0].cpuBurstTime1;
            var index = 0;
            for (let i = 0; i < filtered.length; i++) {
                if (filtered[i].cpuBurstTime1 < min) {
                    min = filtered[i].cpuBurstTime1;
                    index = i;
                }
            }
            // Assign start and finish props
            filtered[index].start = currentTime;
            filtered[index].finish = currentTime + filtered[index].cpuBurstTime1
            finalExecution.push(filtered[index])

            // Calculating wat and tat values
            filtered[index].wat = filtered[index].start - filtered[index].arrivingTime;
            filtered[index].tat = filtered[index].finish - filtered[index].arrivingTime;
            averageWait += filtered[index].wat;


            currentTime += min;
            flag--;

        } else {
            var timeStart = currentTime;
            console.log("Time start " + timeStart);

            do {
                currentTime++;
                var temp = processesCopy.filter(p => p.arrivingTime <= currentTime && (!finalExecution.includes(p)||p.name==='idle'));
                console.log("Current Time ele " + currentTime);
            } while (temp.length === 0);

            console.log("ADDING IDLE AT TIME " + currentTime);
            finalExecution.push(new process("idle", timeStart, currentTime-timeStart, null, null, timeStart, currentTime, 0, 0));

        }
    } while (flag != 0);

    console.log(finalExecution);

    var averageWait = averageWait / finalExecution.length;
    console.log(finalExecution);
    return [finalExecution, averageWait];
};

export const FCFS = (processesCopy) => {

    var currentTime = 0;

    var finalExecution = [];
    var averageWait = 0;

    var flag = processesCopy.length;

    for(let i = 0;i< processesCopy.length;i++){
        for(let j=0;j<processesCopy.length-i-1;j++){
            if(processesCopy[j].arrivingTime>processesCopy[j+1].arrivingTime){
                var temp = processesCopy[j+1];
                processesCopy[j+1] = processesCopy[j];
                processesCopy[j] = temp;
            }
        }
    }

    do {
        console.log("Current time = " + currentTime);
        var filtered = processesCopy.filter(p => p.arrivingTime <= currentTime && (!finalExecution.includes(p)||p.name==='idle'));
        if (filtered.length != 0) {
            var min = filtered[0].arrivingTime;
            var index = 0;
            for (let i = 0; i < filtered.length; i++) {
                if (filtered[i].arrivingTime < min) {
                    min = filtered[i].arrivingTime;
                    index = i;
                }
            }
            // Assign start and finish props
            filtered[index].start = currentTime;
            filtered[index].finish = currentTime + filtered[index].cpuBurstTime1
            finalExecution.push(filtered[index])

            // Calculating wat and tat values
            filtered[index].wat = filtered[index].start - filtered[index].arrivingTime;
            filtered[index].tat = filtered[index].finish - filtered[index].arrivingTime;
            averageWait += filtered[index].wat;


            currentTime += filtered[index].cpuBurstTime1;
            flag--;

        } else {
            var timeStart = currentTime;
            console.log("Time start " + timeStart);

            do {
                
                currentTime++;
                var temp = processesCopy.filter(p => p.arrivingTime <= currentTime && (!finalExecution.includes(p)||p.name==='idle'));
                console.log("Current Time ele " + currentTime);
            } while (temp.length === 0);

            console.log("ADDING IDLE AT TIME " + currentTime);
            finalExecution.push(new process("idle", timeStart, currentTime-timeStart, null, null, timeStart, currentTime, 0, 0));

        }
    } while (flag != 0);

    var averageWait = averageWait / finalExecution.length;
    console.log(finalExecution);
    return [finalExecution, averageWait];
};
import process from '../models/process';

export const SJF = (processesCopy) => {

    var currentTime = 0;

    var finalExecution = [];
    var averageWait = 0;

    var flag = processesCopy.length;

    do {
        var filtered = processesCopy.filter(p => p.arrivingTime <= currentTime && (!finalExecution.includes(p) || p.name === 'idle'));
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

            do {
                currentTime++;
                var temp = processesCopy.filter(p => p.arrivingTime <= currentTime && (!finalExecution.includes(p) || p.name === 'idle'));
            } while (temp.length === 0);

            finalExecution.push(new process("idle", timeStart, currentTime - timeStart, null, null, timeStart, currentTime, 0, 0));

        }
    } while (flag != 0);

    var averageWait = averageWait / finalExecution.length;
    return [finalExecution, averageWait];
};

export const FCFS = (processesCopy) => {

    var currentTime = 0;

    var finalExecution = [];
    var averageWait = 0;

    var flag = processesCopy.length;

    for (let i = 0; i < processesCopy.length; i++) {
        for (let j = 0; j < processesCopy.length - i - 1; j++) {
            if (processesCopy[j].arrivingTime > processesCopy[j + 1].arrivingTime) {
                var temp = processesCopy[j + 1];
                processesCopy[j + 1] = processesCopy[j];
                processesCopy[j] = temp;
            }
        }
    }

    do {
        var filtered = processesCopy.filter(p => p.arrivingTime <= currentTime && (!finalExecution.includes(p) || p.name === 'idle'));
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

            do {

                currentTime++;
                var temp = processesCopy.filter(p => p.arrivingTime <= currentTime && (!finalExecution.includes(p) || p.name === 'idle'));
            } while (temp.length === 0);

            finalExecution.push(new process("idle", timeStart, currentTime - timeStart, null, null, timeStart, currentTime, 0, 0));

        }
    } while (flag != 0);

    var averageWait = averageWait / finalExecution.length;
    return [finalExecution, averageWait];
};

export const SRTF = (processesCopy) => {

    var finalExecution = [];

    // Sorting by arriving time

    for (let i = 0; i < processesCopy.length; i++) {
        for (let j = 0; j < processesCopy.length - i - 1; j++) {
            if (processesCopy[j].arrivingTime > processesCopy[j + 1].arrivingTime) {
                var temp = processesCopy[j + 1];
                processesCopy[j + 1] = processesCopy[j];
                processesCopy[j] = temp;
            }
        }
    }

    // Sorting by CPU burst time

    var arrivings = [];
    var processNames = [];
    for (let i = 0; i < processesCopy.length; i++) {

        if (!processNames.includes(processesCopy[i].name)) processNames.push(processesCopy[i].name);
        if (!arrivings.includes(processesCopy[i].arrivingTime)) arrivings.push(processesCopy[i].arrivingTime);

        for (let j = 0; j < processesCopy.length - i - 1; j++) {
            if ((processesCopy[j].arrivingTime === processesCopy[j + 1].arrivingTime) && (processesCopy[j].cpuBurstTime1 > processesCopy[j + 1].cpuBurstTime1)) {
                var temp = processesCopy[j + 1];
                processesCopy[j + 1] = processesCopy[j];
                processesCopy[j] = temp;
            }
        }
    }

    var currentTime = 0;
    var flag = processesCopy.length;

    do {

        for (let i = 0; i < processesCopy.length; i++) {
            for (let j = 0; j < processesCopy.length - i - 1; j++) {
                if ((processesCopy[j + 1].arrivingTime <= currentTime) && (processesCopy[j].cpuBurstTime1 > processesCopy[j + 1].cpuBurstTime1)) {
                    var temp = processesCopy[j + 1];
                    processesCopy[j + 1] = processesCopy[j];
                    processesCopy[j] = temp;
                }
            }
        }

        var p = processesCopy[0];
        if (currentTime >= p.arrivingTime) {
            var timeStart = currentTime;
            var cpuStart = p.cpuBurstTime1;
            var flag2 = true;
            do {

                do {
                    currentTime++;
                    p.cpuBurstTime1--;
                } while (p.cpuBurstTime1 != 0 && !arrivings.includes(currentTime));


                if (p.cpuBurstTime1 === 0) {
                    finalExecution.push(new process(p.name, timeStart, currentTime - timeStart, null, null, timeStart, currentTime, timeStart - p.arrivingTime, currentTime - p.arrivingTime));
                    flag--;
                    processesCopy = processesCopy.filter(t => t != p);
                    flag2 = false;
                }
                else if (arrivings.includes(currentTime)) {
                    var temp = processesCopy.filter(t1 => t1.arrivingTime === currentTime);
                    for (let i = 0; i < temp.length; i++) {
                        for (let j = 0; j < temp.length - i - 1; j++) {
                            if (temp[j].cpuBurstTime1 > temp[j + 1].cpuBurstTime1) {
                                var swap = temp[j];
                                temp[j] = temp[j + 1];
                                temp[j + 1] = swap;
                            }
                        }
                    }
                    if (temp[0].cpuBurstTime1 < p.cpuBurstTime1) {
                        finalExecution.push(new process(p.name, timeStart, cpuStart - p.cpuBurstTime1, null, null, timeStart, currentTime, timeStart - p.arrivingTime, currentTime - p.arrivingTime));
                        p.arrivingTime = currentTime;
                        processesCopy.push(p);
                        processesCopy.shift();
                        processesCopy.unshift(temp[0]);
                        flag2 = false;
                    }
                }
            } while (flag2 === true)

        } else {
            var timeStart = currentTime;
            do {
                currentTime++;
            } while (currentTime != p.arrivingTime);
            finalExecution.push(new process('idle', timeStart, currentTime - timeStart, null, null, timeStart, currentTime, 0, 0));
        }

    } while (flag != 0 && processesCopy.length != 0);

    // Tat and Wat calculations and assignments

    var averageWait = 0;

    for (let i = 0; i < processNames.length; i++) {
        var temp = finalExecution.filter(p => p.name === processNames[i]);
        var watTotal = 0;
        var tatTotal = 0;
        temp.forEach(t => {
            watTotal += t.wat;
            tatTotal += t.tat;
        });
        finalExecution.forEach(f => {
            if (f.name === processNames[i]) {
                f.wat = watTotal;
                f.tat = tatTotal;
            }
        })
        averageWait += watTotal;
    }

    var averageWait = averageWait / processNames.length;
    return [finalExecution, averageWait];
};



export const RR = (processesCopy, quantum) => {

    var finalExecution = [];

    // Sorting by arriving time

    var processNames = [];

    for (let i = 0; i < processesCopy.length; i++) {
        if (!processNames.includes(processesCopy[i].name)) processNames.push(processesCopy[i].name);
        for (let j = 0; j < processesCopy.length - i - 1; j++) {
            if (processesCopy[j].arrivingTime > processesCopy[j + 1].arrivingTime) {
                var temp = processesCopy[j + 1];
                processesCopy[j + 1] = processesCopy[j];
                processesCopy[j] = temp;
            }
        }
    }

    var currentTime = 0;
    var flag = processesCopy.length;

    do {

        var quantumStart = quantum;

        var p = processesCopy[0];
        if (currentTime >= p.arrivingTime) {
            var timeStart = currentTime;
            var cpuStart = p.cpuBurstTime1;
            var flag2 = true;
            do {

                do {
                    currentTime++;
                    p.cpuBurstTime1--;
                    quantumStart--;
                } while (p.cpuBurstTime1 != 0 && quantumStart != 0);


                if (p.cpuBurstTime1 === 0) {
                    finalExecution.push(new process(p.name, timeStart, currentTime - timeStart, null, null, timeStart, currentTime, timeStart - p.arrivingTime, currentTime - p.arrivingTime));
                    flag--;
                    processesCopy = processesCopy.filter(t => t != p);
                    flag2 = false;
                }

                else if (quantumStart === 0) {
                    finalExecution.push(new process(p.name, timeStart, cpuStart - p.cpuBurstTime1, null, null, timeStart, currentTime, timeStart - p.arrivingTime, currentTime - p.arrivingTime));
                    p.arrivingTime = currentTime;
                    processesCopy.push(p);
                    processesCopy.shift();
                    flag2 = false;
                }
            } while (flag2 === true)

        } else {
            var timeStart = currentTime;
            do {
                currentTime++;
            } while (currentTime != p.arrivingTime);
            finalExecution.push(new process('idle', timeStart, currentTime - timeStart, null, null, timeStart, currentTime, 0, 0));
        }

    } while (flag != 0 && processesCopy.length != 0);

    // Tat and Wat calculations and assignments

    var averageWait = 0;

    for (let i = 0; i < processNames.length; i++) {
        var temp = finalExecution.filter(p => p.name === processNames[i]);
        var watTotal = 0;
        var tatTotal = 0;
        temp.forEach(t => {
            watTotal += t.wat;
            tatTotal += t.tat;
        });
        finalExecution.forEach(f => {
            if (f.name === processNames[i]) {
                f.wat = watTotal;
                f.tat = tatTotal;
            }
        })
        averageWait += watTotal;
    }

    var averageWait = averageWait / processNames.length;
    return [finalExecution, averageWait];
};

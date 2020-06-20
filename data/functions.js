import process from '../models/process';


// Shortest Job First function

export const SJF = (processesList, burst, currentTime, IOarrives) => {

    var processesCopy = [];

    processesList.forEach(p => {
        if (p.IOBurstTime > 0 && burst === "IOBurstTime") {
            processesCopy.push(new process(
                p.name,
                IOarrives[p.name],
                p.cpuBurstTime1,
                p.IOBurstTime,
                p.cpuBurstTime2,
                p.start,
                p.finish,
                p.wat,
                p.tat,
                p.priority,
                p.isTerminated,
                p.isCpu1finished,
            ));
        }
        else if (burst === 'cpuBurstTime1') {
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
                p.isTerminated,
                p.isCpu1finished
            ));
        }
    })

    const BURST_TYPE = burst

    var currentTime = currentTime;

    var finalExecution = [];

    // flag is used to check whether all processes in processesCopy is finished or not
    var flag = processesCopy.length;

    do {
        // filtered stores processes that are available to run at current time
        var filtered = processesCopy.filter(p => p.arrivingTime <= currentTime && (!finalExecution.includes(p) || p.name === 'idle'));
        if (filtered.length != 0) {
            // min stores the burst time of process that has minimum burst time among other processes that are available to run
            var min = filtered[0][BURST_TYPE];
            var index = 0;
            for (let i = 0; i < filtered.length; i++) {
                if (filtered[i][BURST_TYPE] < min) {
                    min = filtered[i][BURST_TYPE];
                    index = i;
                }
            }
            // Assign start and finish props
            filtered[index].start = currentTime;
            filtered[index].finish = currentTime + filtered[index][BURST_TYPE]
            finalExecution.push(filtered[index])

            // Calculating wat and tat values
            filtered[index].wat = filtered[index].start - filtered[index].arrivingTime;
            filtered[index].tat = filtered[index].finish - filtered[index].arrivingTime;

            // current time is incremented as burst time of the process
            currentTime += min;
            flag--;
            // If there is no process available to run at currentTime, current time is incremented until any process will be available to run
        } else {
            var timeStart = currentTime;
            do {
                currentTime++;
                var temp = processesCopy.filter(p => p.arrivingTime <= currentTime && (!finalExecution.includes(p) || p.name === 'idle'));
            } while (temp.length === 0);
            // Adding idle status into final Execution
            finalExecution.push(new process(
                "idle",
                timeStart,
                currentTime - timeStart,
                currentTime - timeStart,
                null,
                timeStart,
                currentTime,
                0,
                0
            ));
        }
    } while (flag != 0);

    if (BURST_TYPE != "IOBurstTime") return [finalExecution, currentTime];
    else return finalExecution;
};


// First Come First Serve function

export const FCFS = (processesList, burst, currentTime, IOarrives) => {

    const BURST_TYPE = burst

    var processesCopy = [];

    processesList.forEach(p => {
        if (p.IOBurstTime > 0 && burst === "IOBurstTime") {
            processesCopy.push(new process(
                p.name,
                IOarrives[p.name],
                p.cpuBurstTime1,
                p.IOBurstTime,
                p.cpuBurstTime2,
                p.start,
                p.finish,
                p.wat,
                p.tat,
                p.priority,
                p.isTerminated,
                p.isCpu1finished,
            ));
        }
        else if (burst === 'cpuBurstTime1') {
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
                p.isTerminated,
                p.isCpu1finished,
            ));
        }
    })

    var currentTime = currentTime;

    var finalExecution = [];

    // flag is used to check whether all processes in processesCopy is finished or not
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
        // filtered stores processes that are available to run at current time
        var filtered = processesCopy.filter(p => p.arrivingTime <= currentTime && (!finalExecution.includes(p) || p.name === 'idle'));
        if (filtered.length != 0) {
            // min stores the arriving time of process that has minimum arriving time among other processes that are available to run
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
            filtered[index].finish = currentTime + filtered[index][BURST_TYPE]
            finalExecution.push(filtered[index])

            // Calculating wat and tat values
            filtered[index].wat = filtered[index].start - filtered[index].arrivingTime;
            filtered[index].tat = filtered[index].finish - filtered[index].arrivingTime;

            currentTime += filtered[index][BURST_TYPE];
            flag--;

            // If there is no process available to run at currentTime, current time is incremented until any process will be available to run
        } else {
            var timeStart = currentTime;
            do {
                currentTime++;
                var temp = processesCopy.filter(p => p.arrivingTime <= currentTime && (!finalExecution.includes(p) || p.name === 'idle'));
            } while (temp.length === 0);
            // Adding idle status into final Execution
            finalExecution.push(new process(
                "idle",
                timeStart,
                currentTime - timeStart,
                currentTime - timeStart,
                null,
                timeStart,
                currentTime,
                0,
                0
            ));
        }
    } while (flag != 0);

    if (BURST_TYPE != "IOBurstTime") return [finalExecution, currentTime];
    else return finalExecution;
};


// Shortest Remaining Time function

export const SRTF = (processesList, burst, currentTime, IOarrives) => {

    var currentTime = currentTime;

    const BURST_TYPE = burst

    var processesCopy = [];

    processesList.forEach(p => {
        if (p.IOBurstTime > 0 && burst === "IOBurstTime") {
            processesCopy.push(new process(
                p.name,
                IOarrives[p.name],
                p.cpuBurstTime1,
                p.IOBurstTime,
                p.cpuBurstTime2,
                p.start,
                p.finish,
                p.wat,
                p.tat,
                p.priority,
                p.isTerminated,
                p.isCpu1finished,
            ));
        }
        else if (burst === 'cpuBurstTime1') {
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
                p.isTerminated,
                p.isCpu1finished,
            ));
        }
    })

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

    // Sorting by burst time

    var arrivings = [];
    var processNames = [];
    for (let i = 0; i < processesCopy.length; i++) {
        if (!processNames.includes(processesCopy[i].name)) processNames.push(processesCopy[i].name);
        if (!arrivings.includes(processesCopy[i].arrivingTime)) arrivings.push(processesCopy[i].arrivingTime);
    }
    for (let i = 0; i < processesCopy.length; i++) {
        for (let j = 0; j < processesCopy.length - i - 1; j++) {
            if ((processesCopy[j].arrivingTime === processesCopy[j + 1].arrivingTime) && (processesCopy[j][BURST_TYPE] > processesCopy[j + 1][BURST_TYPE])) {
                var temp = processesCopy[j + 1];
                processesCopy[j + 1] = processesCopy[j];
                processesCopy[j] = temp;
            }
        }
    }

    //var currentTime;

    // flag is used to check whether all processes in processesCopy is finished or not
    var flag = processesCopy.length;

    do {

        // Sort processes that are available to run at current time by their burst times

        for (let i = 0; i < processesCopy.length; i++) {
            for (let j = 0; j < processesCopy.length - i - 1; j++) {
                if (processesCopy[j].arrivingTime > processesCopy[j + 1].arrivingTime) {
                    var temp = processesCopy[j + 1];
                    processesCopy[j + 1] = processesCopy[j];
                    processesCopy[j] = temp;
                }
            }
        }

        for (let i = 0; i < processesCopy.length; i++) {
            for (let j = 0; j < processesCopy.length - i - 1; j++) {
                if ((processesCopy[j + 1].arrivingTime <= currentTime) && (processesCopy[j][BURST_TYPE] > processesCopy[j + 1][BURST_TYPE])) {
                    var temp = processesCopy[j + 1];
                    processesCopy[j + 1] = processesCopy[j];
                    processesCopy[j] = temp;
                }
            }
        }

        // Select the first process
        var p = processesCopy[0];
        if (currentTime >= p.arrivingTime) {
            // timeStart is used to store the time process starts
            var timeStart = currentTime;
            // burstStart is used to store the inital burst time when process starts
            var burstStart = p[BURST_TYPE];
            // flag2 is used to check is there any processes running
            var flag2 = true;
            do {
                // Process is running until it is finished or new process(or processes) come (or available to run at current time)
                do {
                    currentTime++;
                    p[BURST_TYPE]--;
                } while (p[BURST_TYPE] != 0 && !arrivings.includes(currentTime));

                // If process is finished, it is added to final execution and remove from the processesCopy
                if (p[BURST_TYPE] === 0) {
                    finalExecution.push(new process(
                        p.name,
                        timeStart,
                        currentTime - timeStart,
                        currentTime - timeStart,
                        currentTime - timeStart,
                        timeStart,
                        currentTime,
                        timeStart - p.arrivingTime,
                        currentTime - p.arrivingTime,
                        p.priority,
                        p.isTerminated,
                        p.isCpu1finished,
                    ));
                    flag--;
                    processesCopy = processesCopy.filter(t => t != p);
                    flag2 = false;
                }
                // If new process or processes come
                else if (arrivings.includes(currentTime)) {
                    // Get new process or processes
                    var temp = processesCopy.filter(t1 => t1.arrivingTime === currentTime);
                    // Sort new processes
                    for (let i = 0; i < temp.length; i++) {
                        for (let j = 0; j < temp.length - i - 1; j++) {
                            if (temp[j][BURST_TYPE] > temp[j + 1][BURST_TYPE]) {
                                var swap = temp[j];
                                temp[j] = temp[j + 1];
                                temp[j + 1] = swap;
                            }
                        }
                    }
                    // If new process's burst time > current process's remaining burst time,
                    // current process will go to end of processCopy and new process will be added to beginning of processCopy
                    if (temp[0][BURST_TYPE] < p[BURST_TYPE]) {
                        finalExecution.push(new process(
                            p.name,
                            timeStart,
                            burstStart - p[BURST_TYPE],
                            burstStart - p[BURST_TYPE],
                            burstStart - p[BURST_TYPE],
                            timeStart,
                            currentTime,
                            timeStart - p.arrivingTime,
                            currentTime - p.arrivingTime,
                            p.priority,
                            p.isTerminated,
                            p.isCpu1finished,
                        ));
                        p.arrivingTime = currentTime;
                        processesCopy.push(p);
                        processesCopy.shift();
                        processesCopy.unshift(temp[0]);
                        flag2 = false;
                    }
                }
            } while (flag2 === true)
            // If there is no process available to run at currentTime, current time is incremented until any process will be available to run
        } else {
            var timeStart = currentTime;
            do {
                currentTime++;
            } while (currentTime != p.arrivingTime);
            // Adding idle status into final Execution
            finalExecution.push(new process(
                'idle',
                timeStart,
                currentTime - timeStart,
                currentTime - timeStart,
                currentTime - timeStart,
                timeStart,
                currentTime,
                0,
                0
            ));
        }

    } while (flag != 0 && processesCopy.length != 0);

    if (BURST_TYPE != "IOBurstTime") return [finalExecution, currentTime];
    else return finalExecution;
};



// Round Robin function

export const RR = (processesList, quantum, burst, currentTime, IOarrives) => {

    const BURST_TYPE = burst

    var processesCopy = [];

    processesList.forEach(p => {
        if (p.IOBurstTime > 0 && burst === "IOBurstTime") {
            processesCopy.push(new process(
                p.name,
                IOarrives[p.name],
                p.cpuBurstTime1,
                p.IOBurstTime,
                p.cpuBurstTime2,
                p.start,
                p.finish,
                p.wat,
                p.tat,
                p.priority,
                p.isTerminated,
                p.isCpu1finished,
            ));
        }
        else if (burst === 'cpuBurstTime1') {
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
                p.isTerminated,
                p.isCpu1finished,
            ));
        }
    })

    var finalExecution = [];

    // Sorting by arriving time and getting the process names

    var processNames = [];
    for (let i = 0; i < processesCopy.length; i++) {
        if (!processNames.includes(processesCopy[i].name)) processNames.push(processesCopy[i].name);
    }

    for (let i = 0; i < processesCopy.length; i++) {
        for (let j = 0; j < processesCopy.length - i - 1; j++) {
            if (processesCopy[j].arrivingTime > processesCopy[j + 1].arrivingTime) {
                var temp = processesCopy[j + 1];
                processesCopy[j + 1] = processesCopy[j];
                processesCopy[j] = temp;
            }
        }
    }
    var currentTime = currentTime;

    // flag is used to check whether all processes in processesCopy is finished or not
    var flag = processesCopy.length;

    do {

        for (let i = 0; i < processesCopy.length; i++) {
            for (let j = 0; j < processesCopy.length - i - 1; j++) {
                if (processesCopy[j].arrivingTime > processesCopy[j + 1].arrivingTime) {
                    var temp = processesCopy[j + 1];
                    processesCopy[j + 1] = processesCopy[j];
                    processesCopy[j] = temp;
                }
            }
        }

        var quantumStart = quantum;

        var p = processesCopy[0];
        if (currentTime >= p.arrivingTime) {
            var timeStart = currentTime;
            var burstStart = p[BURST_TYPE];
            var flag2 = true;
            do {

                // Process is running until it is finish or quantum time is done
                do {
                    currentTime++;
                    p[BURST_TYPE]--;
                    quantumStart--;
                } while (p[BURST_TYPE] != 0 && quantumStart != 0);

                // If process is finished it will be added into finalExecution and removed from processesCopy
                if (p[BURST_TYPE] === 0) {
                    finalExecution.push(new process(
                        p.name,
                        timeStart,
                        currentTime - timeStart,
                        currentTime - timeStart,
                        currentTime - timeStart,
                        timeStart,
                        currentTime,
                        timeStart - p.arrivingTime,
                        currentTime - p.arrivingTime,
                        p.priority,
                        p.isTerminated,
                        p.isCpu1finished
                    ));
                    flag--;
                    processesCopy = processesCopy.filter(t => t != p);
                    flag2 = false;
                }
                // If the execution stop because of the quantum time is done, it will go into the end of the processesCopy
                else if (quantumStart === 0) {
                    finalExecution.push(new process(
                        p.name,
                        timeStart,
                        burstStart - p[BURST_TYPE],
                        burstStart - p[BURST_TYPE],
                        burstStart - p[BURST_TYPE],
                        timeStart,
                        currentTime,
                        timeStart - p.arrivingTime,
                        currentTime - p.arrivingTime,
                        p.priority,
                        p.isTerminated,
                        p.isCpu1finished
                    ));
                    p.arrivingTime = currentTime;
                    processesCopy.push(p);
                    processesCopy.shift();
                    flag2 = false;
                }
            } while (flag2 === true)

            // If there is no process available to run at currentTime, current time is incremented until any process will be available to run
        } else {
            var timeStart = currentTime;
            do {
                currentTime++;
            } while (currentTime != p.arrivingTime);
            // Adding idle status into final Execution
            finalExecution.push(new process(
                'idle',
                timeStart,
                currentTime - timeStart,
                currentTime - timeStart,
                currentTime - timeStart,
                timeStart,
                currentTime,
                0,
                0,
            ));
        }

    } while (flag != 0 && processesCopy.length != 0);

    if (BURST_TYPE != "IOBurstTime") return [finalExecution, currentTime];
    else return finalExecution;
};

// Priority Scheduling (Non-Preemptive) function

export const PSNP = (processesList, burst, currentTime, priorityType, IOarrives) => {

    var processesCopy = [];

    processesList.forEach(p => {
        if (p.IOBurstTime > 0 && burst === "IOBurstTime") {
            processesCopy.push(new process(
                p.name,
                IOarrives[p.name],
                p.cpuBurstTime1,
                p.IOBurstTime,
                p.cpuBurstTime2,
                p.start,
                p.finish,
                p.wat,
                p.tat,
                p.priority,
                p.isTerminated,
                p.isCpu1finished,
            ));
        }
        else if (burst === 'cpuBurstTime1') {
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
                p.isTerminated,
                p.isCpu1finished,
            ));
        }
    })

    // If priorityType Largest sort processes by their priority (high to low) and convert priorityType Smallest indirectly
    if (priorityType == "Largest") {
        for (let i = 0; i < processesCopy.length; i++) {
            for (let j = 0; j < processesCopy.length - i - 1; j++) {
                if (processesCopy[j].priority < processesCopy[j + 1].priority) {
                    var temp = processesCopy[j + 1];
                    processesCopy[j + 1] = processesCopy[j];
                    processesCopy[j] = temp;
                }
            }
        }
        for (let i = 0; i < processesCopy.length; i++) {
            processesCopy[i].priority = i + 1;
        }
    }

    const BURST_TYPE = burst

    var currentTime = currentTime;

    var finalExecution = [];

    // flag is used to check whether all processes in processesCopy is finished or not
    var flag = processesCopy.length;

    do {
        // filtered stores processes that are available to run at current time
        var filtered = processesCopy.filter(p => p.arrivingTime <= currentTime && (!finalExecution.includes(p) || p.name === 'idle'));
        if (filtered.length != 0) {
            // min stores the priority of process that has minimum priority (in terms of integer) among other processes that are available to run
            var min = filtered[0].priority;
            var index = 0;
            for (let i = 0; i < filtered.length; i++) {
                if (filtered[i].priority < min) {
                    min = filtered[i].priority;
                    index = i;
                }
            }
            // Assign start and finish props
            filtered[index].start = currentTime;
            filtered[index].finish = currentTime + filtered[index][BURST_TYPE]
            finalExecution.push(filtered[index])

            // Calculating wat and tat values
            filtered[index].wat = filtered[index].start - filtered[index].arrivingTime;
            filtered[index].tat = filtered[index].finish - filtered[index].arrivingTime;

            // current time is incremented as burst time of the process
            currentTime += filtered[index][BURST_TYPE];
            flag--;
            // If there is no process available to run at currentTime, current time is incremented until any process will be available to run
        } else {
            var timeStart = currentTime;
            do {
                currentTime++;
                var temp = processesCopy.filter(p => p.arrivingTime <= currentTime && (!finalExecution.includes(p) || p.name === 'idle'));
            } while (temp.length === 0);
            // Adding idle status into final Execution
            finalExecution.push(new process(
                "idle",
                timeStart,
                currentTime - timeStart,
                currentTime - timeStart,
                null,
                timeStart,
                currentTime,
                0,
                0,
                0,
            ));
        }
    } while (flag != 0);

    if (BURST_TYPE != "IOBurstTime") return [finalExecution, currentTime];
    else return finalExecution;
};


// Priority Scheduling (Preemptive) function

export const PSP = (processesList, burst, currentTime, priorityType, IOarrives) => {

    var processesCopy = [];

    processesList.forEach(p => {
        if (p.IOBurstTime > 0 && burst === "IOBurstTime") {
            processesCopy.push(new process(
                p.name,
                IOarrives[p.name],
                p.cpuBurstTime1,
                p.IOBurstTime,
                p.cpuBurstTime2,
                p.start,
                p.finish,
                p.wat,
                p.tat,
                p.priority,
                p.isTerminated,
                p.isCpu1finished,
            ));
        }
        else if (burst === 'cpuBurstTime1') {
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
                p.isTerminated,
                p.isCpu1finished,
            ));
        }
    })


    var currentTime = currentTime;

    const BURST_TYPE = burst

    var finalExecution = [];

    // If priorityType Largest sort processes by their priority (high to low) and convert priorityType Smallest indirectly
    if (priorityType == "Largest") {
        for (let i = 0; i < processesCopy.length; i++) {
            for (let j = 0; j < processesCopy.length - i - 1; j++) {
                if (processesCopy[j].priority < processesCopy[j + 1].priority) {
                    var temp = processesCopy[j + 1];
                    processesCopy[j + 1] = processesCopy[j];
                    processesCopy[j] = temp;
                }
            }
        }
        for (let i = 0; i < processesCopy.length; i++) {
            processesCopy[i].priority = i + 1;
        }
    }

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

    // Sorting by priority
    var arrivings = [];
    var processNames = [];
    for (let i = 0; i < processesCopy.length; i++) {
        if (!processNames.includes(processesCopy[i].name)) processNames.push(processesCopy[i].name);
        if (!arrivings.includes(processesCopy[i].arrivingTime)) arrivings.push(processesCopy[i].arrivingTime);
    }
    for (let i = 0; i < processesCopy.length; i++) {
        for (let j = 0; j < processesCopy.length - i - 1; j++) {
            if ((processesCopy[j].arrivingTime === processesCopy[j + 1].arrivingTime) && (processesCopy[j].priority > processesCopy[j + 1].priority)) {
                var temp = processesCopy[j + 1];
                processesCopy[j + 1] = processesCopy[j];
                processesCopy[j] = temp;
            }
        }
    }

    // flag is used to check whether all processes in processesCopy is finished or not
    var flag = processesCopy.length;

    do {

        // Sort processes that are available to run at current time by their priority

        for (let i = 0; i < processesCopy.length; i++) {
            for (let j = 0; j < processesCopy.length - i - 1; j++) {
                if (processesCopy[j].arrivingTime > processesCopy[j + 1].arrivingTime) {
                    var temp = processesCopy[j + 1];
                    processesCopy[j + 1] = processesCopy[j];
                    processesCopy[j] = temp;
                }
            }
        }

        for (let i = 0; i < processesCopy.length; i++) {
            for (let j = 0; j < processesCopy.length - i - 1; j++) {
                if ((processesCopy[j + 1].arrivingTime <= currentTime) && (processesCopy[j].priority > processesCopy[j + 1].priority)) {
                    var temp = processesCopy[j + 1];
                    processesCopy[j + 1] = processesCopy[j];
                    processesCopy[j] = temp;
                }
            }
        }

        // Select the first process
        var p = processesCopy[0];
        if (currentTime >= p.arrivingTime) {
            // timeStart is used to store the time process starts
            var timeStart = currentTime;
            // burstStart is used to store the inital burst time when process starts
            var burstStart = p[BURST_TYPE];
            // flag2 is used to check is there any processes running
            var flag2 = true;
            do {
                // Process is running until it is finished or new process(or processes) come (or available to run at current time)
                do {
                    currentTime++;
                    p[BURST_TYPE]--;
                } while (p[BURST_TYPE] != 0 && !arrivings.includes(currentTime));

                // If process is finished, it is added to final execution and remove from the processesCopy
                if (p[BURST_TYPE] === 0) {
                    finalExecution.push(new process(
                        p.name,
                        timeStart,
                        currentTime - timeStart,
                        currentTime - timeStart,
                        currentTime - timeStart,
                        timeStart,
                        currentTime,
                        timeStart - p.arrivingTime,
                        currentTime - p.arrivingTime,
                        p.priority,
                        p.isTerminated,
                        p.isCpu1finished,
                    ));
                    flag--;
                    processesCopy = processesCopy.filter(t => t != p);
                    flag2 = false;
                }
                // If new process or processes come
                else if (arrivings.includes(currentTime)) {
                    // Get new process or processes
                    var temp = processesCopy.filter(t1 => t1.arrivingTime === currentTime);
                    // Sort new processes
                    for (let i = 0; i < temp.length; i++) {
                        for (let j = 0; j < temp.length - i - 1; j++) {
                            if (temp[j].priority > temp[j + 1].priority) {
                                var swap = temp[j];
                                temp[j] = temp[j + 1];
                                temp[j + 1] = swap;
                            }
                        }
                    }
                    // If new process's priority > current process's priority,
                    // current process will go to end of processCopy and new process will be added to beginning of processCopy
                    if (temp[0].priority < p.priority) {
                        finalExecution.push(new process(
                            p.name,
                            timeStart,
                            burstStart - p[BURST_TYPE],
                            burstStart - p[BURST_TYPE],
                            burstStart - p[BURST_TYPE],
                            timeStart,
                            currentTime,
                            timeStart - p.arrivingTime,
                            currentTime - p.arrivingTime,
                            p.priority,
                            p.isTerminated,
                            p.isCpu1finished,
                        ));
                        p.arrivingTime = currentTime;
                        processesCopy.push(p);
                        processesCopy.shift();
                        processesCopy.unshift(temp[0]);
                        flag2 = false;
                    }
                }
            } while (flag2 === true)
            // If there is no process available to run at currentTime, current time is incremented until any process will be available to run
        } else {
            var timeStart = currentTime;
            do {
                currentTime++;
            } while (currentTime != p.arrivingTime);
            // Adding idle status into final Execution
            finalExecution.push(new process(
                'idle',
                timeStart,
                currentTime - timeStart,
                currentTime - timeStart,
                currentTime - timeStart,
                timeStart,
                currentTime,
                0,
                0,
                0
            ));
        }

    } while (flag != 0 && processesCopy.length != 0);

    if (BURST_TYPE != "IOBurstTime") return [finalExecution, currentTime];
    else return finalExecution;
};

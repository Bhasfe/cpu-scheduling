class process {

    /**
     * 
     * @param {string} name 
     * @param {number} arrivingTime 
     * @param {number} cpuBurstTime1 
     * @param {number} IOBurstTime 
     * @param {number} cpuBurstTime2
     * @param {number} start
     * @param {number} finish
     * @param {number} wat
     * @param {number} tat
     *  
     */
    
    constructor(name,arrivingTime,cpuBurstTime1 = 0,IOBurstTime = 0,cpuBurstTime2 = 0,start,finish,wat,tat){
        this.name = name
        this.arrivingTime = arrivingTime,
        this.cpuBurstTime1 = cpuBurstTime1;
        this.IOBurstTime = IOBurstTime;
        this.cpuBurstTime2 = cpuBurstTime2;
        this.start = start;
        this.finish = finish;
        this.wat = wat;
        this.tat = tat;
    }
}

export default process;

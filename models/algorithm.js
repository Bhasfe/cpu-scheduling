class algorithm {

    /**
     * 
     * @param {string} id 
     * @param {string} name 
     * @param {boolean} isPreemptive 
     * @param {string} functionName 
     */

    constructor(id,name,isPreemptive,functionName){
        this.id = id;
        this.name = name;
        this.isPreemptive = isPreemptive;
        this.functionName = functionName;
    }
}

export default algorithm;

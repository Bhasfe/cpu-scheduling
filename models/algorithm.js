class algorithm {

    /**
     * 
     * @param {string} id 
     * @param {string} name 
     * @param {boolean} isPreemptive 
     * @param {string} functionName 
     * @param {string} shortName
     */

    constructor(id,name,shortName, isPreemptive,functionName){
        this.id = id;
        this.name = name;
        this.shortName = shortName;
        this.isPreemptive = isPreemptive;
        this.functionName = functionName;
    }
}

export default algorithm;

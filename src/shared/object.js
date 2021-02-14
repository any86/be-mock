export function objectFilterEmpty(obj){
    const newObj = {};
    for(const key in obj){
        if('' !== obj[key].trim()){
            newObj[key] = obj[key];
        }
    }
    return newObj;
}
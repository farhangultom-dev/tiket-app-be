
const deleteFromObject = (keyToDelete, obj) => {
    let lengthKey = keyToDelete.length;
    for (let key in obj){
        if (key.substr(0, lengthKey) == keyToDelete){
            delete obj[key];
        }
    }
    return obj;
}

module.exports = { deleteFromObject };
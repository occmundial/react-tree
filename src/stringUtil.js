function getModuleName(rawModuleName,joiner){
    var dirTree = rawModuleName.split('\\');
    var result = '';
    for(var i = 0; i < dirTree.length; i++){
        if (dirTree[i] !== '.' && dirTree[i] !== '..'){
            result += dirTree[i];
            if(i !== dirTree.length-1){
                result += joiner;
            }
        }
    }
    return result;
}

module.exports = {
    getModuleName: getModuleName
}
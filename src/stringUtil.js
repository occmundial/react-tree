function getModuleName(rawModuleName,joiner){
    var dirTree = rawModuleName.split('\\');
    dirTree = dirTree.length == 1 ? rawModuleName.split('/') : dirTree;
    var result = '';
    for(var i = 0; i < dirTree.length; i++){
        if (dirTree[i] !== '.' && dirTree[i] !== '..'){
            if(dirTree[i] !== 'index.js' && dirTree[i] !== 'index.jsx'){
                result += dirTree[i];
                result += joiner;
            }
        }
    }
    return result.charAt(result.length-1) == '_' ? result.substring(0,result.length-1) : result;
}

function removeIndexJS(pathName){
    var dirTree = pathName.split('\\');
    dirTree = dirTree.length == 1 ? pathName.split('/') : dirTree;
    if (dirTree[dirTree.length-1] == 'index.js' || dirTree[dirTree.length-1] == 'index.jsx'){
        dirTree = dirTree.slice(0,dirTree.length-1);
    }
    return dirTree.join('/');
}

module.exports = {
    getModuleName: getModuleName,
    removeIndexJS: removeIndexJS
}
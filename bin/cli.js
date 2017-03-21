reactTree = require('../index.js');

if(process.argv.length < 3){
    console.log('Missing parameters: Source dir');
    return -1;
}

return reactTree.generateTreeDoc(process.argv[2], process.argv.length > 3 ? process.argv[3] : 0);
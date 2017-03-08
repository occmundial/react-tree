const fs = require('fs');
const path = require('path');

//https://gist.github.com/kethinov/6658166
const getAllFiles = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        filelist = fs.statSync(path.join(dir, file)).isDirectory()
            ? (file!=='node_modules' ? getAllFiles(path.join(dir, file), filelist) : [])
            : filelist.concat(path.join(dir, file));
});
    return filelist;
}

const filterFiles = (fileList, ext) =>{
    return fileList.filter((fileName) => {
            return fileName.split('.').slice(-1)[0] === ext;
});
}

const readFile = (path) =>{
    try {
        // var filename = require.resolve(__dirname + '/' + path);
        // console.log(filename);
        return fs.readFileSync(path, 'utf8');
    } catch (e) {
        console.log(e);
        return null;
    }
}

const writeFile = (path, value) => {
    fs.writeFileSync(path, value, 'utf8');
}

const createDir = (value) => {
    if (!fs.existsSync(value)){
        fs.mkdirSync(value);
    }
}

//http://stackoverflow.com/questions/11293857/fastest-way-to-copy-file-in-node-js
const copyFile = (source, target) => {
    var rd = fs.createReadStream(source);
    rd.on("error", function(err) {
        done(err);
    });
    var wr = fs.createWriteStream(target);
    wr.on("error", function(err) {
        done(err);
    });
    wr.on("close", function(ex) {
        done();
    });
    rd.pipe(wr);

    function done(err) {
        if (err) {
            console.log(err);
            return -1;
        }
    }
}

module.exports = {
    getAllFiles: getAllFiles,
    filterFiles: filterFiles,
    readFile: readFile,
    writeFile: writeFile,
    createDir: createDir,
    copyFile: copyFile
}

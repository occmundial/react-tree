const fs = require('fs');
const path = require('path');

//https://gist.github.com/kethinov/6658166
const getAllFiles = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        filelist = fs.statSync(path.join(dir, file)).isDirectory()
            ? getAllFiles(path.join(dir, file), filelist)
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
        var filename = require.resolve(__dirname + '/' + path);
        // console.log(filename);
        return fs.readFileSync(filename, 'utf8');
    } catch (e) {
        // console.log(e);
        return '';
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
const copyFile = (source, target, cb) => {
    var cbCalled = false;

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
        if (!cbCalled) {
            cb(err);
            cbCalled = true;
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

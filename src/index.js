//TODO: Consider config to show imports of non-app components eg. other frameworks
//TODO: Define use of const vs var

const fileUtil = require('./fileUtil.js');
const targetDir = './react-tree';

function getColor (componentName){
    var sum = 0;
    componentName.split('').forEach(function (value){
        sum += value.charCodeAt(0);
    });
    sum = sum%1000;
    var color = 'rgb(';
    color += Math.floor(255*sum/1000)+',';
    color += Math.floor(255*(sum%100)/100)+',';
    color += Math.floor(255*(sum%10)/10)+')';
    return color;
}

function writeFile(file,contents,loggingLevel){
    try{
        fileUtil.writeFile(file,contents,'utf-8');
        loggingLevel > 0 ? console.log('\n>"'+file+'" created.'):0;
    }catch (e){
        console.log('\n>Failed to create file "'+file+'".');
        console.log(e);
    }
}

function createTreeDirectory(targetDir){
    fileUtil.createDir(targetDir);
    fileUtil.copyFile(__dirname+'/staticFiles/Treant.css',targetDir+'/Treant.css',null);
    fileUtil.copyFile(__dirname+'/staticFiles/Treant.js',targetDir+'/Treant.js',null);
    fileUtil.createDir(targetDir+'/vendor');
    fileUtil.copyFile(__dirname+'/staticFiles/vendor/jquery.easing.js',targetDir+'/vendor/jquery.easing.js',null);
    fileUtil.copyFile(__dirname+'/staticFiles/vendor/jquery.min.js',targetDir+'/vendor/jquery.min.js',null);
    fileUtil.copyFile(__dirname+'/staticFiles/vendor/jquery.mousewheel.js',targetDir+'/vendor/jquery.mousewheel.js',null);
    fileUtil.copyFile(__dirname+'/staticFiles/vendor/raphael.js',targetDir+'/vendor/raphael.js',null);
    fileUtil.createDir(targetDir+'/vendor/perfect-scrollbar');
    fileUtil.copyFile(__dirname+'/staticFiles/vendor/perfect-scrollbar/perfect-scrollbar.css',targetDir+'/vendor/perfect-scrollbar/perfect-scrollbar.css',null);
    fileUtil.copyFile(__dirname+'/staticFiles/vendor/perfect-scrollbar/perfect-scrollbar.js',targetDir+'/vendor/perfect-scrollbar/perfect-scrollbar.js',null);
}

function generateTreeDoc(sourceDir, loggingLevel = 0, includeExternals = false){

    const stringUtil = require('./stringUtil');

    if(loggingLevel > 0){
        console.log('\n>Enabled logging level '+loggingLevel+'.');
        includeExternals ?
            console.log('\n>Including external components.')
            :console.log('\n>Excluding external components.');
    }

    if(!sourceDir){
        console.log('\nreactTree>Source directory must be specified.')
        return -1;
    }
    const docUtil = require('./docUtil.js');
    const rootOrientation = 'WEST';

    var docs = [];
    var fileList;
    try {
        var fileList = fileUtil.getAllFiles(sourceDir);
        loggingLevel > 1 ? console.log('\n>'+fileList.length+' file(s) found on "'+sourceDir+'".'):0;
    }catch (e){
        console.log('\n>Failed to get files from "'+sourceDir+'".');
        console.log(e);
        return -1;
    }

    var sourceFiles = fileUtil.filterFiles(fileList,'js').concat(fileUtil.filterFiles(fileList,'jsx'));
    if(loggingLevel > 1){
        console.log('\n>'+sourceFiles.length+' js file(s) found.');
        console.log('\n>Starting search of react components.');
    }
    for(var i in sourceFiles){
        var src = fileUtil.readFile(sourceFiles[i]);
        if(!src)
            continue;
        var log = '"'+sourceFiles[i]+'"';
        var doc = docUtil.getModuleDoc(src);
        if(doc){
            doc.imports = doc.imports.map(
                function(arg){
                    return {'name': arg};
                }
            );
            doc.component = stringUtil.getModuleName(sourceFiles[i],'_').replace(/-/g,'').replace(/\./g,'');
            doc.path = sourceFiles[i];
            docs.push(doc);
            log += ' contains react component "'+doc.component+'".';
        }else{
            log += ' does not contain a react component.';
        }
        loggingLevel > 1 ? console.log(log):0;
    }

    loggingLevel > 0 ? console.log('\n>'+docs.length+' react component(s) found.'):0;

    // http://fperucic.github.io/treant-js/

    var configString = 'var chartConfig = {container: "#tree-simple", rootOrientation:"'+rootOrientation+'",';
    configString += 'levelSeparation:5, siblingSeparation:5,subTeeSeparation:5, connectors: {type: "straight",style: {"stroke-width": 2,"stroke": "#ccc"}}};';
    var parentString = '';
    var treeString = 'var tree = [chartConfig,';
    var cssString = 'body{ font-family: "Verdana"; font-size: 16px;} ';
    var htmlString = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Source Tree</title>';
    htmlString += '<link rel="stylesheet" href="Treant.css"><link rel="stylesheet" href="nodeColors.css"></head><body><div class="chart" id="tree-simple"></div>';
    htmlString += '<script src="vendor/raphael.js"></script><script src="Treant.js"></script><script src="sourceTree.js"></script><script>';
    htmlString += 'new Treant( tree );</script></body></html>';

    var components = [];

    loggingLevel > 1 ? console.log('\n>Creating css classes.'):0;

    for (var i in docs){
        var componentName = docs[i].component;
        var currentComponent = { text: {name : componentName} , uid:i};
        var newCSSClass = '.'+componentName+' {color:'+getColor(componentName)+'} ';
        cssString += newCSSClass;
        loggingLevel > 1 ? console.log(newCSSClass):0;
        components.push(currentComponent);
    }

    var newComponents = [];
    loggingLevel > 1 ? console.log('\n>Defining tree structure.'):0;

    const path = require('path');

    for (var i in docs){
        //For every component importing another one
        if(docs[i].imports != null){
            console.log('=====================');
            console.log(docs[i].path.split('\\').slice(0,-1).join('\\'));
            loggingLevel > 1 ? console.log('\n>Found '+docs[i].imports.length+' import(s) on "'+docs[i].component+'".'):0;
            var currentComponent = components.filter(function(value){
                return value.text.name === docs[i].component;
            });
            if(currentComponent === null || currentComponent.length !== 1){
                loggingLevel > 1 ? console.log('Failed to find "'+docs[i].component+'" on component list.'):0;
                continue;
            }
            currentComponent = currentComponent[0];
            var currentComponentName = currentComponent.text.name+currentComponent.uid;
            //For every child/imported component
            var childrenNames = docs[i].imports.map(function(value){
                console.log(docs[i].imports);
                return value.name;
            });
            var childrenComponents = components.filter(function(value){
                return childrenNames.includes(value.text.name);
            });
            if(includeExternals){
                var externalComponents = docs[i].imports.filter(function(value){
                    return !childrenNames.includes(value);
                });
                externalComponents.map(function(value){
                    var externalClone = {
                        text: {
                            name: value.name
                        },
                        uid: components.length+newComponents.length,
                        parent: currentComponentName
                    };
                    var newCSSClass = '.'+value.name+' {color:'+getColor(value.name)+'} ';
                    cssString += newCSSClass;
                    newComponents.push(externalClone);
                    if(loggingLevel > 1) {
                        console.log('"'+value.name+'" added as an external component.');
                        console.log('Created css class: "'+newCSSClass+"'");
                    }
                });
            }
            loggingLevel > 1 ? console.log('Of which '+childrenComponents.length+' is/are (a) source component(s).'):0;
            childrenComponents.map(function(value){
                if (!value.parent){
                    loggingLevel > 1 ? console.log('Adding "'+currentComponent.text.name+'" as parent of "'+value.text.name+'".'):0;
                    value.parent = currentComponentName;
                }else{
                    var childClone = {
                        text: {
                            name: value.text.name
                        },
                        uid: components.length+newComponents.length,
                        parent: currentComponentName
                    };
                    if(loggingLevel > 1) {
                        console.log('"'+value.text.name+'" was already a child of another component.');
                        console.log('Duplicating tree node "'+childClone.text.name+'" with parent "'+currentComponent.text.name+'".');
                    }
                    newComponents.push(childClone);
                }
            });
        }else{
            loggingLevel > 1 ? console.log('Found no imports on "'+docs[i].component+'".'):0;
        }
    }

    loggingLevel > 0 ? console.log('\n>'+(components.length+newComponents.length)+' tree node(s) created.'):0;

    var rootNode = {text: "root"};

    components.forEach(function(value){
        configString += 'var '+ value.text.name + value.uid + '={text:{name:"'+value.text.name+'"},HTMLclass:"'+value.text.name+'"};';
        parentString += value.text.name+ value.uid+'.parent = '+(value.parent ? value.parent : 'rootNode')+';';
        treeString += value.text.name + value.uid+',';
    });

    newComponents.forEach(function(value){
        configString += 'var '+ value.text.name + value.uid + '={text:{name:"'+value.text.name+'"},HTMLclass:"'+value.text.name+'"};';
        parentString += value.text.name+ value.uid+'.parent = '+(value.parent ? value.parent : 'rootNode')+';';
        treeString += value.text.name + value.uid+',';
    });

    configString += 'var rootNode =' + JSON.stringify(rootNode) + ';';
    treeString += 'rootNode];';
    configString += parentString;
    configString += treeString;

    createTreeDirectory(targetDir);
    writeFile(targetDir+'/sourceTree.js',configString,loggingLevel);
    writeFile(targetDir+'/nodeColors.css',cssString,loggingLevel);
    writeFile(targetDir+'/sourceTree.html',htmlString,loggingLevel);
}

exports.generateTreeDoc = generateTreeDoc;
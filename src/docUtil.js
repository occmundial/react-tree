const reactDocs = require('react-docgen');
const importsHandler = require('react-docgen-imports-handler');
const exportsHandler = require('react-docgen-exports-handler');
const resolver = reactDocs.resolver.findExportedComponentDefinition;
const handlers = reactDocs.handlers;

const handlerArray = [importsHandler.default];
handlerArray.push(exportsHandler.default);
for (const key in handlers) {
    const getType ={};
    if(getType.toString.call(handlers[key]) === '[object Function]'){
        handlerArray.push(handlers[key]);
    }
}

const getModuleDoc = (moduleSrc) => {
    try {
        return reactDocs.parse(moduleSrc, resolver, handlerArray);
    } catch (e) {
        return null;
    }
};

module.exports = {
    getModuleDoc: getModuleDoc
};

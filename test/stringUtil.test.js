const stringUtil = require('../src/stringUtil');

describe('getModuleName', () => {
    
    test('Simple name', ()=>{
        var arg = 'react';
        var result = 'react';
        expect(stringUtil.getModuleName(arg,'_')).toEqual(result);
    });

    test('Same folder', ()=>{
        var arg = '.\\react';
        var result = 'react';
        expect(stringUtil.getModuleName(arg,'_')).toEqual(result);
    });

    test('Folder above', ()=>{
        var arg = '..\\react';
        var result = 'react';
        expect(stringUtil.getModuleName(arg,'_')).toEqual(result);
    });

    test('Sibling folder', ()=>{
        var arg = '..\\components\\react';
        var result = 'components_react';
        expect(stringUtil.getModuleName(arg,'_')).toEqual(result);
    });

    test('Different level folder', ()=>{
        var arg = 'src\\containers\\index.js';
        var result = 'src_containers';
        expect(stringUtil.getModuleName(arg,'_')).toEqual(result);
    });

    test('Different level folder', ()=>{
        var arg = '../../src/components/react';
        var result = 'src_components_react';
        expect(stringUtil.getModuleName(arg,'_')).toEqual(result);
    });

});
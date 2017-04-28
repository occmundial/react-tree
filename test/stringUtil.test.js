const stringUtil = require('../src/stringUtil');

describe('getModuleName', () => {
    
    test('Simple name', ()=>{
        var arg = 'react';
        var result = 'react';
        expect(stringUtil.getModuleName(arg,'_')).toEqual(result);
    });

    test('Same folder', ()=>{
        var arg = './react';
        var result = 'react';
        expect(stringUtil.getModuleName(arg,'_')).toEqual(result);
    });

    test('Folder above', ()=>{
        var arg = '../react';
        var result = 'react';
        expect(stringUtil.getModuleName(arg,'_')).toEqual(result);
    });

    test('Sibling folder', ()=>{
        var arg = '../components/react';
        var result = 'components_react';
        expect(stringUtil.getModuleName(arg,'_')).toEqual(result);
    });

    test('Different level folder', ()=>{
        var arg = '../../src/components/react';
        var result = 'src_components_react';
        expect(stringUtil.getModuleName(arg,'_')).toEqual(result);
    });

});

describe('removeChar', ()=>{
    
    test('Removes nothing',()=>{
        var arg = 'react';
        expect(stringUtil.removeChar(arg,'-')).toEqual(arg);
        arg = '';
        expect(stringUtil.removeChar(arg,'-')).toEqual(arg);
    });

    test('Removes single char',()=>{
        var arg = '-';
        var result = '';
        expect(stringUtil.removeChar(arg,'-')).toEqual(result);
        arg = 're-act';
        result = 'react';
        expect(stringUtil.removeChar(arg,'-')).toEqual(result);
        arg = '-react';
        expect(stringUtil.removeChar(arg,'-')).toEqual(result);
        arg = 'react-';
        expect(stringUtil.removeChar(arg,'-')).toEqual(result);
        arg = '-';
        result = '';
        expect(stringUtil.removeChar(arg,'-')).toEqual('');
    });

    test('Removes multiple chars',()=>{
        var arg = '--';
        var result = '';
        expect(stringUtil.removeChar(arg,'-')).toEqual(result);
        arg = 're-ac-t';
        result = 'react';
        expect(stringUtil.removeChar(arg,'-')).toEqual(result);
        arg = '-react-';
        expect(stringUtil.removeChar(arg,'-')).toEqual(result);
        arg = 're-act-';
        expect(stringUtil.removeChar(arg,'-')).toEqual(result);
        arg = '-re-act';
        expect(stringUtil.removeChar(arg,'-')).toEqual(result);
    });

    test('Removes single special char',()=>{
        var arg = '.';
        var result = '';
        expect(stringUtil.removeChar(arg,'.')).toEqual(result);
        arg = 're.act';
        result = 'react';
        expect(stringUtil.removeChar(arg,'.')).toEqual(result);
        arg = '.react';
        expect(stringUtil.removeChar(arg,'.')).toEqual(result);
        arg = 'react.';
        expect(stringUtil.removeChar(arg,'.')).toEqual(result);
    });

    test('Removes multiple special chars',()=>{
        var arg = '..';
        var result = '';
        expect(stringUtil.removeChar(arg,'.')).toEqual(result);
        arg = 're.ac.t';
        result = 'react';
        expect(stringUtil.removeChar(arg,'.')).toEqual(result);
        arg = '.react.';
        expect(stringUtil.removeChar(arg,'.')).toEqual(result);
        arg = 're.act.';
        expect(stringUtil.removeChar(arg,'.')).toEqual(result);
        arg = '.re.act';
        expect(stringUtil.removeChar(arg,'.')).toEqual(result);
    });

});
const fs = require('fs');
const path = require('path');
const utils = require('./libs/utils.js');

const qmlRoot = "qml",
      qmlRootFile = path.join(qmlRoot, "main.qml");

const importRegex = /import\s\"(.*)\"/ig,
      qmldirRegex = /(\w*)\s.*\n*/ig,
      componentRegex = /(\w*\s*\{\n*.*\n*\})/ig;

fs.readFile(qmlRootFile, 'utf8', (err, data) => {
    if (err) throw err;

    
    
    //console.log(data.replace(/[^\s*]{0}[!\{|!\}]{0}\s{2,}/gi, ";"));
    //console.log(data.replace(/\s[!^\{|!^\}]{0}\s{1,}/gi, ";"));
    console.log(data.replace(/\s{2,}\w{0}/gi, ";"));
    
    

    var imports = utils.parse(importRegex, data);
    imports.forEach((importItem) => {
        var qmldir = path.join(qmlRoot, importItem, 'qmldir'); 
        fs.readFile(qmldir, 'utf-8', (err, data) => {
            if (err) throw err;
            var components = utils.parse(qmldirRegex, data);
            console.log(components);
        });
    });
    var items = utils.parse(componentRegex, data);
    console.log(items);
});

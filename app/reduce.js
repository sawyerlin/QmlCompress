const fs = require('fs');
const path = require('path');
const utils = require('./libs/utils.js');

const qmlRoot = "output/qml/src",
      qmlRootFile = path.join(qmlRoot, "main.qml");


const importRegex = /import\s\"(.*)\"/ig,
      qmldirRegex = /(\w*)\s.*\n*/ig,
      componentRegex = /(\w*\s*\{\n*.*\n*\})/ig;

fs.readFile(qmlRootFile, 'utf8', (err, data) => {
    if (err) throw err;
    var imports = utils.parse(importRegex, data);
    console.log(imports);
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

const walk = require('node-file-walker');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const utils = require('./libs/utils.js');

const qmlRoot = process.argv[2] || "buildDir",
      outputRoot = process.argv[3] || "output";

const importRegex = /import\s\"(.*)\"/ig,
      qmldirRegex = /(\w*)\s.*\n*/ig,
      componentRegex = /(\w*\s*\{\n*.*\n*\})/ig,
      compressRegex = /(\s*)(.+)/ig;

var currentDir = qmlRoot,
    currentOutputDir = outputRoot;
walk(qmlRoot, function(dir, files, level) {
    if (dir.indexOf("node_modules") === -1) {
        if (dir.indexOf('.git') === -1)
        files.forEach((fileName, index) => {
            if (fileName[0] !== '.' //&& 
                    //fileName.indexOf("PlayerPage.qml")!== -1
                    ) {
                if (path.extname(fileName).length > 1 || fileName.indexOf('qmldir') !== -1) {
                    var outputRootDir = path.join(outputRoot, dir);
                    mkdirp(outputRootDir, (err) => {
                        if (err) throw err;
                        var currentFile = path.join(dir, fileName),
                            currentOutputFile = path.join(outputRootDir, fileName);
                        if (fileName.indexOf('.qml') !== -1) {
                            fs.readFile(currentFile, 'utf8', (err, data) => {
                                if (err) throw err;
                                fs.writeFile(currentOutputFile, compress(data), {
                                    flag: 'w+'
                                }, (err) => {
                                    if (err) throw err;
                                });
                            });
                        } else {
                            if (fileName[0] !== '.') {
                                fs.createReadStream(currentFile).pipe(fs.createWriteStream(currentOutputFile));
                            } else {
                                console.log(fileStats.name);
                            }
                        }
                    });
                }
            }
        });
    }
});

function compress(data) {
    var compressString = "";
    data.replace(compressRegex, function(match, p1, p2) {
        var p2Test = p2.trim(),
            canAppend = false,
            isMatched = false;
        if (compressString[compressString.length - 1] === "]") {
            canAppend = true;
        }
        if (p2Test[0] === '/' || p2Test[1] === '/') {
            return;
        }
        
        p2.replace(/(.*)[^:]\/\/.*/ig, function(match, p11, p22) {
            isMatched = true;
            compressString += p11;
            if (compressString[compressString.length - 1] !== ";") {
                compressString += ";";
            }
        });
        if (!isMatched) {
            if (compressString[compressString.length - 1] === ";") {
                if ((p2Test[0] === "}" || 
                            p2Test[0] === "." || 
                            p2Test[0] === "'" || 
                            p2Test[0] === "\"" || 
                            p2Test[0] === "+" || 
                            p2Test[0] === "-" || 
                            p2Test[0] === "*" || 
                            p2Test[0] === "/" || 
                            p2Test[0] === "&" || 
                            p2Test[0] === "|" ) && 
                        compressString.slice(compressString.length - 6, compressString.length - 1) !== "break") {
                    compressString = compressString.slice(0, -1);
                }
            } else {
                if (p2Test[0] !== "}" && 
                        p2Test[0] !== "]" && 
                        p2Test[0] !== "," &&
                        canAppend) {
                    p2 = ";" + p2;
                }
            }
            if (p2Test[p2Test.length - 1] !== "{" && 
                    p2Test[p2Test.length - 1] !== "}" && 
                    p2Test[p2Test.length - 1] !== "[" && 
                    p2Test[p2Test.length - 1] !== "]" && 
                    p2Test[p2Test.length - 1] !== ";" && 
                    p2Test[p2Test.length - 1] !== "+" && 
                    p2Test[p2Test.length - 1] !== ",") {
                compressString += p2 + ";";
            } else {
                compressString += p2;
            }
            
        }
    });
    return compressString;
}

/*
 *    fs.readFile(qmlRootFile, 'utf8', (err, data) => {
 *        if (err) throw err;
 *
 *        console.log(compress(data));
 *        var imports = utils.parse(importRegex, data);
 *        imports.forEach((importItem) => {
 *            var qmldir = path.join(qmlRoot, importItem, 'qmldir'); 
 *            fs.readFile(qmldir, 'utf-8', (err, data) => {
 *                if (err) throw err;
 *                var components = utils.parse(qmldirRegex, data);
 *                console.log(components);
 *            });
 *        });
 *        var items = utils.parse(componentRegex, data);
 *        console.log(items);
 *    });
 */

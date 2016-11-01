// Workaround for issue ts-node#168
var fs = require('fs');
var path = require('path');
var tsconfig = require('./tsconfig.json');
var compilerOptions = tsconfig.compilerOptions;

compilerOptions.types = fs.readdirSync(path.resolve(__dirname, 'node_modules', '@types'));

module.exports = compilerOptions; 

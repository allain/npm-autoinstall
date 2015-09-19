#!/usr/bin/env node

var Promise = require('bluebird');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var findMain = require('find-main');

var path = require('path');
var findPackage = require('find-package');
var glob = Promise.promisify(require('glob'));

var autoInstall = require('..');

if (argv.help || argv.h) {
  return fs.createReadStream(__dirname + '/usage.txt').pipe(process.stdout);
}

if (argv._.length) {
  return autoInstall(argv._);
}

var pkg = findPackage(process.cwd(), true);
if (!pkg) {
  return console.error('unable to find package.json');
}

return autoInstall(findMain()).then(function() {
  var packageRoute = path.dirname(pkg.paths.absolute);
  return glob(packageRoute + '/test/**/*.js').then(function(devPaths) {
    devPaths.push(packageRoute + '/test.js');

    return autoInstall(devPaths, {saveDev: true});
  });
}).catch(function(err) {
  return console.error(err.message);
});
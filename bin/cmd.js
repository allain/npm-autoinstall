#!/usr/bin/env node

var Promise = require('bluebird');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var findMain = require('find-main');
var flatten = require('fj-flatten');
var path = require('path');
var findPackage = require('find-package');
var glob = Promise.promisify(require('glob'));
var debug = require('debug')('npm-autoinstaller');

var autoInstall = require('..');

if (argv.help || argv.h) {
  return fs.createReadStream(__dirname + '/usage.txt').pipe(process.stdout);
}

var pkg = findPackage(process.cwd(), true);
if (!pkg) {
  return console.error('unable to find package.json');
}

Promise.props({
  prod: argv._.length ? argv._ : findMain(),
  dev: argv._.length ? [] : findDevPaths()
}).then(function(paths) {
  debug('production paths: %j', paths.prod);
  return autoInstall(paths.prod).then(function() {
    debug('development paths: %j', paths.dev);
    return autoInstall(paths.dev, {saveDev: true});
  });
}).catch(function(err) {
  console.error(err.message);
});

function findDevPaths() {
  var packageRoute = path.dirname(pkg.paths.absolute);
  return Promise.all([
    'test.js',
    glob(packageRoute + '/test/*.js'),
    glob(packageRoute + '/test/**/*.js')
  ]).then(flatten);
}

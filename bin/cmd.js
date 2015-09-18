#!/usr/bin/env node

var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var findMain = require('find-main');
var npmi = require('npmi');

if (argv.help || argv.h) {
  return fs.createReadStream(__dirname + '/usage.txt').pipe(process.stdout);
}

var srcPaths = argv._.length ? argv._ : [findMain()];

require('..')(srcPaths, function (err, installed) {
  if (err) {
    if (err.code === npmi.LOAD_ERR) {
      console.log('npm load error');
    } else if (err.code === npmi.INSTALL_ERR) {
      console.log('npm install error');
    }
    return console.log(err.message);
  }

  if (installed.length) {
    console.log('installed:', installed.join(', '));
  } else {
    console.log('no unmet dependencies');
  }
});


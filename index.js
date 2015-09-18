var detective = require('detective');
var npmi = require('npmi');
var fs = require('fs');
var async = require('async');
var resolve = require('resolve');

module.exports = function (srcPaths, cb) {
  var seen = {};
  var installed = [];

  async.each(srcPaths, function (srcPath, cb) {
    var src = fs.readFileSync(srcPath, 'utf-8');

    async.each(detective(src), function (required, cb) {
      if (required.match(/^[.]/) || seen[required]) return;

      resolve(required, {basedir: process.cwd()}, function(err) {
        if (err) {
          installed.push(required);
          npmi({name: required}, cb);
        } else {
          cb(null);
        }
        seen[required] = true;
      });
    }, cb);
  }, function (err) {
    if (err) return cb(err);

    cb(null, installed);
  });
};
var detective = require('detective');
var npmi = require('npmi');
var fs = require('fs');
var async = require('async');

module.exports = function (srcPaths, cb) {
  var seen = {};
  var installed = [];

  async.each(srcPaths, function(srcPath, cb) {
    var src = fs.readFileSync(srcPath, 'utf-8');

    var missingDepCount = 0;

    async.each(detective(src), function(required, cb) {
      try {
        if (required.match(/^[.]/) || seen[required]) return;

        require(required);
        cb();
      } catch (e) {
        missingDepCount++;
        installed.push(required);
        npmi({name: required}, cb);
      }
      seen[required] = true;
    }, cb);
  }, function(err) {
    if (err) return cb(err);

    cb(null, installed);
  });
};
var Promise = require('bluebird');

var npmi = Promise.promisify(require('npmi'));
var resolve = Promise.promisify(require('resolve'));
var recursiveDeps = require('./lib/recursive-deps.js');

module.exports = function (srcPaths, options, cb) {
  if (!cb && typeof options === 'function') {
    cb = options;
    options = {
      save: true
    };
  }

  var installed = [];

  return recursiveDeps(srcPaths).each(function (required) {
    return resolve(required, {basedir: process.cwd()}).catch(function (err) {
      installed.push(required);
      return npmi({name: required, npmLoad: options});
    });
  }).then(function () {
    return installed;
  });
};


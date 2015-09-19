var Promise = require('bluebird');
var npm = require('npm');

var resolve = Promise.promisify(require('resolve'));

var recursiveDeps = require('recursive-deps');

module.exports = function (srcPaths, options) {
  if (!options) {
    options = {
      save: true
    };
  }

  options.loglevel = 'warn';

  var installed = [];

  return recursiveDeps(srcPaths).each(function (required) {
    return resolve(required, {basedir: process.cwd()}).catch(function () {
      installed.push(required);
      return new Promise(function(resolve, reject) {
        return npm.load(options, function(err) {
          if (err) return reject(err);

          npm.commands.install([required], function(err, data) {
            return err ? reject(err) : resolve(data);
          });
        });
      });
    });
  }).then(function () {
    return installed;
  });
};


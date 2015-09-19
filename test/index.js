var test = require('blue-tape');

var recursiveDeps = require('../lib/recursive-deps');

test('works in simple case', function(t) {
  return recursiveDeps(__dirname + '/fixtures/simple.js').then(function(dependencies) {
    t.deepEqual(dependencies, ['fs', 'events']);
  });
});

test('follows relative requires', function(t) {
  return recursiveDeps(__dirname + '/fixtures/relative.js').then(function(dependencies) {
    t.deepEqual(dependencies, ['fs', 'events']);
  });
});

test('requiring internal path in a package only considers the package',function(t) {
  return recursiveDeps(__dirname + '/fixtures/internal.js').then(function(dependencies) {
    t.deepEqual(dependencies, ['a']);
  });
});

test('missing path yields empty',function(t) {
  return recursiveDeps(__dirname + '/fixtures/missing.js').then(function(dependencies) {
    t.deepEqual(dependencies, []);
  });
});
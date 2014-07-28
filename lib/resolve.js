var fs = require('fs');
var path = require('path');

var extensions = [
  '.js',
  '.json',
  '/index.js'
];

var relativePattern = /^(?:\.\.?\/|\/|([A-Za-z]:)?\\)/;

function resolve(from, to) {
  if (isFilename(to)) {
    var base = path.resolve(from, to);
    if (isFile(base)) {
      return base;
    }

    for (var i = 0; i < extensions.length; i++) {
      var file = base + extensions[i];
      if (isFile(file)) {
        return file;
      }
    }

    return null;
  } else {
    return to;
  }
}

function isFilename(filename) {
  return relativePattern.test(filename);
}

function isFile(file) {
  var stat;
  try {
    stat = fs.statSync(file);
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      return false;
    }
  }

  return stat.isFile() || stat.isFIFO();
}

module.exports = resolve;
module.exports.isFilename = isFilename;

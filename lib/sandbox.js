var path = require('path');
var assign = require('lodash.assign');
var each = require('lodash.foreach');

var SandboxedModule = require('./module');
var resolve = require('./resolve');

function Sandbox(root, options) {
  if (!options) options = {};

  if (root.slice(-1) !== path.sep) root += path.sep;

  this.root = root;
  this.modules = {};
  this.globals = {};
  this.cache = {};

  if (options.modules) {
    each(options.modules, function(id) {
      this.modules[id] = true;
    }, this);
  }

  if (options.shims) {
    each(options.shims, function(exports, id) {
      this.cache[id] = new SandboxedModule(this, id);
      this.cache[id].exports = exports;
    }, this);
  }

  if (options.globals) {
    assign(this.globals, options.globals);
  }
}

Sandbox.prototype.resolve = function(id, parent) {
  var basedir = parent
    ? path.dirname(parent.filename)
    : this.root;

  var filename = resolve(basedir, id);
  if (filename) {
    if (!resolve.isFilename(filename)) {
      if (this.modules[id] || this.cache[id]) {
        return filename;
      }
    } else if (filename.indexOf(this.root) === 0) {
      return filename;
    }
  }

  throw new Error("Cannot load module '" + id + "'");
};

Sandbox.prototype.load = function(id, parent) {
  if (this.modules[id]) {
    return require(id);
  }

  var filename = this.resolve(id, parent);
  var module = this.cache[filename];
  if (module) {
    return module.exports;
  }

  module = this.cache[filename] = new SandboxedModule(this, filename, parent);
  try {
    module.compile();
  } catch (err) {
    delete this.cache[path];
    throw err;
  }

  return module.exports;
};

Sandbox.prototype.filename = function(filename) {
  var ns = path.basename(this.root);
  return 'vm:' + ns + '/' + path.relative(this.root, filename);
};

module.exports = Sandbox;

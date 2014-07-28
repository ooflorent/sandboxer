var fs = require('fs');
var path = require('path');
var vm = require('vm');
var assign = require('lodash.assign');
var each = require('lodash.foreach');

function SandboxedModule(sandbox, id, parent) {
  this.sandbox = sandbox;
  this.id = id;
  this.filename = id;
  this.parent = parent;
  this.children = [];
  this.exports = Object.create(null);

  if (parent) {
    parent.children.push(this);
  }
}

SandboxedModule.prototype.resolve = function(target) {
  return this.sandbox.resolve(target, this);
};

SandboxedModule.prototype.require = function(target) {
  return this.sandbox.load(target, this);
};

SandboxedModule.prototype.compile = function() {
  if (/\.json$/.test(this.filename)) {
    this.exports = require(this.filename);
    return;
  }

  var content = fs.readFileSync(this.filename, 'utf8');
  var context = {};

  each(this.sandbox.globals, function(value, key) {
    context[key] = value;
  });

  var req = this.require.bind(this);
  req.resolve = this.resolve.bind(this);

  assign(context, {
    __filename: this.filename,
    __dirname: path.dirname(this.filename),
    global: context,
    require: req,
    module: this,
    exports: this.exports,
  });

  vm.runInNewContext(content, context, {
    filename: this.sandbox.filename(this.filename),
    displayErrors: false,
  });
};

module.exports = SandboxedModule;

var path = require('path');
var should = require('should');

var Sandbox = require('../lib/sandbox');
var basedir = path.join(__dirname, 'fixtures', 'sandbox');

describe('Sandbox', function() {
  it('should load local module', function() {
    var sandbox = new Sandbox(basedir);
    sandbox.load('./export1');
  });

  it('should export', function() {
    var sandbox = new Sandbox(basedir);
    should(sandbox.load('./export1')).eql({obj: 1});
    should(sandbox.load('./export2')).eql({obj: 1});
  });

  it('should access globals', function() {
    var sandbox = new Sandbox(basedir, {
      globals: {
        sandbox: true
      }
    });

    should(sandbox.load('./globals1')).equal('boolean');
  });

  it('should load exposed modules', function() {
    var sandbox = new Sandbox(basedir, {
      modules: ['path']
    });

    should(sandbox.load('./import1')).be.ok;
    should(sandbox.load.bind(sandbox, './import2')).throw();
  });

  it('should load shimed modules', function() {
    var sandbox = new Sandbox(basedir, {
      shims: {
        fs: {}
      }
    });

    should(sandbox.load.bind(sandbox, './import1')).throw();
    should(sandbox.load('./import2')).be.ok;
  });

  it('should load sandboxed modules', function() {
    var sandbox = new Sandbox(basedir);
    should(sandbox.load('./import3')).eql({obj: 1});
  });

  it('should not load modules outside the sandbox', function() {
    var sandbox = new Sandbox(basedir);
    should(sandbox.load.bind(sandbox, '../resolve/export1')).throw();
  });

  it('should hide directory structure', function() {
    var sandbox = new Sandbox(basedir);
    var err;
    try {
      sandbox.load('./import1.js');
    } catch (e) {
      err = e;
    }

    should(err).be.an.Error;
    should(err.stack).containEql('vm:sandbox/import1.js');
    should(err.stack).not.containEql('fixtures');
  });
});

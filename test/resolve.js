var path = require('path');
var should = require('should');

var resolve = require('../lib/resolve');
var basedir = path.join(__dirname, 'fixtures', 'resolve');

describe('resolve()', function() {
  it('should not resolve modules', function() {
    resolve(basedir, 'some_module').should.equal('some_module');
    resolve(basedir, 'some_module/test').should.equal('some_module/test');
  });

  it('should resolve files with extension', function() {
    resolve(basedir, './export1.js').should.endWith('export1.js');
    resolve(basedir, './export2.json').should.endWith('export2.json');
    resolve(basedir, './export3/index.js').should.endWith('export3/index.js');
  });

  it('should resolve files without extension', function() {
    resolve(basedir, './export1').should.endWith('export1.js');
    resolve(basedir, './export2').should.endWith('export2.json');
    resolve(basedir, './export3').should.endWith('export3/index.js');
  });

  it('should fail when a file does not exist', function() {
    should(resolve(basedir, './fail')).not.be.ok;
  });
});

describe('resolve.isFilename()', function() {
  it('should detect filenames', function() {
    resolve.isFilename('/some_module').should.be.ok;
    resolve.isFilename('./some_module').should.be.ok;
    resolve.isFilename('../some_module').should.be.ok;
    resolve.isFilename('c:\\some_module').should.be.ok;
  });

  it('should detect modules', function() {
    resolve.isFilename('some_module').should.not.be.ok;
    resolve.isFilename('some/module').should.not.be.ok;
    resolve.isFilename('some.module').should.not.be.ok;
  });
});

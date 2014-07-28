# sandboxer

## Install

```bash
$ npm install --save sandboxer
```


## Usage

```js
var Sandbox = require('sandboxer');
var sandbox = new Sandbox(__dirname, {
  modules: [
    'path',
    'url'
  ],
  globals: {
    sandbox: true
  }
});

sandbox.load('./something');
```

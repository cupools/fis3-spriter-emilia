#fis3-spriter-emilia

> Base on emilia, support rem.

## Install

```bash
npm install --save-dev fis3-spriter-emilia
```

## Usage

```js
fis.match('::package', {
    spriter: 'emilia'
});

fis.config.set('settings.spriter.emilia', {
    src: ['*.css'],
    dest: './components/css/',
    output: './components/images/',
    cssPath: '../components/images/',
    prefix: 'sprite-',
    algorithm: 'binary-tree',
    padding: 10,
    unit: 'px',
    convert: 1,
    quiet: false
});
```
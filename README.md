#fis3-spriter-emilia

> Base on [Emilia](https://github.com/cupools/emilia), supports rem, supports inline, supports output multiple sprite pictures according to different sprite marks.

`Emilia` gets stylesheet files and recognizes sprite mark like `url(a.png?__sprite)`, finally output updated stylesheet files as well as sprite pictures. It supports `rem` and `px`, also supports numerical conversion.

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
    dest: './components/css/',
    output: './components/images/',
    prefix: 'sprite-',
    algorithm: 'binary-tree',
    padding: 10,
    unit: 'px',
    convert: 1,
    quiet: true
});
```

## Examples

```css
/*    origin stylesheet    */
.icon0 {
  background: #ccc url(../images/0.png?__icon) no-repeat;
  background-size: 128px 128px;
}
.icon2 {
  background: url(../images/2.png?__icon) no-repeat;
  background-size: 50px 50px;
}

/*    result stylesheet    */
.icon0 {
  background: #ccc url(../images/sprite-icon.png) no-repeat;
  background-position: 0rem 0rem;
  background-size: 22.875rem 16rem;
}
.icon2 {
  color: #ccc;
  background: url(../images/sprite-icon.png) no-repeat;
  background-position: -16.625rem 0rem;
  background-size: 22.875rem 16rem;
}
```
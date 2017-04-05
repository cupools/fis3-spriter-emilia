'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _emilia = require('emilia');

var _emilia2 = _interopRequireDefault(_emilia);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-param-reassign */
/* global fis */

function main(ret, conf, settings) {
  var src = [];

  fis.util.map(ret.src, function (subpath, file) {
    if (file.isCssLike) {
      src.push(file.subpath);
    }
  });

  src = src.map(function (p) {
    return _path2.default.join('.', p);
  });

  var options = Object.assign({
    src: src
  }, settings);
  var emilia = new _emilia2.default(options);

  inject(emilia, ret);

  emilia.run();
}

function inject(emilia, ret) {
  emilia.initStyle = function (p) {
    var File = emilia.File;
    var realpath = _path2.default.resolve(process.cwd(), p);
    var node = getSrc(ret, realpath);

    return File.wrap({
      node: node,
      realpath: realpath,
      type: 'STYLE',
      content: node.getContent()
    });
  };

  var storage = {};
  emilia._getImageRealpath = function (url) {
    var realpath = null;

    if (storage[url]) {
      realpath = storage[url];
    } else {
      var src = getSrc(ret, url, 'url');
      realpath = src ? src.realpath : null;
      storage[url] = realpath;
    }

    return realpath;
  };

  emilia.outputStyle = function (file) {
    file.node.setContent(file.content);
  };

  emilia.outputSprite = function (file) {
    var realpath = _path2.default.resolve(process.cwd(), file.path);
    var image = fis.file.wrap(realpath);

    image.useCache = false;
    image.setContent(file.content);
    fis.compile.process(image);
    ret.pkg[file.path] = image;

    file.url = image.url;
  };
}

function getSrc(ret, val) {
  var field = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'realpath';

  var src = ret.src;
  var keys = Object.keys(src);
  var image = null;

  field = field || 'realpath';

  keys.forEach(function (key) {
    var f = src[key];
    if (_path2.default.normalize(f[field]) === _path2.default.normalize(val)) {
      image = f;
    }
  });

  return image;
}

exports.default = main;
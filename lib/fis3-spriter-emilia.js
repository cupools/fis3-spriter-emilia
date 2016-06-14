/* global fis */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (ret, conf, settings) {
    var src = [];

    fis.util.map(ret.src, function (subpath, file) {
        if (file.isCssLike) {
            src.push(file.subpath);
        }
    });

    src = src.map(function (p) {
        return _path2.default.join('.', p);
    });

    var emilia = new _emilia2.default(Object.assign({
        src: src
    }, settings));

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

    emilia._getImageRealpath = function (url) {
        var img = getSrc(ret, url, 'url');
        return img && img.realpath;
    };

    emilia.outputStyle = function (file) {
        file.node.setContent(file.content);
    };

    emilia.outputSprite = function (file) {
        var realpath = _path2.default.resolve(process.cwd(), file.path);
        var image = fis.file.wrap(realpath);

        image.setContent(file.content);
        fis.compile.process(image);
        ret.pkg[file.path] = image;

        file.url = image.url;
    };

    emilia.run();
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _emilia = require('emilia');

var _emilia2 = _interopRequireDefault(_emilia);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getSrc(ret, val, field) {
    var src = ret.src;
    var keys = Object.keys(src);
    var image = null;

    field = field || 'realpath';

    keys.map(function (key) {
        var f = src[key];
        if (f[field] === val) {
            image = f;
        }
    });

    return image;
}
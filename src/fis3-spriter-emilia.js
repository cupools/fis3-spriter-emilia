/* global fis */

'use strict';

import path from 'path';
import Emilia from 'emilia';

function main(ret, conf, settings) {

    let src = [];

    fis.util.map(ret.src, function(subpath, file) {
        if (file.isCssLike) {
            src.push(file.subpath);
        }
    });

    src = src.map(p => path.join('.', p));

    let options = Object.assign({src}, settings);
    let emilia = new Emilia(options);

    inject(emilia, ret);

    emilia.run();
}

function inject(emilia, ret) {
    emilia.initStyle = function(p) {
        let File = emilia.File;
        let realpath = path.resolve(process.cwd(), p);
        let node = getSrc(ret, realpath);

        return File.wrap({
            node,
            realpath,
            type: 'STYLE',
            content: node.getContent(),
        });
    };

    let storage = {};
    emilia._getImageRealpath = function(url) {
        let realpath = null;

        if(storage[url]) {
            realpath = storage[url];
        } else {
            let src = getSrc(ret, url, 'url');
            realpath = src ? src.realpath : null;
            storage[url] = realpath;
        }

        return realpath;
    };

    emilia.outputStyle = function(file) {
        file.node.setContent(file.content);
    };

    emilia.outputSprite = function(file) {
        let realpath = path.resolve(process.cwd(), file.path);
        let image = fis.file.wrap(realpath);

        image.useCache = false;
        image.setContent(file.content);
        fis.compile.process(image);
        ret.pkg[file.path] = image;

        file.url = image.url;
    };
}

function getSrc(ret, val, field='realpath') {
    let src = ret.src;
    let keys = Object.keys(src);
    let image = null;

    field = field || 'realpath';

    keys.map(key => {
        let f = src[key];
        if(f[field] === val) {
            image = f;
        }
    });

    return image;
}

export default main;
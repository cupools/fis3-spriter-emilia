/* global fis */

'use strict';

import path from 'path';
import Emilia from 'emilia';

export default function(ret, conf, settings) {
    let src = [];

    fis.util.map(ret.src, function(subpath, file) {
        if (file.isCssLike) {
            src.push(file.subpath);
        }
    });

    src = src.map(p => path.join('.', p));

    let emilia = new Emilia(Object.assign({
        src: src
    }, settings));

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

    emilia._getImageRealpath = function(url) {
        let img = getSrc(ret, url, 'url');
        return img && img.realpath;
    };

    emilia.outputStyle = function(file) {
        file.node.setContent(file.content);
    };

    emilia.outputSprite = function(file) {
        let realpath = path.resolve(process.cwd(), file.path);
        let image = fis.file.wrap(realpath);
        
        image.setContent(file.content);
        fis.compile.process(image);
        ret.pkg[file.path] = image;

        file.url = image.url;
    };

    emilia.run();
}

function getSrc(ret, val, field) {
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
/* eslint-disable no-param-reassign */
/* global fis */


import path from 'path'
import Emilia from 'emilia'

function main(ret, conf, settings) {
  let src = []

  fis.util.map(ret.src, (subpath, file) => {
    if (file.isCssLike) {
      src.push(file.subpath)
    }
  })

  src = src.map(p => path.join('.', p))

  const options = Object.assign({
    src
  }, settings)
  const emilia = new Emilia(options)

  inject(emilia, ret)

  emilia.run()
}

function inject(emilia, ret) {
  emilia.initStyle = function (p) {
    const File = emilia.File
    const realpath = path.resolve(process.cwd(), p)
    const node = getSrc(ret, realpath)

    return File.wrap({
      node,
      realpath,
      type: 'STYLE',
      content: node.getContent()
    })
  }

  const storage = {}
  emilia._getImageRealpath = function (url) {
    let realpath = null

    if (storage[url]) {
      realpath = storage[url]
    } else {
      const src = getSrc(ret, url, 'url')
      realpath = src ? src.realpath : null
      storage[url] = realpath
    }

    return realpath
  }

  emilia.outputStyle = function (file) {
    file.node.setContent(file.content)
  }

  emilia.outputSprite = function (file) {
    const realpath = path.resolve(process.cwd(), file.path)
    const image = fis.file.wrap(realpath)

    image.useCache = false
    image.setContent(file.content)
    fis.compile.process(image)
    ret.pkg[file.path] = image

    file.url = image.url
  }
}

function getSrc(ret, val, field = 'realpath') {
  const src = ret.src
  const keys = Object.keys(src)
  let image = null

  field = field || 'realpath'

  keys.forEach(key => {
    const f = src[key]
    if (path.normalize(f[field]) === path.normalize(val)) {
      image = f
    }
  })

  return image
}

export default main

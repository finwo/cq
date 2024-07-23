#!/usr/bin/env node

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import fs         from 'fs';
import esbuild    from 'esbuild';
//import glob       from 'fast-glob';

//const entryPoints = glob.sync('./src/main.ts')
//  .sort()
//  .reduce((r, a) => ({
//    ...r,
//    ...(
//      a.substr(0,1) == '.' ?
//        { [a.substr(6).substr(0,a.length - 9)]: __dirname + '/' + a } :
//        { [a]: __dirname + `/node_modules/${a}.ts` }
//    )
//  }), {})

const entryPoints = {
  //'import-mithril': __dirname + '/src/import-mithril.ts',
  'main': __dirname + '/src/main.ts',
};

const config = {
  format: 'cjs',
  platform: 'browser',
  target: ['chrome108','firefox107'],
  mainFields: ['browser','module','main'],
  bundle: true,
  outdir: __dirname + '/www',
  entryPoints: Object.values(entryPoints),
  //entryPoints,
  minify: false,

  jsxFactory     : 'm',
  jsxFragment    : '"["',

  //alias: {
  //  'fs'  : 'browserify-fs',
  //  'path': 'path-browserify',
  //},

  //inject: [
  //  __dirname + '/src/inject/web-buffer.ts'
  //],

  loader: {
    '.eot'  : 'dataurl',
    '.html' : 'text',
    '.wasm' : 'dataurl',
    '.png'  : 'dataurl',
    '.svg'  : 'dataurl',
    '.ttf'  : 'dataurl',
    '.woff' : 'dataurl',
    '.woff2': 'dataurl',
  },
};

    //"jsxFactory"         : "m",
    //"jsxFragmentFactory" : "m.Fragment",

const buildList = [];
const styles    = ['global.css'];

esbuild
  .build(config)
  .then(() => {
    fs.copyFileSync(`./src/global.css`, `./www/global.css`);

    for(const name of Object.keys(entryPoints)) {
      buildList.push(`${name}.js`);
      try {
        fs.statSync(config.outdir + `/${name}.css`);
        styles.push(`${name}.css`);
      } catch(e) {
        // Intentionally empty
      }
    }

//    fs.writeFileSync(config.outdir + `/index.html`, `<!DOCTYPE html>
//<html>
//  <head>
//    <meta charset="utf-8">
//    <meta name="viewport" content="width=device-width,initial-scale=1">
//    ${styles.map(name => `<link rel="stylesheet" href="${name}"/>`).join('\n    ')}
//  </head>
//  <body>
//    ${buildList.map(name => `<script defer src="${name}"></script>`).join('\n    ')}
//  </body>
//</html>
//`);

    const floaticonSize = 'min(25vw,25vh)';
    fs.writeFileSync(config.outdir + `/index.html`, `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    ${styles.map(path => `<style type="text/css">${fs.readFileSync(`${config.outdir}/${path}`,'utf-8')}</style>`).join('\n    ')}
  </head>
  <body>

    <!-- Should be overwritten by mounting app on body -->
    <div id="floaticon">
      <style>
        #floaticon {
          background: #FFF;
          position: fixed;
          width: 100vw;
          height: 100vh;
          padding-top: calc(50vh - (${floaticonSize} / 2));
          text-align: center;
          top: 0;
          transition: opacity 300ms;
          opacity: 1;
        }
        #floaticon > img {
          max-height: ${floaticonSize};
        }
        #floaticon.fade {
          opacity: 0;
        }
      </style>
      <img src="img/logo.png">
    </div>


    ${buildList.map(path => `<script type="text/javascript">${fs.readFileSync(`${config.outdir}/${path}`,'utf-8')}</script>`).join('\n    ')}
    <script src="cordova.js"></script>
  </body>
</html>
`);

    // Remove unneeded files after bundling
    for(const fname of [...buildList, ...styles]) {
      fs.unlinkSync(`${config.outdir}/${fname}`);
    }

  })

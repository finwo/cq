#!/usr/bin/env node

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import cpy        from 'cpy';
import fs         from 'fs';
import esbuild    from 'esbuild';

const entryPoints = {
  'main': __dirname + '/src/main.ts',
};

const config = {
  format: 'esm',
  platform: 'browser',
  target: ['chrome108','firefox107'],
  mainFields: ['browser','module','main'],
  bundle: true,
  outdir: __dirname + '/dist',
  entryPoints: Object.values(entryPoints),
  minify: false,

  jsxFactory     : 'm',
  jsxFragment    : '"["',

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

const buildList = [];
const styles    = ['AppModule/global.css'];

esbuild
  .build(config)
  .then(async () => {

    try { fs.mkdirSync('./dist/assets'); } catch { /* empty */ }
    const r = await cpy(__dirname + '/src/assets/*', __dirname + '/dist/assets');

    try { fs.mkdirSync('./dist/AppModule'); } catch { /* empty */ }
    fs.copyFileSync(`./src/AppModule/global.css`, `./dist/AppModule/global.css`);

    for(const name of Object.keys(entryPoints)) {
      buildList.push(`${name}.js`);
      try {
        fs.statSync(config.outdir + `/${name}.css`);
        styles.push(`${name}.css`);
      } catch(e) {
        // Intentionally empty
      }
    }

    const floaticonSize = 'min(25vw,25vh)';
    fs.writeFileSync(config.outdir + `/index.html`, `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    ${styles.map(name => `<link rel="stylesheet" href="${name}"/>`).join('\n    ')}
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
      <img src="assets/logo.png">
    </div>

    ${buildList.map(name => `<script type="module" src="${name}"></script>`).join('\n    ')}
  </body>
</html>
`);

  })

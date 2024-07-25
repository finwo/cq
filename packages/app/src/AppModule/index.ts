import "@fontsource/nunito/400.css";
(new Function('return this;'))().m = require('mithril');

import screenMain from './screen/main';
const navi = {
  "/main": screenMain,
};

// And finally initialize the views of the app
// Floaticon is side-effect from esbuild.mjs
const ficon = document.getElementById('floaticon');
m.route(document.body, "/main", navi);
document.body.appendChild(ficon);
setTimeout(() => {
    ficon.className = 'fade'
    setTimeout(() => ficon.parentElement.removeChild(ficon), 400);
}, 100);

import { Container } from '@finwo/di';
import { SessionRepository } from '../CoreModule/repository/session';

const repo = Container.get(SessionRepository);
(async () => {
  console.log(await repo.allSessions());
})();

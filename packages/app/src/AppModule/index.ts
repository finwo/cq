import "@fontsource/nunito/400.css";
(new Function('return this;'))().m = require('mithril');

import screenMain         from './screen/main';
import screenAuthLogin    from './screen/auth/login';
import screenAuthRegister from './screen/auth/register';
const navi = {
  "/main"         : screenMain,
  "/auth/login"   : screenAuthLogin,
  "/auth/register": screenAuthRegister,
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

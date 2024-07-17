(new Function('return this;'))().m = require('mithril');
import "@fontsource/nunito/400.css";

import screenMain from './screen/main';

m.route(document.body, "/main", {
  "/main"  : screenMain,
});

console.log('hello world');

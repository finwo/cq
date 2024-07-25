import './register.css';

import { Container } from '@finwo/di';
import { SessionRepository } from '../../../CoreModule/repository/session';
import { generateMnemonic } from 'bip39';

function gotoLogin() {
  document.location.href = m.route.prefix + '/auth/login';
}

export default {
  mnemonic: '',

  oninit(vnode) {
    vnode.state.mnemonic = generateMnemonic();
  },
  view(vnode) {
    return (
      <form id="registerPage">
        <div style={{ display: 'inline-block', textAlign: 'left', maxWidth: 'min(40em, calc(100vw - 10em))' }}>
          <label for="seed">Seed</label><br/>
          <p style={{ fontFamily: 'monospace' }}>
            {vnode.state.mnemonic}
          </p>
        </div>
        {/* <br/> */}
        {/* <button type="submit">register</button> */}
        <br/><br/>
        <small onclick={gotoLogin} class="onclick">Use existing identity</small>
      </form>
    );
  }
}

// <li><b>finwo</b><br/><small>default identity</small></li>
// <li><b>Yersa Nordman</b><br/><small>personal identity</small></li>

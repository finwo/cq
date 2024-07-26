import './register.css';

import { Container } from '@finwo/di';
import { SessionRepository } from '../../../CoreModule/repository/session';
import { generateMnemonic } from 'bip39';
import { KeyPair } from 'supercop';

export default {
  mnemonic: '',
  step: 'generate',
  error: '',
  name: '',

  handleVerify(vnode, ev) {
    const verifyContent = document.getElementById('seed').value;
    if (vnode.state.mnemonic != verifyContent) {
      vnode.state.error = 'Mnemonics do not match!';
      return;
    }

    vnode.state.error = '';
    vnode.state.step  = 'name';
  },

  oninit(vnode) {
    vnode.state.mnemonic = generateMnemonic();
  },
  view(vnode) {
    switch(vnode.state.step) {
      case 'generate':
        return (
          <div id="registerPage">
            <div style={{ display: 'inline-block', textAlign: 'left', maxWidth: 'min(40em, calc(100vw - 10em))' }}>
              <label for="seed">Seed</label><br/>
              <p style={{ fontFamily: 'monospace' }}>
                {vnode.state.mnemonic}
              </p>
            </div>
            <br/>
            <button onclick={() => vnode.state.step='verify'}>Next</button>
            <br/><br/>
            <a href={m.route.prefix + '/auth/login'} class="small">Use existing identity</a>
          </div>
        );
      case 'verify':
        return (
          <form id="registerPage" onsubmit={() => vnode.state.handleVerify(vnode)}>
            <div style={{ display: 'inline-block', textAlign: 'left' }}>
              <label for="seed">Verify seed</label><br/>
              <input id="seed" type="text" autofocus/>
            </div>
            <br/>
            <span class="error">{vnode.state.error}</span>
            <br/>
            <button type="submit">Verify</button>&nbsp;&nbsp;
            <button onclick={() => vnode.state.step='generate'}>Back</button>
          </form>
        );
      case 'name':
        return (
          <form id="registerPage" onclick={ev => vnode.state.handleVerify(vnode, ev)}>
            <div style={{ display: 'inline-block', textAlign: 'left' }}>
              <label for="identityName">Identity name</label><br/>
              <input id="identityName" type="text"/>
            </div>
            <br/>
            <br/>
            <button type="submit">Next</button>
          </form>
        );
      default:
        return (
          <div id="registerPage">
            Something went wrong!
          </div>
        );
    }
  }
}

// <li><b>finwo</b><br/><small>default identity</small></li>
// <li><b>Yersa Nordman</b><br/><small>personal identity</small></li>

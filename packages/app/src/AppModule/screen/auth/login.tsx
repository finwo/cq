import './login.css';

import { Container } from '@finwo/di';
import { SessionRepository } from '../../../CoreModule/repository/session';

export default {
  sessions: [],

  async oninit(vnode) {
    // // console.log(this.sessions);
    // await Container.whenDefined(SessionRepository);
    // const sessionRepository = Container.get(SessionRepository);
    // // console.log(JSON.parse(JSON.stringify(vnode)));
    // vnode.state.sessions = await sessionRepository.allSessions();
    //
    // if (!vnode.state.sessions.length) {
    //   document.location.href = m.route.prefix + '/auth/register';
    //   return;
    // }
    //
    // m.redraw();
  },
  view(vnode) {
    return (
      <form id="loginPage">
        <div style={{ display: 'inline-block', textAlign: 'left' }}>
          <label for="seed">Seed</label><br/>
          <textarea id="seed"></textarea>
        </div>
        <br/>
        <button type="submit">Login</button>
        <br/><br/>
        <a href={m.route.prefix + '/auth/register'} class="small">Create new identity</a>
      </form>
    );
  }
}

// <li><b>finwo</b><br/><small>default identity</small></li>
// <li><b>Yersa Nordman</b><br/><small>personal identity</small></li>

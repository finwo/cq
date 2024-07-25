import './switcher.css';

import { Container } from '@finwo/di';
import { SessionRepository } from '../../../CoreModule/repository/session';

export default {
  sessions: [],

  async oninit(vnode) {
    // console.log(this.sessions);
    await Container.whenDefined(SessionRepository);
    const sessionRepository = Container.get(SessionRepository);
    // console.log(JSON.parse(JSON.stringify(vnode)));
    vnode.state.sessions = await sessionRepository.allSessions();

    if (!vnode.state.sessions.length) {
      document.location.href = m.route.prefix + '/auth/register';
      return;
    }

    m.redraw();
  },
  view(vnode) {
    return (
      <div id="switcherPage">
        <ul id="sessionList">
          {vnode.state.sessions.map(session => (
            <li><b>{session.name || 'Nameless session'}</b><br/><small>{session.description || 'no description'}</small></li>
          ))}
        </ul>
        <br/>
        <small >Different identity</small>
      </div>
    );
  }
}

// <li><b>finwo</b><br/><small>default identity</small></li>
// <li><b>Yersa Nordman</b><br/><small>personal identity</small></li>

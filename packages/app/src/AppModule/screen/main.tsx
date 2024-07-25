import { Capacitor } from '@capacitor/core';
import { Container } from '@finwo/di';
import { SessionRepository } from '../../CoreModule/repository/session';

export default {
  async oninit() {
    await Container.whenDefined(SessionRepository);
    const repository     = Container.get(SessionRepository);

    const allSessions = await repository.allSessions();
    if (!allSessions.length) {
      document.location.href = m.route.prefix + '/auth/login';
      return;
    }

    const currentSession = await repository.getSession('current');
    if (!currentSession) {
      document.location.href = m.route.prefix + '/auth/switcher';
      return;
    }

    console.log({ currentSession });
  },
  view() {
    return <div>
      <br/><br/>
        Hello world, from {Capacitor.getPlatform()}!
      </div>
      ;
  }
}

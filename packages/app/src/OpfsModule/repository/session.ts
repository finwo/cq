import { Buffer } from 'buffer';
import { Session } from '../../CoreModule/model/session';
import { SessionRepository } from '../../CoreModule/repository/session';
import { chainedStorage } from '../driver';

export class OpfsSessionRepository extends SessionRepository {
  async allSessions(): Promise<Session[]> {
    const entries = await chainedStorage()
      .directory('sessions')
      .values();
    const sessions = [];
    for(const handle of entries) {
      const file = await handle.getFile();
      sessions.push(JSON.parse(Buffer.from(await file.arrayBuffer())));
    }
    return sessions;
  }
}

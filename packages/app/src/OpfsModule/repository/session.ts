import { Buffer } from 'buffer';
import { Session } from '../../CoreModule/model/session';
import { SessionRepository } from '../../CoreModule/repository/session';
import { chainedStorage } from '../driver';

export class OpfsSessionRepository extends SessionRepository {

  async allSessions(): Promise<Session[]> {

    const entries = await chainedStorage()
      .directory('sessions')
      .values();
    if (entries instanceof Error) return [];
    const sessions = [];
    for(const handle of entries) {
      const file = await handle.getFile();
      sessions.push(JSON.parse(Buffer.from(await file.arrayBuffer())));
    }
    return sessions;

  }

  async getSession(identifier: string): Promise<Session|undefined> {
    let contents = await chainedStorage()
        .directory('sessions')
        .get(identifier);
    if (contents instanceof Error) return undefined;
    return JSON.parse(contents);
  }
}

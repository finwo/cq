import { Session } from '../model/session';

export abstract class SessionRepository {
  abstract allSessions(): Promise<Session[]>;
}

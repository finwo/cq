import { Container } from '@finwo/di';

import { SessionRepository } from '../CoreModule/repository/session';
import { OpfsSessionRepository } from './repository/session';
Container.set(SessionRepository, new OpfsSessionRepository());

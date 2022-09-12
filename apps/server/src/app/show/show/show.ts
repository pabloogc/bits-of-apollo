import { ID } from 'core/scalars';

export enum ShowState {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface Show {
  id: ID;
  ownerID: ID;
  state: ShowState;
}

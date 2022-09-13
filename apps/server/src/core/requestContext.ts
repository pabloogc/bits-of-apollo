import { User } from 'app/auth/user';

/**
 * Context passed during graphql execution
 */
export interface RequestContext {
  user: User;
}

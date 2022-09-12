/**
 * Context passed during graphql execution
 */
import { User } from 'app/auth/user';

export interface RequestContext {
  user: User;
}

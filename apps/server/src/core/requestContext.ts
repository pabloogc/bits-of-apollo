/**
 * Context passed during graphql execution
 */
import {User} from "app/user/user";

export interface RequestContext {
  user: User;
}

import {ID} from "core/scalars";
import {gql} from "apollo-server";


export const productTypeDef = gql`
  type Product {
    id: ID!
    name: String!
  }

  input ProductInput {
    name: String
  }
`;

export interface ProductInput {
  name: string;
}


export class Product {
  id: ID;
}

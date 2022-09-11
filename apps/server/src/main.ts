import "reflect-metadata";

import {ApolloServer} from "apollo-server";
import {ApolloServerPluginLandingPageLocalDefault} from "apollo-server-core";
import {showResolver} from "app/show/show/showResolver";
import {auctionTypeDef} from "app/show/auction/auction";
import {showTypeDef} from "app/show/show/show";
import {productTypeDef} from "app/show/product/product";
import {userTypeDef} from "app/user/user";
import {baseTypeDef} from "core/baseSchema";

const server = new ApolloServer({
  typeDefs: [baseTypeDef, showTypeDef, auctionTypeDef, productTypeDef, userTypeDef],
  //resolvers: resolvers,
  resolvers: [showResolver],
  csrfPrevention: true,
  cache: "bounded",
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({embed: true}),
  ],
});

server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url}`);
});

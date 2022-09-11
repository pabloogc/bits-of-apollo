import "reflect-metadata";

import {ApolloServer} from "apollo-server";
import {ApolloServerPluginLandingPageLocalDefault} from "apollo-server-core";
import {showResolver} from "app/show/show/showResolver";
import {auctionTypeDef} from "app/show/auction/auction";
import {showTypeDef} from "app/show/show/show";
import {productTypeDef} from "app/show/product/product";
import {userTypeDef} from "app/user/user";
import {baseTypeDef} from "core/baseSchema";
import {RequestContext} from "core/requestContext";

const server = new ApolloServer({
  typeDefs: [baseTypeDef, showTypeDef, auctionTypeDef, productTypeDef, userTypeDef],
  //resolvers: resolvers,
  resolvers: [showResolver],
  csrfPrevention: true,
  cache: "bounded",
  context: ({req}) => {
    // Fake authentication, just grab whatever comes in the authorization header
    // as a valid user ID, in practice here there should be a token validation
    // and a following query to retrieve said user information
    const userId = req.headers.authorization ?? "Anonymous";
    const ctx: RequestContext = {
      user: {
        id: userId,
      },
    };
    return ctx;
  },
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({embed: true}),
  ],
});

server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url}`);
});

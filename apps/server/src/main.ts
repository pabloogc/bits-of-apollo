import 'reflect-metadata';

import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import { showResolver } from 'app/show/show/showResolver';
import { userTypeDef } from 'app/auth/user';
import { baseTypeDef } from 'core/baseTypeDef';
import { RequestContext } from 'core/requestContext';
import { Container } from 'typedi';
import { ShowService } from 'app/show/show/showService';
import { auctionResolver } from 'app/show/auction/auctionResolver';
import { AuctionService } from 'app/show/auction/auctionService';
import { createServer } from 'http';
import express from 'express';
import { WebSocketServer } from 'ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { useServer } from 'graphql-ws/lib/use/ws';
import { productTypeDef } from 'app/show/product/productTypeDef';
import { auctionTypeDef } from 'app/show/auction/auctionTypeDef';
import { showTypeDef } from 'app/show/show/showTypeDef';

const schema = makeExecutableSchema({
  typeDefs: [
    baseTypeDef,
    showTypeDef,
    auctionTypeDef,
    productTypeDef,
    userTypeDef,
  ],
  resolvers: [showResolver, auctionResolver],
});

const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

const serverCleanup = useServer({ schema }, wsServer);

const apolloServer = new ApolloServer({
  schema: schema,
  csrfPrevention: true,
  cache: 'bounded',
  context: ({ req }) => {
    // Fake authentication, just grab whatever comes in the authorization header
    // as a valid user ID, in practice here there should be a token validation
    // and a following query to retrieve said user information
    const userId = req.headers.authorization ?? 'Anonymous';
    const ctx: RequestContext = {
      user: {
        id: userId,
      },
    };
    return ctx;
  },
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ApolloServerPluginDrainHttpServer({ httpServer }),
    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

async function startServer() {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log(
      `Server is now running on http://localhost:${PORT}${apolloServer.graphqlPath}`
    );
  });
}

/**
 * Fake data for demo purposes, it creates a show, adds a Potato product and starts the auction on it
 */
async function addDemoData() {
  const showService = Container.get(ShowService);
  const auctionService = Container.get(AuctionService);
  const show = await showService.createShow({ id: 'Anonymous' });
  const product = await showService.addProduct({
    showID: show.id,
    name: 'Potato',
  });
  if (!product) throw 'Failed to add product';
  await auctionService.startAuction({
    productID: product.id,
    showID: show.id,
    startingBid: 1,
  });
}

(async () => {
  await startServer();
  await addDemoData();
})();

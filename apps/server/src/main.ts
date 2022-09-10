import {ApolloServer} from "apollo-server";
import {ApolloServerPluginLandingPageLocalDefault} from "apollo-server-core";
import {buildASTSchema} from "graphql/utilities";
import {schema} from "schema";

const resolvers = {
  Query: {
    shows: () => [],
  },
};


const server = new ApolloServer({
  schema: buildASTSchema(schema),
  resolvers: resolvers,
  csrfPrevention: true,
  cache: "bounded",
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({embed: true}),
  ],
});

server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url}`);
});

import "reflect-metadata";
import { ApolloServer, gql } from "apollo-server";
import * as path from "path";
import { buildSchema, buildTypeDefsAndResolvers } from "../../src";
import { buildFederatedSchema } from "@apollo/federation";
import { RecipeResolver } from "./recipe-resolver";

async function bootstrap() {
  const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
    resolvers: [RecipeResolver],
  }).then(({ typeDefs, resolvers }) => ({
    typeDefs: gql(typeDefs),
    resolvers: resolvers as any,
  }));

  // Create GraphQL server
  const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }]),
    // enable GraphQL Playground
    playground: true,
  });

  // Start the server
  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();

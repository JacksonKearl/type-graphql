import { printSchema } from "graphql";
import { printSchema as printFederatedSchema } from "@apollo/federation";

import { BuildSchemaOptions, buildSchema } from "./buildSchema";
import { createResolversMap } from "./createResolversMap";
import { getMetadataStorage } from "../metadata/getMetadataStorage";

export async function buildTypeDefsAndResolvers(options: BuildSchemaOptions) {
  const storage = getMetadataStorage();
  const isFederated = storage.federation && storage.federation.useApolloFederation === true;

  const schema = await buildSchema(options);
  const typeDefs = isFederated ? printFederatedSchema(schema) : printSchema(schema);
  const resolvers = createResolversMap(schema);
  return { typeDefs, resolvers };
}

import "dotenv/config";
import fs from "fs";
import path from "path";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { parse } from "graphql";
import resolvers from "./resolvers.js";
import MongoRepo from "./datasources/MongoRepo.js";

const typeDefs = parse(
  fs
    .readdirSync(path.resolve("src/schema"))
    .filter((file) => path.extname(file) === ".graphql")
    .map((file) => fs.readFileSync(path.resolve("src/schema", file), "utf-8"))
    .join("\n")
);

const mongoRepo = new MongoRepo(process.env.MONGO_CONNECTION_STRING);
await mongoRepo.testConnection();

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4001 },
  context: () => {
    return {
      mongoRepo,
    };
  },
});

console.log(`🚀  Server ready at: ${url}`);

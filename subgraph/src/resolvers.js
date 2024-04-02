import { GraphQLJSONObject } from "./customScalars/JSON.js";

const buildMongoFilter = (filter) => {
  return Object.keys(filter).reduce((obj, field) => {
    if (typeof filter[field] === "object") {
      return { ...obj, [field]: buildMongoFilter(filter[field]) };
    } else {
      return { ...obj, [field.replace("_", "$")]: filter[field] };
    }
  }, {});
};

const resolvers = {
  Query: {
    patient: async (_, args, context) => {
      const filter = buildMongoFilter(args.where);
      return context.mongoRepo.getPatient(filter);
    },
  },
  GraphQLJSONObject,
};

export default resolvers;

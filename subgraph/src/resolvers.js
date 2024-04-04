import { GraphQLJSONObject } from "./customScalars/JSON.js";

const buildMongoFilter = (filter) => {
  return Object.keys(filter).reduce((obj, field) => {
    if (Array.isArray(filter[field])) {
      return { ...obj, [field.replace("_", "$")]: filter[field].map((child) => buildMongoFilter(child)) };
    }
    if (typeof filter[field] === "object") {
      return { ...obj, [field]: buildMongoFilter(filter[field]) };
    } else {
      return { ...obj, [field.replace("_", "$")]: filter[field] };
    }
  }, {});
};

const resolvers = {
  Query: {
    patients: async (_, args, context) => {
      const filter = buildMongoFilter(args.where || {});
      return context.mongoRepo.getPatients(filter);
    },
    patient: async (_, args, context) => {
      return context.mongoRepo.getPatient(args.patientId);
    },
  },
  GraphQLJSONObject,
};

export default resolvers;

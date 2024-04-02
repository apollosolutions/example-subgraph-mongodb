const resolvers = {
  Query: {
    patient: async (_, __, context) => {
      return context.mongoRepo.getPatient(1);
    },
  },
};

export default resolvers;

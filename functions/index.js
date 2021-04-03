const functions = require("firebase-functions");
const express = require("express");
const mongoose = require("mongoose");
const {
  ApolloServer,
  gql,
  AuthenticationError,
} = require("apollo-server-express");
mongoose.connect(
    "mongodb+srv://adriano:7kqA6_Hh9nhSP3p@cluster0.t0ahj.mongodb.net/mosano?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
);


// Mongoose Schemas
const countrySchema = new mongoose.Schema({
  name: String,
  id: mongoose.ObjectId,
});
const Country = mongoose.model("Country", countrySchema);
const birthdayBoiSchema = new mongoose.Schema({
  name: String,
  birthday: String,
  country: String,
  id: mongoose.ObjectId,
});
const BirthdayBoi = mongoose.model("BirthdayBoi", birthdayBoiSchema);

// GraphQL Defs
const typeDefs = gql`
  type BirthdayBoi {
    birthday: String!
    name: String!
    country: Country!
    _id: ID!
  }
  
  type Country {
      name: String!,
      _id: ID!
  }

  type Query {
    birthdayBois: [BirthdayBoi]
    countries : [Country]
  }
  type Mutation {
    addBirthdayBoi(
        name: String!
        birthday: String!
        country: String!
    ): BirthdayBoi,
    addCountry(name: String!): Country,
    deleteCountry(_id: ID!): Country,
    updateCountry(_id: ID!, name: String!): Country,
  }
`;
const resolvers = {
  Query: {
    birthdayBois: async () => await BirthdayBoi.find(),
    countries: async () => await Country.find(),
  },
  Mutation: {
    addBirthdayBoi: async (parent, args) => {
      // This mut isnt protected bc we want a public app
      const boi = new BirthdayBoi({
        name: args.name,
        country: args.country,
        birthday: args.birthday,
      });
      return await boi.save();
    },
    addCountry: async (parent, args, context) => {
      // This is protected by context verification.
      if (!context.loggedIn) {
        throw new AuthenticationError("AUTH TOKEN NOT FOUND OR NOT VALID");
      }
      const country = new Country({
        name: args.name,
      });
      return await country.save();
    },
    deleteCountry: async (parent, args, context) => {
    // This is protected by context verification.
      if (!context.loggedIn) {
        throw new AuthenticationError("AUTH TOKEN NOT FOUND OR NOT VALID");
      }
      const country = await Country.findOneAndDelete({_id: args._id});
      return country;
    },
    updateCountry: async (parent, args, context) => {
    // This is protected by context verification.
      if (!context.loggedIn) {
        throw new AuthenticationError("AUTH TOKEN NOT FOUND OR NOT VALID");
      }
      const country = await Country.findOneAndUpdate(
          {_id: args._id},
          {name: args.name}
      );
      return country;
    },
  },
};

// Express/Apollo Startup and connection
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => {
    const loggedIn = req.headers.authorization?true:false;
    return {loggedIn};
  },
});
server.applyMiddleware({app, path: "/"});


exports.graphql = functions.https.onRequest(app);

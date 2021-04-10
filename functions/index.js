/* eslint-disable no-underscore-dangle */
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


// Mongoose Schemas and models. Yes, i used stupid names in these vars.
// How else am i supposed to have fun?
const countrySchema = new mongoose.Schema({
  name: String,
});
const Country = mongoose.model("Country", countrySchema);
const birthdayBoiSchema = new mongoose.Schema({
  name: String,
  birthday: String,
  country: String,
});
const BirthdayBoi = mongoose.model("BirthdayBoi", birthdayBoiSchema);
// GraphQL Defs: simple, no refs cuz im too lazy to implement 'em
// Reuses mongos' _id. Lazy and usefull as Apollo knows to use it as priamry
// in the client.
const typeDefs = gql`
  type BirthdayBoi {
    birthday: String!
    name: String!
    country: String!
    _id: ID!
  }
  type Country {
      name: String!
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
  // Commenting these defy all logic.
  Query: {
    birthdayBois: async () => BirthdayBoi.find(),
    countries: async () => Country.find(),
  },
  Mutation: {
    // make doc from model with recieved args & save it.
    addBirthdayBoi: async (parent, args) => {
      // This mut isnt protected bc we want a public app.
      // Please never do this without rate limting the function to prevent a
      // shit ton of spam.
      // Note about this app's security: it's somewhat vunerable to DoS
      // attacks but not in the usual way as we're serverless. But we do have
      // as we're serverless. But we do have the default 60 sec timeout.
      // The only other reasonable measure for this app would be implementing
      // a rate limiter (possibly by caller IP).
      const boi = new BirthdayBoi({
        name: args.name,
        country: args.country,
        birthday: args.birthday,
      });
      return boi.save();
    },
    // The resolvers below are protected via context.
    addCountry: async (parent, args, context) => {
      if (!context.loggedIn) {
        throw new AuthenticationError("AUTH TOKEN NOT FOUND OR NOT VALID");
      }
      const country = new Country({
        name: args.name,
      });
      return country.save();
    },
    deleteCountry: async (parent, args, context) => {
      if (!context.loggedIn) {
        throw new AuthenticationError("AUTH TOKEN NOT FOUND OR NOT VALID");
      }
      const country = await Country.findOneAndDelete({_id: args._id});
      return country;
    },
    updateCountry: async (parent, args, context) => {
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

// Express/Apollo Startup and connection.
// We're using a firebase fn solely because i was too lazy
// to deploy to anywhere else.
// Plus my pc had just be reinstalled and i only had firebase-cli.
// We're using express inside the fn to serve just one route,
// but we could define n endpoints.
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => {
    // For security I just implemented the simplest logic possible:
    // No token, no auth. The rest are details.
    // Could have used a password, specific token(unsafe in case of breach),
    // encripted token key(or as i like to call 'em, salty keys), passwords, etc
    const loggedIn = !!req.headers.authorization;
    return {loggedIn};
  },
});
// Here i'm connecting the app to the only paty I'll be using.
// Apollo Server will handle most the config.
// Cors is set to true because I dont want to write a rewrite just for this.
server.applyMiddleware({app, path: "/", cors: true});
exports.graphql = functions.https.onRequest(app);

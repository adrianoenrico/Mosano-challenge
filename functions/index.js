const functions = require("firebase-functions");
const express = require("express");
const {ApolloServer, gql} = require("apollo-server-express");


const app = express();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
// Bellow is my schema for my birthday boi, their queries and mutations.
const typeDefs = gql`
  type BirthdayBoi {
    birthday: String!
    name: String!
    country: String!
    id: ID!
  }
  
  type Country {
      name: String!
  }

  type Query {
    birthdayBois: [BirthdayBoi]
    countries : [Country]
  }
`;

const resolvers = {
  Query: {
    birthdayBois: ()=> initialBois,
    countries: ()=> [{name: "Alaska"}],
  },
};

const initialBois = [
  {
    name: "Adriano Alecrim",
    country: "Portugal",
    birthday: "08/11/1998",
    id: 1,
  },
];

const server = new ApolloServer({typeDefs, resolvers, playground: true});
server.applyMiddleware({app, path: "/", cors: true});

exports.graphql = functions.https.onRequest(app);

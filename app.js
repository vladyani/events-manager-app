const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const EventModel = require('./models/event');
const UserModel = require('./models/user');

const app = express();

require('dotenv').config();

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      type User {
        _id: ID!
        email: String!
        password: String
      }

      input UserInput {
        email: String!
        password: String!
      }

      type RootMutation {
          createEvent(eventInput: EventInput): Event
          createUser(userInput: UserInput): User
      }

      type RootQuery {
        events: [Event!]!
      }

      schema {
          query: RootQuery
          mutation: RootMutation
      }
    `),
    rootValue: {
      events: async () => {
        try {
          const result = await EventModel.find();

          return result;
        } catch (error) {
          console.log(error);
        }
      },

      createEvent: async (args) => {
        try {
          const result = await new EventModel({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: args.eventInput.price,
            date: args.eventInput.date,
          }).save();

          return result._doc;
        } catch (error) {
          console.log(error);
        }
      },

      createUser: async (args) => {
        try {
          const maybeUser = await UserModel.findOne({
            email: args.userInput.email,
          });

          console.log(maybeUser, 'boom!');

          if (maybeUser) {
            throw new Error('This e-mail address is already registered!');
          }

          const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

          const result = await new UserModel({
            email: args.userInput.email,
            password: hashedPassword,
          }).save();

          return result._doc;
        } catch (error) {
          throw new Error(error.message);
        }
      },
    },
    graphiql: true,
  })
);

try {
  mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ordul.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`,
    { useUnifiedTopology: true, useNewUrlParser: true }
  );
  app.listen(3000);
} catch (error) {
  console.log(error);
}

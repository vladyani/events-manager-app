const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Event {
  _id: ID!
  title: String!
  description: String!
  price: Float!
  createdAt: String!
  creator: User!
}

input EventInput {
  title: String!
  description: String!
  price: Float!
  createdAt: String!
}

type User {
  _id: ID!
  email: String!
  password: String
  createdEvents: [Event!]
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
`);

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

    type AuthData {
        userId: String!
        token: String!
        tokenExpiration: Int!
    }

    type Booking {
        _id: ID!
        user: User!
        event: Event!
        createdAt: String!
        updatedAt: String!
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
        createBooking(eventId: ID!): Booking!
        cancelBooking(bookingId: ID!): Event! 
    }

    type RootQuery {
        events: [Event!]!
        login(email: String!, password: String!): AuthData
        bookings: [Booking!]!
    }

    schema {
        query: RootQuery
        mutation: RootMutation  
    }
`);

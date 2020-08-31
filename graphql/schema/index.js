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
        bookings: [Booking!]!
    }

    schema {
        query: RootQuery
        mutation: RootMutation  
    }
`);

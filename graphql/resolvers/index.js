const bcrypt = require('bcryptjs');

const EventModel = require('../../models/event');
const UserModel = require('../../models/user');
const BookingModel = require('../../models/booking');
const { dateToISOString } = require('../../utils/date');

const getUser = async (userId) => {
  const user = await UserModel.findById(userId);

  return {
    ...user._doc,
    createdEvents: getEvents.bind(this, user._doc.createdEvents),
  };
};

const getEvents = async (eventIds) => {
  const events = await EventModel.find({ _id: { $in: eventIds } });

  events.map((event) => ({
    ...event._doc,
    createdAt: dateToISOString(event._doc.createdAt),
    creator: getUser.bind(this, event._doc.creator),
  }));

  return events;
};

const getEvent = async (eventId) => {
  const event = await EventModel.findById(eventId);

  return {
    ...event._doc,
    creator: getUser.bind(this, event._doc.creator),
  };
};

const makeEvent = (event) => ({
  ...event._doc,
  createdAt: dateToISOString(event._doc.createdAt),
  creator: getUser.bind(this, event._doc.creator),
});

const makeBooking = (booking) => ({
  ...booking._doc,
  createdAt: dateToISOString(booking._doc.createdAt),
  event: getEvent.bind(this, booking._doc.event),
  updatedAt: dateToISOString(booking._doc.updatedAt),
  user: getUser.bind(this, booking._doc.user),
});

module.exports = {
  bookings: async () => {
    try {
      const bookings = await BookingModel.find();
      return bookings.map(makeBooking);
    } catch (error) {
      throw new Error('Bookings not found!');
    }
  },

  events: async () => {
    try {
      const events = await EventModel.find();

      return events.map(makeEvent);
    } catch (error) {
      throw new Error('Events not found!');
    }
  },

  createEvent: async (args) => {
    try {
      const maybeUser = await UserModel.findById('5f465dedac36aa458246314b');

      if (!maybeUser) {
        throw new Error('User not found!');
      }

      const event = await new EventModel({
        createdAt: args.eventInput.createdAt,
        creator: maybeUser._id,
        description: args.eventInput.description,
        price: args.eventInput.price,
        title: args.eventInput.title,
      }).save();

      const createdEvent = await event.save();

      await maybeUser.createdEvents.push(event.id);

      await maybeUser.save();

      return makeEvent(createdEvent);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  createUser: async (args) => {
    try {
      const maybeUser = await UserModel.findOne({
        email: args.userInput.email,
      });

      if (maybeUser) {
        throw new Error('This e-mail address is already registered!');
      }

      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = await new UserModel({
        email: args.userInput.email,
        password: hashedPassword,
      }).save();

      return user._doc;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  createBooking: async (args) => {
    try {
      const event = await EventModel.findOne({
        _id: args.eventId,
      });

      const booking = await new BookingModel({
        user: '5f465dedac36aa458246314b',
        event,
      }).save();

      return makeBooking(booking);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  cancelBooking: async (args) => {
    try {
      const booking = await BookingModel.findOne({
        _id: args.bookingId,
      }).populate('event');

      const event = makeEvent(booking.event);

      await BookingModel.deleteOne({ _id: args.bookingId });

      return event;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

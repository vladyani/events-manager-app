const bcrypt = require('bcryptjs');

const EventModel = require('../../models/event');
const UserModel = require('../../models/user');

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
    createdAt: new Date(event._doc.createdAt).toISOString(),
    creator: getUser.bind(this, event._doc.creator),
  }));

  return events;
};

const makeEvent = (event) => ({
  ...event._doc,
  createdAt: new Date(event._doc.createdAt).toISOString(),
  creator: getUser.bind(this, event._doc.creator),
});

module.exports = {
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
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: args.eventInput.price,
        createdAt: args.eventInput.createdAt,
        creator: maybeUser._id,
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
};

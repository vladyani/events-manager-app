const EventModel = require('../../models/event');
const UserModel = require('../../models/user');
const { makeEvent } = require('./utils');

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
};

const { dateToISOString } = require('../../utils/date');
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

  events.map(makeEvent);

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
  makeEvent,
  makeBooking,
  getEvent,
  getEvents,
  getUser,
};

const EventModel = require('../../models/event');
const BookingModel = require('../../models/booking');
const { makeEvent, makeBooking } = require('./utils');

module.exports = {
  bookings: async () => {
    try {
      const bookings = await BookingModel.find();
      return bookings.map(makeBooking);
    } catch (error) {
      throw new Error('Bookings not found!');
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

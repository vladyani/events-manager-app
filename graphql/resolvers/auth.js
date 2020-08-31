const bcrypt = require('bcryptjs');
const UserModel = require('../../models/user');

module.exports = {
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

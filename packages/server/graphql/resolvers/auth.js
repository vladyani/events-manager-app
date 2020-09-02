const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../../models/user');
const config = require('../../config');

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

  login: async ({ email, password }) => {
    const maybeUser = await UserModel.findOne({ email });

    if (!maybeUser) {
      throw new Error('User does not exist!');
    }

    const result = await bcrypt.compare(password, maybeUser.password);

    if (!result) {
      throw new Error('Password is incorrect!');
    }

    const token = await jwt.sign(
      { userId: maybeUser.id, email: maybeUser.email },
      config.TOKEN_SECRET_KEY,
      {
        expiresIn: `${config.TOKEN_EXPIRATION_TIME}h`,
      }
    );

    return {
      token,
      userId: maybeUser.id,
      tokenExpiration: config.TOKEN_EXPIRATION_TIME,
    };
  },
};

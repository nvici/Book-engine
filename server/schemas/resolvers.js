const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const { countDocuments } = require("../models/User");

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
                return userData;
            }
            throw new AuthenticationError('cannot login');
        }
    },
    Mutation: {
        addUser: async (parent, args, context) => {
            const user = await User.create(args);

            if (!user) {
                return console.error("Error");
            }
            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne( { email });
            if (!user) {
                throw new AuthenticationError('Not the right info!')
            }
            const correctPassword = await user.isCorrectPassword(password);
            if(!correctPassword) {
                throw new AuthenticationError('Not the right info!')
            }
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { book }, context) => {
            if (context.user) {
                const updateUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: {savedBooks: book} },
                    { new: true }
                )
                return updateUser;
            }
            throw new AuthenticationError('Please login!')
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updateUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                )
                return updateUser;
            }
            throw new AuthenticationError('Please login!')
        },
    },
  };
  
  module.exports = resolvers;
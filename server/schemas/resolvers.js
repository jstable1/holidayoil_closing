const { AuthenticationError } = require("apollo-server-express");
const { User, Task } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("task")

        return userData;
      }

      throw new AuthenticationError('Not logged in');
    },
    users: async () => {
      return User.find().select("-__v -password").populate("task");
    },
    user: async (parent, { initials }) => {
      return User.findOne({ initials })
        .select("-__v -password")
        .populate("task");
    },
    task: async (parent, { initials }) => {
      const params = initials ? { initials } : {};
      return Task.find(params);
    },
    task: async (parent, { _id }) => {
      return Task.findOne({ _id });
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },
    addTask: async (parent, args, context) => {
      if (context.user) {
        const task = await Task.create({
          ...args,
          initials: context.user.initials,
        });

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { task: task._id } },
          { new: true }
        );

        return task;
      }

      throw new AuthenticationError("You need to be logged in!");
    },
    deleteTask: async (parent, args, context) => {
      if (context.user) {
        const task = await Task.findOneAndRemove({ _id: args.id });

        const user = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { task: args.id } },
          { new: true }
        );

        return user;
      }

      throw new AuthenticationError("You need to be logged in!");
    },
    completeTask: async (parent, args, context) => {
      if (context.user) {
        const currentTask = await Task.findById({ _id: args.id });
        if (currentTask.completed) {
          const task = await Task.findOneAndUpdate(
            { _id: args.id },
            {
              completed: false,
            },
            { new: true }
          );

          return task;
        } else {
          const task = await Task.findOneAndUpdate(
            { _id: args.id },
            {
              completed: true,
            },
            { new: true }
          );

          return task;
        }
      }

      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;

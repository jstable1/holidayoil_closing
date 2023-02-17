const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    initials: String
    fname: String
    lname: String
    storeNumber: Number
  }

  type Task {
    _id: ID
    taskName: String
    taskDescription: String
    completed: Boolean
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    users: [User]
    user(username: String!): User
    task: [Task]
    task(_id: ID!): Task
  }

  type Mutation {
    login(initials: String!, password: String!): Auth
    addUser(initials: String!, fname: String!, lname: String!, storeNumber: Number!, password: String!): Auth
    addTask(taskName: String!): Task
    completeTask (id: ID!): Task
  }
`;

module.exports = typeDefs;

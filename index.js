const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const schema = require('./schema/schema');

dotenv.config();

const startServer = async () => {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({ schema });
  const path = '/graphql';

  server.applyMiddleware({ app, path });

  app.listen({ port: process.env.PORT || 4000 }, () =>
    console.log('Server ready!')
  );
};

const connectToMongo = async () => {
  mongoose.Promise = global.Promise;

  await mongoose
    .connect(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
    .then(() => console.log('DB Connected'))
    .catch(err => {
      console.log(`DB Connection Error: ${err.message}`);
    });
};

(async () => {
  try {
    await connectToMongo();
    startServer();
  } catch (err) {
    console.error(`Error connecting to mongo - ${err.message}`);
    process.exit(1);
  }
})();

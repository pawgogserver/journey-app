const graphql = require('graphql');
const Journey = require('../models/journey');
const Author = require('../models/author');

const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const JourneyType = new GraphQLObjectType({
  name: 'Journey',
  fields: () => ({
    id: { type: GraphQLID },
    date: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return Author.findById(parent.authorId);
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    journeys: {
      type: GraphQLList(JourneyType),
      resolve(parent, args) {
        return Journey.find({ authorId: parent.id });
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    journey: {
      type: JourneyType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Journey.findById(args.id);
      }
    },
    author: {
      type: AuthorType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Author.findById(args.id);
      }
    },
    journeys: {
      type: new GraphQLList(JourneyType),
      resolve(parent, args) {
        return Journey.find({});
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return Author.find({});
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },
    addJourney: {
      type: JourneyType,
      args: {
        date: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, { date, title, description, authorId }) {
        let journey = new Journey({
          date,
          title,
          description,
          authorId
        });
        return journey.save();
      }
    },
    updateJourney: {
      type: JourneyType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        date: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, { id, date, title, description }) {
        let updateJourney = Journey.findByIdAndUpdate(id, {
          date,
          title,
          description
        }).exec();
        if (!updateJourney) {
          throw new Error('Error, Cannot Delete!');
        }
        return updateJourney;
      }
    },
    removeJourney: {
      type: JourneyType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, { id }) {
        let removeJourney = Journey.findByIdAndRemove(id).exec();
        if (!removeJourney) {
          throw new Error('Error, Cannot Delete!');
        }
        return removeJourney;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});

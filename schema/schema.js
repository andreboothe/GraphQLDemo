const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;
const axios = require('axios');

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: {
    catchPhrase: { type: GraphQLString },
    name: { type: GraphQLString },
    bs: { type: GraphQLString },
  },
});

const GeographicalType = new GraphQLObjectType({
  name: 'Geography',
  fields: {
    lat: { type: GraphQLString },
    lng: { type: GraphQLString },
  },
});

const AddressType = new GraphQLObjectType({
  name: 'Address',
  fields: {
    street: { type: GraphQLString },
    suite: { type: GraphQLString },
    city: { type: GraphQLString },
    zipcode: { type: GraphQLString },
    geo: {
      type: GeographicalType,
    },
  },
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    company: { type: CompanyType },
    address: { type: AddressType },
  },
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`https://jsonplaceholder.typicode.com/users/${args.id}`)
          .then((response) => response.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery });

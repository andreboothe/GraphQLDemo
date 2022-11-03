const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = graphql;
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

const CommentType = new GraphQLObjectType({
  name: 'Comment',
  fields: {
    postId: { type: GraphQLString },
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    body: { type: GraphQLString },
  },
});

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    userId: { type: GraphQLString },
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    comments: {
      type: GraphQLList(CommentType),
      resolve(parentValue, args) {
        return axios
          .get(`https://jsonplaceholder.typicode.com/comments`, {
            params: { postId: parentValue.id },
          })
          .then((response) => response.data);
      },
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
    posts: {
      type: GraphQLList(PostType),
      resolve(parentValue, args) {
        return axios
          .get(`https://jsonplaceholder.typicode.com/posts`, {
            params: { userId: parentValue.id },
          })
          .then((response) => response.data);
      },
    },
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
    post: {
      type: PostType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`https://jsonplaceholder.typicode.com/posts/${args.id}`)
          .then((response) => response.data);
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    addPost: {
      type: PostType,
      args: {
        userId: { type: GraphQLNonNull(GraphQLString) },
        title: { type: GraphQLNonNull(GraphQLString) },
        body: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, { userId, title, body }) {
        axios
          .post(`https://jsonplaceholder.typicode.com/posts`, {
            params: {
              userId,
              title,
              body,
            },
          })
          .then((response) => console.log(response.data));
        return axios
          .post(`https://jsonplaceholder.typicode.com/posts`, {
            params: {
              userId,
              title,
              body,
            },
          })
          .then((response) => response.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: mutation });

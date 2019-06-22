import { GraphQLServer } from 'graphql-yoga';

let links = [
  {
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL',
  },
];

let idCount = links.length;

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
  },
  Mutation: {
    /**
     * @description
     * Create a link
     */
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);
      return link;
    },

    /**
     * @description
     * Update a link
     *
     */
    update: (parent, args) => {
      const targetIndex = links.findIndex(link => link.id === args.id);
      if (targetIndex === -1) return null;

      // update necessary arguments
      const updatedLink = { ...links[targetIndex] };
      if (Object.prototype.hasOwnProperty.call(args, 'url')) updatedLink.url = args.url;
      if (Object.prototype.hasOwnProperty.call(args, 'description')) updatedLink.description = args.description;

      // immutably (and in place) update links array
      links = links.map((link, index) => (targetIndex !== index ? link : updatedLink));
      return updatedLink;
    },

    /**
     * @description
     * Delete a link
     *
     */
    delete: (parent, args) => {
      const targetIndex = links.findIndex(link => link.id === args.id);
      if (targetIndex === -1) return null;
      const deletedLink = links[targetIndex];

      // immutably update links
      links = links.filter((link, index) => index !== targetIndex);
      return deletedLink;
    },
  },
};

// 3
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
});

server.start(() => console.log(`Server is running on http://localhost:4000`));

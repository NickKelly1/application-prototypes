import gql from 'graphql-tag';
import { GET_CART_ITEMS } from '../components/pages/CartPage/CartPage';
import { $TS_FIX_ME } from '../helpers/helper-types';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { hasProperty } from '../helpers/type-guards';
import { isObject } from 'util';

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
  }

  extend type Launch {
    isInCart: Boolean!
  }

  extend type Mutation {
    addOrRemoveFromCart(id: ID!): [Launch]
  }
`;

export const resolvers = {
  Launch: {
    isInCart: (launch: $TS_FIX_ME<{ id: string }>, _: unknown, { cache }: { cache: InMemoryCache }) => {
      const result = cache.readQuery({ query: GET_CART_ITEMS });
      // TODO: typings for this resolver so we don't need the checks

      // verify result exists...
      if (!result) throw new ReferenceError('No result from cache.readQuery?...');

      // verify cartItems are on result...
      if (!(result instanceof Object) || !hasProperty(result, 'cartItems')) throw new ReferenceError('No cartItems on result from cache.readQuery?...');

      const { cartItems } = result;
      return cartItems.includes(launch.id);
    }
  }
};
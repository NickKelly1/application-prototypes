import gql from 'graphql-tag';
import { GET_CART_ITEMS } from '../components/pages/CartPage/CartPage';
import { $TS_FIX_ME } from '../helpers/helper-types';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { hasProperty, hasArrayProperty } from '../helpers/type-guards';
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

/**
 * @see https://www.apollographql.com/docs/tutorial/local-state/
 *
 *  Apollo Client also lets you update local data in the cache with either direct cache
 *  writes or client resolvers. Direct writes are typically used to write simple booleans
 *  or strings to the cache whereas client resolvers are for more complicated writes such
 *  as adding or removing data from a list.
 */

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
  },

  /**
   * @see https://www.apollographql.com/docs/tutorial/local-state/
   *
   * What if we wanted to perform a more complicated local data update such as
   * adding or removing items from a list? For this situation, we'll use a local
   * resolver. Local resolvers have the same function signature as remote resolvers
   * ((parent, args, context, info) => data). The only difference is that the Apollo
   * cache is already added to the context for you. Inside your resolver, you'll use
   * the cache to read and write data.
   */
  Mutation: {
    addOrRemoveFromCart: (_: unknown, { id }: { id: string }, { cache }: { cache: InMemoryCache }) => {

      /**
       * @see https://www.apollographql.com/docs/tutorial/local-state/
       *
       * In this resolver, we destructure the Apollo cache from the context in
       * order to read the query that fetches cart items. Once we have our cart
       * data, we either remove or add the cart item's id passed into the mutation
       * to the list. Finally, we return the updated list from the mutation.
       */

      const result = cache.readQuery({ query: GET_CART_ITEMS });

      // TODO: typings for this resolver so we don't need the checks

      // verify result exists...
      if (!result) throw new ReferenceError('No result from cache.readQuery?...');

      // verify cartItems are on result...
      if (!(result instanceof Object) || !hasArrayProperty(result, 'cartItems')) throw new ReferenceError('No cartItems on result from cache.readQuery?...');

      const { cartItems } = result;

      const data = {
        cartItems: cartItems.includes(id)
          ? cartItems.filter(i => i !== id)
          : [...cartItems, id]
      }
      cache.writeQuery({ query: GET_CART_ITEMS, data });
      return data.cartItems;
    },
  },
};
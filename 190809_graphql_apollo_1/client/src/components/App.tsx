import './App.scss';
import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { resolvers, typeDefs } from '../gql/resolvers';
import AppRouter from './AppRouter/AppRouter';


const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'http://localhost:4000/',
  headers: {
    authorization: localStorage.getItem('token'),
  }
});

const client = new ApolloClient({
  cache,
  link,
  typeDefs,
  resolvers,
});

cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem('token'),
    cartItems: [],
  }
})


// import gql from 'graphql-tag';
// client
//   .query({
//     query: gql`
//       query GetLaunch {
//         launch(id: 56) {
//           id
//           mission {
//             name
//           }
//         }
//       }
//     `,
//   })
//   .then(console.log);

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <ApolloProvider client={client}>
          <AppRouter />
        </ApolloProvider>
      </header>
    </div >
  );
}

export default App;

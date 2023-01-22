import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {   
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink, 
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';


// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Create request middleware that adds the JWT token as a "authorization" header to each request.
const authLink = setContext((_, { headers }) => {
  // if the authentication token is present, retrieve it from the local storage
  const token = localStorage.getItem('id_token');
  //such that httpLink can read them, return the headers to the context.
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // Activate the 'authLink' middleware on our client before initiating a request to our GraphQL API.
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    addTypename: false
  })
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Routes>
          <Route 
                path="/login" 
                element={<LoginForm />} 
              />
              <Route 
                path="/signup" 
                element={<SignupForm />} 
              />
            <Route 
              path='/' 
              element={<SearchBooks />} 
            />
            <Route 
              path='/saved' 
              element={<SavedBooks />} 
            />
            <Route 
              path='*'
              element={<h1 className='display-2'>Wrong page!</h1>}
            />
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;

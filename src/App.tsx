import * as React from 'react';
import {
  Routes,
  Route,
  Outlet
} from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Main from './layout/main';
import Home from './pages/home';
import Article from './pages/article';
import Articles from './pages/articles';
import Difficulty from './pages/difficulty';
import Game from './pages/game';

export default function () {
  const client = new ApolloClient({
      uri: 'https://eu-west-2.cdn.hygraph.com/content/clrxb05v2128g01ut2nskdnz4/master',
      cache: new InMemoryCache(),
  });
  return (
    <ThemeProvider theme={{}}>
      <ApolloProvider client={client}>
        <Routes>
          <Route
            element={
              <Main>
                <Outlet />
              </Main>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/difficulty" element={<Difficulty />} />
            <Route path="/difficulty/:difficulty" element={<Game />} />
            <Route path="/:category?/:slug" element={<Article />} />
            <Route path="/blog/:category?" element={<Articles />} />
          </Route>
        </Routes>
      </ApolloProvider>
    </ThemeProvider>
  );
}
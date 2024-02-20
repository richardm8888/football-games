import * as React from 'react';
import {
  Routes,
  Route,
  Outlet,
  useLocation,
  useParams,
  Navigate
} from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import StyledEngineProvider from '@mui/material/StyledEngineProvider';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Main from './layout/main';
import Home from './pages/home';
import Article from './pages/article';
import Articles from './pages/articles';
import Difficulty from './pages/difficulty';
import Game from './pages/game';
import Movie from './pages/movie';
import MovieGame from './pages/movie_game';
import { getScreenName } from './routing';

export default function () {
  const location = useLocation();
  const client = new ApolloClient({
      uri: 'https://eu-west-2.cdn.hygraph.com/content/clrxb05v2128g01ut2nskdnz4/master',
      cache: new InMemoryCache(),
  });

  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#0650ba',
      },
      secondary: {
        main: '#9a0033',
      },
    },
    spacing: 8,
  });

  React.useEffect(() => {
    window.gtag('event', 'screen_view', {
      'screen_name': getScreenName(location.pathname)
    });
  }, [location.pathname]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
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
              <Route path="/movie" element={<Movie />} />
              <Route path="/movie/:difficulty" element={<MovieGame />} />
              <Route path="/football" element={<Difficulty />} />
              <Route path="/football/:difficulty" element={<Game />} />
              <Route path="/:category/:slug" element={<Article />} />
              <Route path="/:category" element={<Articles />} />
            </Route>
          </Routes>
        </ApolloProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

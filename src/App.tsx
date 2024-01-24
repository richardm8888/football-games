import * as React from 'react';
import {
  Routes,
  Route,
  Outlet
} from "react-router-dom";
import Main from './layout/main';
import Home from './pages/home';
import Difficulty from './pages/difficulty';
import Game from './pages/game';

export default function () {
  return (
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
      </Route>
    </Routes>
  );
}
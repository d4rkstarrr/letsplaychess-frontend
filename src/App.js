import React from "react";
import { Routes, Route } from 'react-router-dom'
import Layout from "./components/Layout";
import ChessBoard from "./components/Chessboard";
import Homepage from "./components/Homepage";
import useTitle from "./hooks/useTitle";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  useTitle('LetsPlayChess')

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="" element={<Homepage />} />
        <Route path="play" element={<ChessBoard />} />
      </Route>
    </Routes >
  );
}

export default App;
import React, { useState, useEffect, useRef } from "react";
import Chessboard from "chessboardjsx";
import {Chess} from "chess.js";
import CustomLoader from "./CustomLoader";
import socket from "../config/socket";
import useTitle from "../hooks/useTitle";

function ChessBoard() {
  useTitle('Play - LetsPlayChess');

  const gameRef = useRef(new Chess());
  const [fen, setFen] = useState("start");
  const [playerColor, setPlayerColor] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {

    socket.on("connect", () => {
      console.log(`Connected with ID: ${socket.id}`);
    });
  
    socket.on("joinedRoom", ({ room, players }) => {
      console.log(`Joined room ${room} with players ${players.join(", ")}`);
      setPlayerColor(players.indexOf(socket.id) === 0 ? "w" : "b");
    });

    socket.on("start", () => {
      console.log("Start received in client");
      setFen("start");
      setGameStarted(true);
    });

    socket.on("gameOver", ({ result, winner }) => {
      if (result === "checkmate") {
        alert(`Checkmate! ${winner} wins.`);
      } else if (result === "stalemate") {
        alert("Stalemate! The game is a draw.");
      }
    });

    socket.on("receiveMove", ({ sourceSquare, targetSquare }) => {
      const newGame = new Chess(gameRef.current.fen());
      const move = newGame.move({
        color: playerColor === "w" ? "b" : "w",
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (move !== null) {
        gameRef.current = newGame;
        setFen(newGame.fen());
      }
    });

    return () => {
      socket.off("connect");
      socket.off("joinedRoom");
      socket.off("start");
      socket.off("gameOver");
      socket.off("receiveMove");
    };
  }, [playerColor]); 


  const handleMove = ({ sourceSquare, targetSquare }) => {
    console.log("handleMove function has been called.");
    // Don't allow making a move if it's not the player's turn
    if (gameRef.current.turn() !== playerColor[0]) {
      return;
    }
  
    // Get legal moves for the source square
    const legalMoves = gameRef.current.moves({ square: sourceSquare, verbose: true });
  
    // Check if the target square is a legal move
    const isLegalMove = legalMoves.some(move => move.to === targetSquare);
  
    if (!isLegalMove) {
      // alert("Illegal move! Please make a different move.");
      return;
    }
  
    // If the move is legal, make the move and update the game state
    gameRef.current.move({
      color: playerColor,
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
  
    setFen(gameRef.current.fen());
    socket.emit("sendMove", { sourceSquare, targetSquare });

    if (gameRef.current.isCheckmate()) {
      socket.emit("gameOver", { result: "checkmate", winner: playerColor });
      alert(`Checkmate! ${playerColor} wins.`);
    } else if (gameRef.current.isStalemate()) {
      socket.emit("gameOver", { result: "stalemate" });
      alert(`Stalemate! The game is a draw.`);
    } else if (gameRef.current.isThreefoldRepetition()) {
      socket.emit("gameOver", { result: "stalemate" });
      alert(`The game is a draw due to threefold repetition.`);
    } else if (gameRef.current.isInsufficientMaterial()) {
      socket.emit("gameOver", { result: "stalemate" });
      alert(`The game is a draw due to insufficient material.`);
    } else if (gameRef.current.isDraw()) {
      socket.emit("gameOver", { result: "stalemate" });
      alert(`The game is a draw due to 50 move rule.`);
    }
  };

  return (
    <div className="flexContainer">
    {gameStarted && playerColor ? (
      <div className="boardWrapper">
        <h3 className="status">You are playing as {playerColor === "w" ? "White" : "Black"}</h3>
        <div className="chessboard">
          <Chessboard
            position={fen}
            onDrop={({ sourceSquare, targetSquare }) =>
              handleMove({ sourceSquare, targetSquare })
            }
            orientation={playerColor === "w" ? "white" : "black"}
            draggable={!gameRef.current.game_over}
          />
        </div>
      </div>
    ) : (
      <>
        <CustomLoader />
      </>
    )}
  </div>
);
}

export default ChessBoard;
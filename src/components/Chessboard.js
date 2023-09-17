import React, { useState, useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import Chessboard from "chessboardjsx"
import {Chess} from "chess.js"
import CustomLoader from "./CustomLoader"
import socket from "../config/socket"
import useTitle from "../hooks/useTitle"

const ChessBoard = () => {
  useTitle('Play - LetsPlayChess')

  let { state } = useLocation()

  const gameRef = useRef(new Chess())
  const [fen, setFen] = useState("start")
  const [playerColor, setPlayerColor] = useState(null)
  const [requestedGame, setRequestedGame] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  useEffect(() => {

    if(!requestedGame){
      socket.emit("findGame", { timeFormat: state.timeFormat })
      console.log("Searching for a room with time format: " + state.timeFormat)
      setRequestedGame(true)
    }

    socket.on("connect", () => {
      console.log(`Connected with ID: ${socket.id}`)
    })
  
    socket.on("joinedGame", ({ room, players }) => {
      console.log(`Joined room ${room} with players ${players.join(", ")}`)
      setPlayerColor(players.indexOf(socket.id) === 0 ? "w" : "b")
    })

    socket.on("startGame", () => {
      console.log("Game has started for the client.")
      setFen("start")
      setGameStarted(true)
    })

    socket.on("gameOver", ({ result, winner }) => {
      if (result === "checkmate") {
        alert(`Checkmate! ${winner} wins.`)
      }else if (result === "stalemate") {
        alert("Stalemate! The game is a draw.")
      }else if (result === "threefoldrepetition") {
        alert(`The game is a draw due to threefold repetition.`)
      }else if (result === "insufficientmaterial") {
        alert(`The game is a draw due to insufficient material.`)
      }else if (result === "50moverule") {
        alert(`The game is a draw due to 50 move rule.`)
      }
    })

    socket.on("receiveMove", ({ sourceSquare, targetSquare }) => {
      const newGame = new Chess(gameRef.current.fen());
      const move = newGame.move({
        color: playerColor === "w" ? "b" : "w",
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      })

      if (move !== null) {
        gameRef.current = newGame
        setFen(newGame.fen())
      }
    })

    //TODO - Opponent disconnected logic for client.
    socket.on("opponentDisconnected", () => {
      alert("Opponent has disconnected. Please search for a new game.")
    })

    return () => {
      socket.off("connect")
      socket.off("joinedGame")
      socket.off("startGame")
      socket.off("gameOver")
      socket.off("receiveMove")
      socket.off("opponentDisconnected")
    }

    // eslint-disable-next-line
  }, [playerColor])


  const handleMove = ({ sourceSquare, targetSquare }) => {
    // Don't allow making a move if it's not the player's turn
    if (gameRef.current.turn() !== playerColor) {
      return
    }
  
    // Get legal moves for the source square and check if the move made it a legal move or not
    const legalMoves = gameRef.current.moves({ square: sourceSquare, verbose: true })
    const isLegalMove = legalMoves.some(move => move.to === targetSquare)
  
    if (!isLegalMove) {
      return
    }
  
    // If the move is legal, make the move and update the game state
    gameRef.current.move({
      color: playerColor,
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    })
  
    setFen(gameRef.current.fen());
    socket.emit("sendMove", { sourceSquare, targetSquare })

    if (gameRef.current.isCheckmate()) {
      socket.emit("gameOver", { result: "checkmate", winner: playerColor })
      alert(`Checkmate! ${playerColor} wins.`)
    } else if (gameRef.current.isStalemate()) {
      socket.emit("gameOver", { result: "stalemate" })
      alert(`Stalemate! The game is a draw.`)
    } else if (gameRef.current.isThreefoldRepetition()) {
      socket.emit("gameOver", { result: "threefoldrepetition" })
      alert(`The game is a draw due to threefold repetition.`)
    } else if (gameRef.current.isInsufficientMaterial()) {
      socket.emit("gameOver", { result: "insufficientmaterial" })
      alert(`The game is a draw due to insufficient material.`)
    } else if (gameRef.current.isDraw()) {
      socket.emit("gameOver", { result: "50moverule" })
      alert(`The game is a draw due to 50 move rule.`)
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

export default ChessBoard
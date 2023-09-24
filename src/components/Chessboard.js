import React, { useState, useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import Chessboard from "chessboardjsx"
import {Chess} from "chess.js"
import CustomLoader from "./CustomLoader"
import socket from "../config/socket"
import useSound from 'use-sound'
import useTitle from "../hooks/useTitle"
import captureSound from "../audio/capture.mp3"
// import castleSound from "../audio/castle.mp3"
import gameEndSound from "../audio/game-end.mp3"
import gameStartSound from "../audio/game-start.mp3"
import illegalMoveSound from "../audio/illegal.mp3"
import checkSound from "../audio/move-check.mp3"
import opponentMoveSound from "../audio/move-opponent.mp3"
import selfMoveSound from "../audio/move-self.mp3"

const ChessBoard = () => {
  useTitle('Play - LetsPlayChess')

  let { state } = useLocation()

  const gameRef = useRef(new Chess())
  const [fen, setFen] = useState("start")
  const [playerColor, setPlayerColor] = useState(null)
  const [requestedGame, setRequestedGame] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [chessboardWidth, setChessboardWidth] = useState(560)

  const [playCaptureSound] = useSound(captureSound)
  const [playGameEndSound] = useSound(gameEndSound)
  const [playGameStartSound] = useSound(gameStartSound)
  const [playIllegalMoveSound] = useSound(illegalMoveSound)
  const [playCheckSound] = useSound(checkSound)
  const [playOpponentMoveSound] = useSound(opponentMoveSound)
  const [playSelfMoveSound] = useSound(selfMoveSound)

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
      playGameStartSound()
    })

    socket.on("gameOver", ({ result, winner }) => {
      playGameEndSound()
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
      const newGame = new Chess(gameRef.current.fen())
      const move = newGame.move({
        color: playerColor === "w" ? "b" : "w",
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      })

      if (move !== null) {
        if(move.captured){
          playCaptureSound()
        }else{
          playOpponentMoveSound()
        }
        gameRef.current = newGame
        setFen(newGame.fen())
      }
    })

    //TODO - Opponent disconnected logic for client.
    socket.on("opponentDisconnected", () => {
      playGameEndSound()
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


  const handleChessboardWidth = ({ screenWidth, screenHeight }) => {
    if(!screenWidth || !screenHeight) return
    
    screenHeight -= 50 // Removing 50px for the header

    //80% of screen width
    screenHeight *= 0.8
    screenWidth *= 0.8

    const responsiveWidth = Math.min(screenWidth, screenHeight)
    setChessboardWidth(responsiveWidth)
  }

  const handleMove = ({ sourceSquare, targetSquare }) => {
    // Don't allow making a move if it's not the player's turn
    if (gameRef.current.turn() !== playerColor) {
      playIllegalMoveSound()
      return
    }
  
    // Get legal moves for the source square and check if the move made it a legal move or not
    const legalMoves = gameRef.current.moves({ square: sourceSquare, verbose: true })
    const isLegalMove = legalMoves.some(move => move.to === targetSquare)
  
    if (!isLegalMove) {
      playIllegalMoveSound()
      return
    }
  
    // If the move is legal, make the move and update the game state
    const move = gameRef.current.move({
      color: playerColor,
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    })
  
    if(move && move.captured){
      playCaptureSound()
    }else{
      playSelfMoveSound()
    }
    
    setFen(gameRef.current.fen())
    socket.emit("sendMove", { sourceSquare, targetSquare })

    if(gameRef.current.isCheckmate()) {
      playGameEndSound()
      socket.emit("gameOver", { result: "checkmate", winner: playerColor })
      alert(`Checkmate! ${playerColor} wins.`)
    }else if (gameRef.current.isStalemate()) {
      playGameEndSound()
      socket.emit("gameOver", { result: "stalemate" })
      alert(`Stalemate! The game is a draw.`)
    }else if (gameRef.current.isThreefoldRepetition()) {
      playGameEndSound()
      socket.emit("gameOver", { result: "threefoldrepetition" })
      alert(`The game is a draw due to threefold repetition.`)
    }else if (gameRef.current.isInsufficientMaterial()) {
      playGameEndSound()
      socket.emit("gameOver", { result: "insufficientmaterial" })
      alert(`The game is a draw due to insufficient material.`)
    }else if (gameRef.current.isDraw()) {
      playGameEndSound()
      socket.emit("gameOver", { result: "50moverule" })
      alert(`The game is a draw due to 50 move rule.`)
    }else if(gameRef.current.inCheck()){
      playCheckSound()
    }
  }

  return (
    <div className="flexContainer">
    {gameStarted && playerColor ? (
      <div className="boardWrapper">
        {/* <h3>You are playing as {playerColor === "w" ? "White" : "Black"}</h3> */}
        <div className="chessboard">
          <Chessboard
            position={fen}
            onDrop={({ sourceSquare, targetSquare }) =>
              handleMove({ sourceSquare, targetSquare })
            }
            orientation={playerColor === "w" ? "white" : "black"}
            draggable={!gameRef.current.game_over}
            width={chessboardWidth}
            calcWidth={({ screenWidth, screenHeight }) =>
              handleChessboardWidth({ screenWidth, screenHeight })
            }
          />
        </div>
      </div>
    ) : (
      <>
        <CustomLoader />
      </>
    )}
  </div>
)
}

export default ChessBoard
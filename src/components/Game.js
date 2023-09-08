import React from "react";

import { useState, useEffect } from "react";

import { calculateWinner } from "./../helpers";
import Board from "./Board";
import GameModeSelection from "./GameModeSelection";





export default function Game() {
    
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [gameDifficulty, setGameDifficulty] = useState("normal");
    const [currentMove, setCurrentMove] = useState(0);
    const [showResetButton, setShowResetButton] = useState(false);
    const [gameMode, setGameMode] = useState(null);
    
  
    var currentPlayer = currentMove % 2 === 0 ? "X" : "O";
    const currentSquares = history[currentMove];

    
    useEffect(() => {
    
      // SHOW RESET BUTTON IF GAME IS RUNNING
      if (history.length > 1)
        setShowResetButton(true);
      
      //  ******** IA ACTION ********  \\
      if (gameMode === "ia" && currentPlayer === "O" && (calculateWinner(currentSquares) === null )) {
        const timeout = setTimeout(() => {
          // OBTENER MEJOR MOVIMIENTO EN TABLERO
          const bestMove = getBestMove(currentSquares);
          if(bestMove !== -1){
            // CREAR COPIA DE currentSquares Y AGREGARLE EL MOVIMIENTO ACTUAL
            const newSquares = currentSquares.slice();
            newSquares[bestMove] = "O";
            // COPY OF history AND ADD IT newSquares IN LAST POSITION (last move)
            const nextHistory = [...history.slice(0, currentMove + 1), newSquares];
            //ACTUALIZAR HISTORY...
            setHistory(nextHistory);
            setCurrentMove(nextHistory.length - 1);                
          }
        }, 400);
        // CLEAN TIMER
        return () => clearTimeout(timeout);
      }
    }, [currentPlayer, currentSquares, currentMove, history]);
  


    function handleSelectMode(mode)
    {
      setGameMode(mode);
      if(mode === '2player'){
        setGameDifficulty('2player')
      }
    }



    function getBestMove(squares)
    {
        const playerIA ="O", player1 ="X";
        // VERIFICAR SI LA IA PUEDE GANAR PROXIMO MOVIMIENTO, ENTONCES RETORNA ESA POSICION
        for (let i = 0; i < squares.length; i++) {
            if (squares[i] === null) {
                const newSquares = squares.slice();
                newSquares[i] = playerIA;
                if (calculateWinner(newSquares) === playerIA) {
                    return i;
                }
            }
        }
      
        // VERIFICAR SI EL JUGADOR HUMANO PUEDE GANAR EN EL PROXIMO MOVIMIENTO, ENTONCES LO BLOQUEA (JUEGA ESA POSICION)
        for (let i = 0; i < squares.length; i++) {
          if (squares[i] === null) {
            const newSquares = squares.slice();
            newSquares[i] = player1;
            if (calculateWinner(newSquares) === player1) {
              return i;
            }
          }
        }
                    // ----- SI NO HAY MOVIMIENTOS GANADORES -----  \\

        if( gameDifficulty === 'hard' ){
            if( equal( squares, ["X",null,null,null,null,null,null,null,null]) ||
            equal( squares, [null,null,"X",null,null,null,null,null,null]) ||
            equal( squares, [null,null,null,null,null,null,"X",null,null]) ||
            equal( squares, [null,null,null,null,null,null,null,null,"X"])
            ){
                return 4
            }
            if( equal( squares, ["X",null,null,  null,"O",null,  null,null,"X" ]) ||
                equal( squares, [null,null,"X",  null,"O",null,  "X",null,null ])
            ){
                return 1
            }
        }


        // OBTENER CASILLAS LIBRES
        const emptySquares = squares.reduce((acc, val, index) => {
          if (val === null ) {
            acc.push(index);
          }
          return acc;
        }, []);
        
        // RETORNAR ALGUNA POSICION DE ESQUINA SI ESTÁ DISPONIBLE
        if( emptySquares.includes(0) ) return 0;
        if( emptySquares.includes(2) ) return 2;
        if( emptySquares.includes(6) ) return 6;
        if( emptySquares.includes(8) ) return 8;


        // RETORNAR CASILLA LIBRE AL AZAR
        if (emptySquares.length > 0) {
          const randomIndex = Math.floor(Math.random() * emptySquares.length);
          return emptySquares[randomIndex];
        }
      
        // NO HAY CASILLAS DISPONIBLES; EMPATE
        return -1;
      }
      
      
      
  
    function equal(arr1, arr2){
      if (arr1.length !== arr2.length) return false;
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
      }
      return true;
    }
  
    function handlePlay(nextSquares) {
      const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length - 1);
    }
  
    function reset() {
      setCurrentMove(0);
      setShowResetButton(false);
      setHistory([Array(9).fill(null)]);
      // descomentar para volver a la pantalla de "select game mode"
      //setGameMode(null);
    }
  
    const moves = history.map((squares, move) => {
      if (move === 1 && showResetButton) {
        return (
          <li key={0}>
            <button
              className="btn btn-primary"
              id="resetBtn"
              onClick={() => {
                reset();
              }}
            >
              Reiniciar
            </button>
          </li>
        );
      }
    });
  
    if (gameMode) {
      return (
        <div className="row gameBoardCont">
            
          <div className="col-12">
                <SelectDifficulty />
          </div>

          <div className="game-board col-12 col-sm-6 col-md-3">
            <Board
              currentPlayer={currentPlayer}
              squares={currentSquares}
              onPlay={handlePlay}
              gameMode={gameMode}
            />
          </div>
  
          <div className="game-info col-12 col-sm-4 col-md-3">
            <HandleWinner squares={currentSquares} />
            <ul id="resetCont">{moves}</ul>
          </div>


        </div>
      );
    } else {
      return (
        <div className="row gameBoardCont">
          <GameModeSelection onSelectMode={handleSelectMode} />
        </div>
      );
    }


    function SelectDifficulty({ changeDifficulty })
    {
        function changeDifficulty(value)
        {
            setCurrentMove(0);
            setShowResetButton(false);
            setHistory([Array(9).fill(null)]);
            setGameDifficulty(value);
            if( value === "2player"){
                setGameMode("2player");
            }else{
                setGameMode("ia");
            }
        }
            
            const handleDifficultyChange = (event) => {
                const selectedOption = event.target.value;
                changeDifficulty(selectedOption);
            };

            return (
            <select onChange={handleDifficultyChange} value={gameDifficulty}>
                <option value="easy">Normal</option>
                <option value="hard">Dificil</option>
                <option value="2player">Dos jugadores</option>
            </select>
            );
    }

  }

  function HandleWinner({ squares })
  {
    var winner = calculateWinner(squares);
    if (winner !== null && winner !== 0) {
      return (
        <div>
          <h4 id="winner">Ganador: {winner} </h4>
        </div>
      );
    }else{
        if( winner === 0){
            return (
                <div>
                  <h4 id="empate">Empate!</h4>
                </div>
            );
        }
    }
  }


  

  //export default Game;
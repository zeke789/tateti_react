import { calculateWinner } from "./../helpers";
import Square from "./Square";


export default function Board({ currentPlayer, squares, onPlay, gameMode }) {
    function handleClick(i) {
      if (calculateWinner(squares) || squares[i]) return;
      if (gameMode === "ia" && currentPlayer === "O") return;
      const nextSquares = squares.slice();
      nextSquares[i] = currentPlayer;
      onPlay(nextSquares);
    }
  
    const winner = calculateWinner(squares);
    let status;
    if (winner) {
      status = "Ganador: " + winner;
    } else {
        if(winner === 0){
            status = "Empate";
        }else{
            status = "Turno: " + currentPlayer;
        }
      
    }
    return (
      <>
        <div className="row">
          <div className="col-12 squaresRowCont">
            <div className="board-row row">
              <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
              <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
              <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
            </div>
            <div className="board-row row">
              <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
              <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
              <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
            </div>
            <div className="board-row row">
              <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
              <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
              <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
            </div>
          </div>
  
          <div className="col-12" id="statusCont">
            <div className="status">{status}</div>
          </div>
        </div>
      </>
    );
  }
import { useState } from 'react';
import logo from "../assets/logo.png";

// Square Component
function Square({ value, onSquareClick, isWinning }) {
  return (
    <div
      className={`square h-20 w-20 text-4xl font-bold border-2 m-0 flex justify-center items-center cursor-pointer 
                  ${isWinning ? 'bg-[#8eaa80] animate-pulse text-white' : 'hover:bg-[#FAF9EE]'}`}
      onClick={onSquareClick}
    >
      {value}
    </div>
  );
}

// Board Component
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares).winner || squares[i]) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const { winner, winningSquares } = calculateWinner(squares);
  const isDraw = !winner && squares.every(square => square !== null);

  const status = winner
    ? `Winner: ${winner}`
    : isDraw
    ? "Match Draw"
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <>
      <div className="p-2 text-center w-62 rounded-sm text-2xl font-semibold bg-[#FAF9EE] mb-4">
        {status}
      </div>
      <div className="w-full h-full flex flex-col justify-center items-center">
        {[0, 1, 2].map(row => (
          <div className="flex" key={row}>
            {[0, 1, 2].map(col => {
              const index = row * 3 + col;
              return (
                <Square
                  key={index}
                  value={squares[index]}
                  onSquareClick={() => handleClick(index)}
                  isWinning={winningSquares.includes(index)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

// Game Component
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleReset() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const { winner } = calculateWinner(currentSquares);
  const isDraw = !winner && currentSquares.every(square => square !== null);

  const moves = history.map((squares, move) => {
    const description = move > 0 ? 'Move #' + move + " - " +squares  : 'Game started';
    return (
      <li className="text-xl font-medium rounded-md w-full bg-[#FAF9EE] p-2" key={move}>
        <div onClick={() => jumpTo(move)}>{description}</div>
      </li>
    );
  });

  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center gap-5 p-10 bg-[#FAF9EE]">
      {/* Header */}
      <div className='font-bold text-5xl w-full tracking-[0.20em] flex items-center gap-5'>
        <img src={logo} className='h-10' />
        Tic Tac Toe
      </div>

      <div className="flex w-full h-full items-center justify-center gap-10 ">
        {/* Game Board */}
        <div className="flex flex-col p-20 justify-center items-center bg-[#DCCFC0] min-w-1/2 h-full rounded-2xl relative">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
          <button
            onClick={handleReset}
            className="mt-6 px-4 py-2 text-xl font-medium border border-[#FAF9EE] bg-[#FAF9EE] rounded-md hover:border-black cursor-pointer transition"
          >
            Reset Game
          </button>
        </div>

        {/* Right Side: Moves & Winner/Draw */}
        <div className="game-info bg-[#DCCFC0] rounded-2xl w-1/2 h-full flex flex-col p-2">
          {!winner && !isDraw && (
            <>
              <div className="text-center text-2xl font-medium py-4 uppercase border-b-2 mb-2">
                Steps History
              </div>
              <ol className="flex flex-col gap-2 w-full overflow-hidden">{moves}</ol>
            </>
          )}

          {(winner || isDraw) && (
            <div className="text-4xl font-bold my-auto text-white bg-[#8eaa80] rounded-lg p-8 animate-bounce text-center">
              {winner ? `🎉 ${winner} Wins! 🎉` : '🤝 Match Draw! 🤝'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Winner Calculation
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningSquares: line };
    }
  }
  return { winner: null, winningSquares: [] };
}

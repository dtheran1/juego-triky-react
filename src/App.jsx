import { useState } from "react";

const TURNS = {
  X: 'x',
  O: 'o'
}


const Square = ({ children, updateBoard, index, isSelected }) => {
  const className = `square ${isSelected && 'is-selected'}`;

  const handleClick = () => {
    updateBoard(index)
  }

  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  )
};

const WINNER_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState(TURNS.X);
  const [winner, setWinner] = useState(null); // null es que no hay ganador, false es que hay empate

  const checkWinner = (boardToCheck) => {
    // Revisamos todas las combinaciones para ver si hay un ganador
    for (const combo of WINNER_COMBOS) {
      const [a, b, c] = combo
      if (
        boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
      ) {
        return boardToCheck[a]
      }
    }
    return null
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);
  }

  const checkEndGame = (boardToCheck) => {
    return boardToCheck.every(square => square !== null)
  }

  const updateBoard = (ind) => {
    if (board[ind] || winner) return; // validamos que en la posicion que estamos ubicados este null, si ya tiene algo entonces no sobreescribimos.


    const newBoard = [...board]; // Siempre se debe crear un estado nuevo basado en el estado inicial, para poder actualizarlo con el setState.
    newBoard[ind] = turn;
    setBoard(newBoard);// Actualizamos el estado con el nuevo array

    //Cambiamos el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);

    //Revisar si hay un ganador
    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false) // empate
    }
  }

  return (
    <main className="board">
      <h1>Tic Tac Toe</h1>
      <button onClick={resetGame}>Resetear juego</button>
      <section className="game">
        {
          board.map((square, ind) => {
            return (
              <Square
                key={ind}
                index={ind}
                updateBoard={updateBoard}
              >
                {square}
              </Square>
            )
          })
        }
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.X}>
          {TURNS.X}
        </Square>
        <Square isSelected={turn === TURNS.O}>
          {TURNS.O}
        </Square>
      </section>

      {
        winner !== null && (
          <section className="winner">
            <div className="text">
              <h2>
                {
                  winner === false
                    ? 'Empate'
                    : `Gano:`
                }
              </h2>
              <header className="win">
                {
                  winner && <Square>{winner}</Square>
                }
              </header>
              <footer>
                <button onClick={resetGame}>
                  Empezar de nuevo
                </button>
              </footer>
            </div>
          </section>
        )
      }

    </main>
  )
}

export default App

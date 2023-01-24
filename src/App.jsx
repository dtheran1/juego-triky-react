import { useState } from 'react'
import confetti from 'canvas-confetti'

import { Square } from './components/Square'
import { TURNS } from './constants'
import { checkWinner, checkEndGame } from './logic/board'
import { WinnerModal } from './components/WinnerModal'
import { Board } from './components/Board'
import { resetGameToStorage, saveGameToStorage } from './logic/storage'

function App () {
  // El estado en React es asincrono IMPORTANTE
  const [board, setBoard] = useState(() => {
    // inicializando el estado con una callback
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  })

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X
  })

  const [winner, setWinner] = useState(null) // null es que no hay ganador, false es que hay empate

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    resetGameToStorage()
  }

  const updateBoard = (ind) => {
    if (board[ind] || winner) return // validamos que en la posicion que estamos ubicados este null, si ya tiene algo entonces no sobreescribimos.

    const newBoard = [...board] // Siempre se debe crear un estado nuevo basado en el estado inicial, para poder actualizarlo con el setState.
    newBoard[ind] = turn
    setBoard(newBoard)// Actualizamos el estado con el nuevo array

    // Cambiamos el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    // guardar partida
    saveGameToStorage({ board: newBoard, turn: newTurn })

    // Revisar si hay un ganador
    const newWinner = checkWinner(newBoard)
    if (newWinner) {
      confetti()
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)) {
      setWinner(false) // empate
    }
  }

  return (
    <main className='board'>
      <h1>Tic Tac Toe</h1>
      <button onClick={resetGame}>Resetear juego</button>
      <Board board={board} updateBoard={updateBoard} />

      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>
          {TURNS.X}
        </Square>
        <Square isSelected={turn === TURNS.O}>
          {TURNS.O}
        </Square>
      </section>

      <WinnerModal winner={winner} resetGame={resetGame} />

    </main>
  )
}

export default App

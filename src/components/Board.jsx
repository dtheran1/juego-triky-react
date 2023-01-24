import { Square } from "./Square"
export function Board({ board, updateBoard }) {
  return (
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
  )
}
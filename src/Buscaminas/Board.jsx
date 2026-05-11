import Cell from "./Cell";

function Board({ game, onLeftClick, onRightClick }) {
  if (!game) return null;

  return (
    <div
      className="board"
      style={{
        gridTemplateColumns: `repeat(${game.cols}, 34px)`,
      }}
    >
      {game.grid.map((row) =>
        row.map((cell) => (
          <Cell
            key={`${cell.r}-${cell.c}`}
            cell={cell}
            onLeftClick={onLeftClick}
            onRightClick={onRightClick}
          />
        ))
      )}
    </div>
  );
}

export default Board;
function Cell({ cell, onLeftClick, onRightClick }) {
  let content = "";

  if (!cell.revealed && cell.flagged) {
    content = "🚩";
  }

  if (cell.revealed && cell.mine) {
    content = "💣";
  }

  if (cell.revealed && !cell.mine && cell.adjacent > 0) {
    content = cell.adjacent;
  }

  return (
    <button
      type="button"
      className={`cell
        ${cell.revealed ? "revealed" : ""}
        ${cell.flagged ? "flagged" : ""}
        ${cell.revealed && cell.mine ? "mine" : ""}
      `}
      onClick={() => onLeftClick(cell.r, cell.c)}
      onContextMenu={(e) => {
        e.preventDefault();
        onRightClick(cell.r, cell.c);
      }}
    >
      {content}
    </button>
  );
}

export default Cell;
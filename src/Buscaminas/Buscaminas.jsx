import { useState } from "react";
import Controls from "./Controls";
import Board from "./Board";

// --- lógica básica ---
function createGame(rows, cols, mines) {
  let grid = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      r,
      c,
      mine: false,
      adjacent: 0,
      revealed: false,
      flagged: false,
    }))
  );

  let positions = [];
  for (let i = 0; i < rows * cols; i++) positions.push(i);

  for (let i = positions.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  for (let i = 0; i < mines; i++) {
    let idx = positions[i];
    let r = Math.floor(idx / cols);
    let c = idx % cols;
    grid[r][c].mine = true;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!grid[r][c].mine) {
        let neighbors = getNeighbors(grid, rows, cols, r, c);
        grid[r][c].adjacent = neighbors.filter((cell) => cell.mine).length;
      }
    }
  }

  return {
    rows,
    cols,
    mines,
    grid,
    status: "playing",
  };
}

function revealCell(game, r, c) {
  let newGame = structuredClone(game);
  let startCell = newGame.grid[r][c];

  if (startCell.revealed || startCell.flagged) return newGame;

  if (startCell.mine) {
    startCell.revealed = true;
    newGame.status = "lost";
    return newGame;
  }

  let stack = [startCell];

  while (stack.length > 0) {
    let cell = stack.pop();

    if (cell.revealed || cell.flagged) continue;

    cell.revealed = true;

    if (cell.adjacent > 0) continue;

    let neighbors = getNeighbors(
      newGame.grid,
      newGame.rows,
      newGame.cols,
      cell.r,
      cell.c
    );

    neighbors.forEach((neighbor) => {
      if (!neighbor.revealed && !neighbor.flagged && !neighbor.mine) {
        stack.push(neighbor);
      }
    });
  }

  let revealedSafeCells = 0;

  newGame.grid.forEach((row) => {
    row.forEach((cell) => {
      if (cell.revealed && !cell.mine) {
        revealedSafeCells++;
      }
    });
  });

  if (revealedSafeCells === newGame.rows * newGame.cols - newGame.mines) {
    newGame.status = "won";
  }

  return newGame;
}

function getNeighbors(grid, rows, cols, r, c) {
  let neighbors = [];

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;

      let nr = r + dr;
      let nc = c + dc;

      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        neighbors.push(grid[nr][nc]);
      }
    }
  }

  return neighbors;
}

function toggleFlag(game, r, c) {
  let newGame = structuredClone(game);
  let cell = newGame.grid[r][c];

  if (cell.revealed) return newGame;

  cell.flagged = !cell.flagged;

  return newGame;
}

function Buscaminas() {
  const [rows, setRows] = useState(8);
  const [cols, setCols] = useState(8);
  const [mines, setMines] = useState(10);
  const [difficulty, setDifficulty] = useState("easy");

  const [game, setGame] = useState(null);

  function newGame() {
    let g = createGame(rows, cols, mines);
    setGame(g);
  }

  function handleLeftClick(r, c) {
    if (!game || game.status !== "playing") return;

    let updatedGame = revealCell(game, r, c);
    setGame(updatedGame);
  }

  function handleRightClick(r, c) {
    if (!game || game.status !== "playing") return;

    let updatedGame = toggleFlag(game, r, c);
    setGame(updatedGame);
  }

  function handleDifficultyChange(e) {
    let val = e.target.value;
    setDifficulty(val);

    if (val === "easy") {
      setRows(8);
      setCols(8);
      setMines(10);
    }

    if (val === "medium") {
      setRows(12);
      setCols(12);
      setMines(30);
    }

    if (val === "hard") {
      setRows(16);
      setCols(16);
      setMines(50);
    }
  }

  return (
    <section>
      <header>
        <h1>Buscaminas</h1>
      </header>

      <div className="panel">
        <Controls
          difficulty={difficulty}
          rows={rows}
          cols={cols}
          mines={mines}
          onDifficultyChange={handleDifficultyChange}
          onRowsChange={(e) => setRows(Number(e.target.value))}
          onColsChange={(e) => setCols(Number(e.target.value))}
          onMinesChange={(e) => setMines(Number(e.target.value))}
          onNewGame={newGame}
        />
      </div>

      {game?.status === "won" && (
        <p className="message win">🎉 Has ganado</p>
      )}

      {game?.status === "lost" && (
        <p className="message lost">💣 Has encontrado una mina</p>
      )}

      <div className="boardWrap">
        <Board
          game={game}
          onLeftClick={handleLeftClick}
          onRightClick={handleRightClick}
        />
      </div>
    </section>
  );
}

export default Buscaminas;
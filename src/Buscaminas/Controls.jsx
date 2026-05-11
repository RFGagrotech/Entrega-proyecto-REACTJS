function Controls({
  difficulty,
  rows,
  cols,
  mines,
  onDifficultyChange,
  onRowsChange,
  onColsChange,
  onMinesChange,
  onNewGame,
}) {
  return (
    <div className="controls">
      <label>
        Dificultad
        <select value={difficulty} onChange={onDifficultyChange}>
          <option value="easy">Fácil</option>
          <option value="medium">Medio</option>
          <option value="hard">Difícil</option>
          <option value="custom">Personalizado</option>
        </select>
      </label>

      <label>
        Filas
        <input type="number" value={rows} onChange={onRowsChange} />
      </label>

      <label>
        Columnas
        <input type="number" value={cols} onChange={onColsChange} />
      </label>

      <label>
        Minas
        <input type="number" value={mines} onChange={onMinesChange} />
      </label>

      <button onClick={onNewGame}>
        Crear / Reiniciar
      </button>
    </div>
  );
}

export default Controls;
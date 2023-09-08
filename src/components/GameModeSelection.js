import React from "react";

function GameModeSelection({ onSelectMode }) {
  return (
    <div>
      <h2>Selecciona el modo de juego:</h2>
      <button onClick={() => onSelectMode("ia")}>Jugar con la IA</button>
      <button onClick={() => onSelectMode("2player")}>2 Jugadores</button>
    </div>
  );
}

export default GameModeSelection;

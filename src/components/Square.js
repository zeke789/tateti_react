export default function Square({ value, onSquareClick }) {
    return (
      <button className="square col-4" onClick={onSquareClick}>
        {value}
      </button>
    );
  }
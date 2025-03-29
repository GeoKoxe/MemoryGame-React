import React, { useState, useEffect } from "react";
import "./App.css";

const cardsArray = [
  "red.png", "red.png", 
  "blue.png", "blue.png", 
  "green.png", "green.png", 
  "orange.png", "orange.png", 
  "lightblue.png", "lightblue.png", 
  "purple.png", "purple.png"
];

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export default function MemoryGame() {
  const [cards, setCards] = useState(shuffleArray([...cardsArray]));
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [timer, setTimer] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(null);

  useEffect(() => {
    if (flipped.length === 2) {
      const [firstIndex, secondIndex] = flipped;
      if (cards[firstIndex] === cards[secondIndex]) {
        setMatched((prevMatched) => [...prevMatched, firstIndex, secondIndex]);
      }
      setTimeout(() => setFlipped([]), 1000);
    }
  }, [flipped, cards]);

  useEffect(() => {
    if (timer > 0 && gameStarted && !gameOver && !gameWon) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    } else if (timer === 0) {
      setGameOver(true);
    }
  }, [timer, gameStarted, gameOver, gameWon]);

  useEffect(() => {
    if (matched.length === cardsArray.length) {
      setGameWon(true);
    }
  }, [matched, cards]);

  const handleClick = (index) => {
    if (flipped.length < 2 && !flipped.includes(index) && !matched.includes(index)) {
      setFlipped([...flipped, index]);
    }
  };

  const restartGame = () => {
    setCards(shuffleArray([...cardsArray]));
    setFlipped([]);
    setMatched([]);
    setTimer(30);
    setGameOver(false);
    setGameWon(false);
  };

  const startGame = () => {
    setGameStarted(true);
    setGameStartTime(Date.now()); // Start the timer
  };

  return (
    <div className="memory-game-container">
      {!gameStarted ? (
        <div className="menu-screen">
          <h1>Memory Game</h1>
          <p>Match all the pairs before time runs out!</p>
          <button onClick={startGame} className="start-button">Start Game</button>
        </div>
      ) : (
        <>
          <div className="button-container">
            <button onClick={restartGame}>Restart Game</button>
          </div>

          <div className="timer">
            <h3>Time Left: {timer} seconds</h3>
          </div>

          {gameOver && timer === 0 && (
            <div className="game-over-message">
              <h2>Time's up! You didn't finish in time.</h2>
            </div>
          )}

          {gameWon && (
            <div className="win-message">
              <h2>Congratulations! You Win!</h2>
            </div>
          )}

          <div className="memory-game-grid">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`card ${flipped.includes(index) || matched.includes(index) ? "flipped" : ""}`}
                onClick={() => handleClick(index)}
              >
                {(flipped.includes(index) || matched.includes(index)) && (
                  <img
                    src={`/souls/${card}`}
                    alt="Soul"
                    className="card-image"
                  />
                )}
                {!flipped.includes(index) && !matched.includes(index) && (
                  <span>?</span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

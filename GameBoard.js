import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import { BOARD_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION } from '../constants';

const getRandomFood = () => {
  return [
    Math.floor(Math.random() * BOARD_SIZE),
    Math.floor(Math.random() * BOARD_SIZE)
  ];
};

const GameBoard = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(getRandomFood);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);

  const boardRef = useRef();

  const moveSnake = () => {
    const head = [...snake[0]];
    switch (direction) {
      case 'UP': head[0] -= 1; break;
      case 'DOWN': head[0] += 1; break;
      case 'LEFT': head[1] -= 1; break;
      case 'RIGHT': head[1] += 1; break;
      default: break;
    }

    // Check wall or self collision
    if (
      head[0] < 0 || head[0] >= BOARD_SIZE ||
      head[1] < 0 || head[1] >= BOARD_SIZE ||
      snake.some(segment => segment[0] === head[0] && segment[1] === head[1])
    ) {
      setGameOver(true);
      return;
    }

    const newSnake = [head, ...snake];

    // Eating food
    if (head[0] === food[0] && head[1] === food[1]) {
      setFood(getRandomFood());
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    const handleKey = (e) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [direction]);

  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(getRandomFood());
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
  };

  return (
    <div className="game-container">
      {gameOver && <div className="overlay"><h2>Game Over</h2><button onClick={restartGame}>Restart</button></div>}
      <div className="board" ref={boardRef}>
        {Array.from({ length: BOARD_SIZE }).map((_, row) =>
          Array.from({ length: BOARD_SIZE }).map((_, col) => {
            const isSnake = snake.some(([r, c]) => r === row && c === col);
            const isFood = food[0] === row && food[1] === col;
            return (
              <div
                key={`${row}-${col}`}
                className={`cell ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''}`}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default GameBoard;

"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const INITIAL_FOOD = { x: 15, y: 10 };

export function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const moveSnake = () => {
      const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

      // Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setIsGameOver(true);
        setIsPlaying(false);
        return;
      }

      // Self collision
      if (snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        setIsGameOver(true);
        setIsPlaying(false);
        return;
      }

      const newSnake = [head, ...snake];

      // Food collision
      if (head.x === food.x && head.y === food.y) {
        setScore((s) => s + 1);
        setFood({
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        });
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const intervalId = setInterval(moveSnake, 150);
    return () => clearInterval(intervalId);
  }, [snake, direction, isPlaying, isGameOver, food]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(INITIAL_FOOD);
    setIsGameOver(false);
    setScore(0);
    setIsPlaying(true);
  };

  return (
    <Card className="p-6 flex flex-col items-center gap-4 bg-zinc-900 border-zinc-800 text-white">
      <div className="flex justify-between w-full max-w-[400px]">
        <span className="text-xl font-bold">Score: {score}</span>
        {isGameOver && <span className="text-red-500 font-bold">Game Over!</span>}
      </div>

      <div
        className="relative bg-zinc-800 border-4 border-zinc-700"
        style={{
          width: GRID_SIZE * 20,
          height: GRID_SIZE * 20,
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={i}
            className="bg-green-500 rounded-sm"
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="bg-red-500 rounded-full"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        />
      </div>

      <div className="flex gap-4">
        {!isPlaying ? (
          <Button onClick={resetGame} variant="default">
            {isGameOver ? "Try Again" : "Start Game"}
          </Button>
        ) : (
          <Button onClick={() => setIsPlaying(false)} variant="secondary">
            Pause
          </Button>
        )}
      </div>
      <p className="text-zinc-400 text-sm">Use Arrow Keys to move</p>
    </Card>
  );
}

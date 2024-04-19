import React, { useState, useEffect } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { FaArrowRight, FaArrowLeft, FaArrowUp, FaArrowDown } from "react-icons/fa";

const cellSize = 20; // Size of each cell in the grid
const numRows = 20; // Number of rows in the grid
const numCols = 20; // Number of columns in the grid

// Directions
const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const Index = () => {
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [gameOver, setGameOver] = useState(false);

  // Move the snake
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          setDirection(DIRECTIONS.UP);
          break;
        case "ArrowDown":
          setDirection(DIRECTIONS.DOWN);
          break;
        case "ArrowLeft":
          setDirection(DIRECTIONS.LEFT);
          break;
        case "ArrowRight":
          setDirection(DIRECTIONS.RIGHT);
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const moveSnake = () => {
      if (gameOver) return;

      const newSnake = [...snake];
      let head = { ...newSnake[newSnake.length - 1] };

      // Move head
      head.x += direction.x;
      head.y += direction.y;

      // Check game over conditions
      if (head.x >= numCols || head.x < 0 || head.y >= numRows || head.y < 0 || newSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return;
      }

      // Check if food is eaten
      if (head.x === food.x && head.y === food.y) {
        setFood({
          x: Math.floor(Math.random() * numCols),
          y: Math.floor(Math.random() * numRows),
        });
      } else {
        newSnake.shift(); // Remove tail
      }

      newSnake.push(head); // Add new head
      setSnake(newSnake);
    };

    const interval = setInterval(moveSnake, 200);

    return () => clearInterval(interval);
  }, [snake, direction, gameOver, food]);

  return (
    <Flex direction="column" align="center" justify="center" h="100vh">
      <Box w={`${numCols * cellSize}px`} h={`${numRows * cellSize}px`} bg="gray.700" position="relative">
        {snake.map((segment, index) => (
          <Box key={index} position="absolute" bg="green.500" w={`${cellSize}px`} h={`${cellSize}px`} left={`${segment.x * cellSize}px`} top={`${segment.y * cellSize}px`} />
        ))}
        <Box position="absolute" bg="red.500" w={`${cellSize}px`} h={`${cellSize}px`} left={`${food.x * cellSize}px`} top={`${food.y * cellSize}px`} />
      </Box>
      {gameOver && (
        <Text fontSize="2xl" color="red.500">
          Game Over
        </Text>
      )}
      <Flex mt="4">
        <Button onClick={() => setDirection(DIRECTIONS.LEFT)}>
          <FaArrowLeft />
        </Button>
        <Button onClick={() => setDirection(DIRECTIONS.UP)}>
          <FaArrowUp />
        </Button>
        <Button onClick={() => setDirection(DIRECTIONS.DOWN)}>
          <FaArrowDown />
        </Button>
        <Button onClick={() => setDirection(DIRECTIONS.RIGHT)}>
          <FaArrowRight />
        </Button>
      </Flex>
    </Flex>
  );
};

export default Index;

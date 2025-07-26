const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const rows = 20;
const cols = 20;
const cellSize = canvas.width / cols;

let player = { x: 0, y: 0 };

const maze = Array.from({ length: rows }, () =>
  Array(cols).fill(1) // 1 = wall, 0 = path
);

// Recursive Backtracking Maze Generator
function generateMaze(x = 0, y = 0) {
  const dir = [
    [0, -2], [0, 2],
    [-2, 0], [2, 0]
  ];
  maze[y][x] = 0;

  shuffle(dir).forEach(([dx, dy]) => {
    const nx = x + dx, ny = y + dy;
    if (
      ny >= 0 && ny < rows &&
      nx >= 0 && nx < cols &&
      maze[ny][nx] === 1
    ) {
      maze[y + dy / 2][x + dx / 2] = 0;
      generateMaze(nx, ny);
    }
  });
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function drawMaze() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      ctx.fillStyle = maze[y][x] === 1 ? "#444" : "#222";
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }

  // Draw exit
  ctx.fillStyle = "green";
  ctx.fillRect((cols - 1) * cellSize, (rows - 1) * cellSize, cellSize, cellSize);

  // Draw player
  ctx.fillStyle = "red";
  ctx.fillRect(player.x * cellSize, player.y * cellSize, cellSize, cellSize);
}

function movePlayer(dx, dy) {
  const newX = player.x + dx;
  const newY = player.y + dy;
  if (
    newX >= 0 && newX < cols &&
    newY >= 0 && newY < rows &&
    maze[newY][newX] === 0
  ) {
    player.x = newX;
    player.y = newY;
    drawMaze();
    checkWin();
  }
}

function checkWin() {
  if (player.x === cols - 1 && player.y === rows - 1) {
    alert("🎉 You escaped the maze!");
    resetGame();
  }
}

function resetGame() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      maze[y][x] = 1;
    }
  }
  generateMaze(0, 0);
  player = { x: 0, y: 0 };
  drawMaze();
}

// Key handling
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") movePlayer(0, -1);
  if (e.key === "ArrowDown") movePlayer(0, 1);
  if (e.key === "ArrowLeft") movePlayer(-1, 0);
  if (e.key === "ArrowRight") movePlayer(1, 0);
});

// Start the game
resetGame();

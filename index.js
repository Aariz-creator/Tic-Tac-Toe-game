const boxes = document.querySelectorAll(".box");
const gameInfo = document.querySelector(".game-info");
const newGameBtn = document.querySelector(".btn");
const page1=document.querySelector(".page1");
const page2=document.querySelector(".page2");
const startBtn=document.querySelector(".start-btn");
const playerInput=document.querySelector(".player-input");




let board;
let currentPlayer;

const HUMAN = "X";
const AI = "O";

const winningCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

startBtn.addEventListener("click", () => {
  if (playerInput.value.trim() === "") {
    alert("Please enter your name");
    return;
  }

  playerName = playerInput.value.trim();

  page1.classList.remove("active");
  page2.classList.add("active");

});

initGame();

function initGame() {
  board = Array(9).fill("");
  currentPlayer = HUMAN;
  gameInfo.textContent = `Your Turn  {playerName}`;
  newGameBtn.classList.remove("active");

  boxes.forEach((box, i) => {
    box.textContent = "";
    box.className = `box box${i + 1}`;
    box.style.pointerEvents = "all";
    box.addEventListener("click", () => handleHumanMove(i), { once: true });
  });
}

function handleHumanMove(index) {
  if (board[index] !== "") return;

  makeMove(index, HUMAN);
  if (checkWinner(board, HUMAN) || isTie()) return;

  gameInfo.textContent = "AI is thinking";
  setTimeout(() => {
    
  gameInfo.textContent = `c'mon ${playerName}, make the move`;
    const bestMove = minimax(board, AI).index;
    makeMove(bestMove, AI);
    if (!checkWinner(board, AI)) isTie();
  }, 400);
}

function makeMove(index, player) {
  board[index] = player;
  boxes[index].textContent = player;
  boxes[index].classList.add("pop");
}

function checkWinner(bd, player) {
  for (let combo of winningCombos) {
    if (combo.every(i => bd[i] === player)) {
      combo.forEach(i => boxes[i].classList.add("win"));
      endGame(player === HUMAN ? "You Win 🎉" : "AI Wins 🤖");
      return true;
    }
  }
  return false;
}

function isTie() {
  if (board.every(cell => cell !== "")) {
    endGame("It's a Tie 🤝");
    return true;
  }
  return false;
}

function endGame(message) {
  gameInfo.textContent = message;
  newGameBtn.classList.add("active");
  boxes.forEach(box => box.style.pointerEvents = "none");
}

/* ---------- MINIMAX ---------- */
function minimax(newBoard, player) {
  const emptySpots = newBoard
    .map((v, i) => v === "" ? i : null)
    .filter(v => v !== null);

  if (checkWinSim(newBoard, HUMAN)) return { score: -10 };
  if (checkWinSim(newBoard, AI)) return { score: 10 };
  if (emptySpots.length === 0) return { score: 0 };

  let moves = [];

  for (let i of emptySpots) {
    let move = {};
    move.index = i;
    newBoard[i] = player;

    move.score = player === AI
      ? minimax(newBoard, HUMAN).score
      : minimax(newBoard, AI).score;

    newBoard[i] = "";
    moves.push(move);
  }

  return player === AI
    ? moves.reduce((best, m) => m.score > best.score ? m : best)
    : moves.reduce((best, m) => m.score < best.score ? m : best);
}

function checkWinSim(board, player) {
  return winningCombos.some(c => c.every(i => board[i] === player));
}

newGameBtn.addEventListener("click", initGame);

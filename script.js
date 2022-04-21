const gameboard = (() => {
  let remainingPiecePlaces = 9;
  const gameContainer = document.getElementById("gameContainer");
  const blankGrid = [["", "", ""], ["", "", ""], ["", "", ""]];
  let grid = blankGrid;
  const displayBoard = () => grid.forEach((row) => console.log(row));
  function clearGrid() { grid = blankGrid; remainingPiecePlaces = 9; }
  const squareBlank = (row, col) => grid[row][col] === "";
  function placePiece(player, row, col) {
    grid[row][col] = player;
    remainingPiecePlaces--;
  }

  const writeToPage = function () {
    for (let rowNum = 0; rowNum < 3; rowNum++) {
      for (let colNum = 0; colNum < 3; colNum++) {
        document.getElementById(`${rowNum}${colNum}`).textContent = grid[rowNum][colNum];
      }
    }
  };
  function checkForWinner() {
    for (let index = 0; index < 3; index++) {
      if (allSame(grid[index])) {
        return grid[index][0]
      }
      if (allSame([grid[0][index], grid[1][index], grid[2][index]])) {
        return grid[0][index]
      }
    }
    if (allSame([grid[0][0], grid[1][1], grid[2][2]]) || allSame([grid[2][0], grid[1][1], grid[0][2]])) {
      return grid[1][1]
    }
    if (remainingPiecePlaces=== 0){
      return "tie"
    }
    return ""
  }
  const allSame = array => array.every(v => v === array[0])
  return { grid, clearGrid, placePiece, squareBlank, writeToPage, checkForWinner }
})();

const [player1, player2] = (() => {
  const player1Marker = "X";
  const player2Marker = "O";
  let player1Turn = false;
  let player2Turn = false;
  let player1Name = "player1";
  let player2Name = "player2";

  return [{ marker: player1Marker, turn: player1Turn, name: player1Name }, { marker: player2Marker, turn: player2Turn, name: player2Name }]
})();

const game = (() => {
  let currentPlayer;
  let opponentPlayer;
  let winner;
  document.querySelectorAll(".block").forEach((block) => block.addEventListener("click", processClick))
  const gameStatusContainer = document.getElementById("gameStatusContainer");
  let validPlay = false;
  function displayStatus(status) {
    gameStatusContainer.textContent = status;
  }
  function switchPlayers() {
    if (currentPlayer === player1) {
      currentPlayer = player2;
    } else {
      currentPlayer = player1;
    }
  }
  function processClick(e) {
    let targetID = e.target.id;
    let targetRow = targetID[0];
    let targetCol = targetID[1];
    if (gameboard.squareBlank(targetRow, targetCol)) {
      validPlay = true;
    } else {
      return
    }
    gameboard.placePiece(currentPlayer.marker, targetRow, targetCol);
    gameboard.writeToPage();
    if (gameboard.checkForWinner() !== "") {
      if (gameboard.checkForWinner() == "tie"){
        displayStatus("The game ended in a tie!"); 
      } else {
        winner = gameboard.checkForWinner() === player1.marker ? player1 : player2;
        displayStatus(`${winner.marker} won the game`)
      }
      document.querySelectorAll(".block").forEach((block) => block.removeEventListener("click", processClick))
      return
    }
    switchPlayers();
    displayStatus(`${currentPlayer.marker} turn`);

  }
  function start() {
    currentPlayer = Math.random() > .5 ? player1 : player2;
    displayStatus(`${currentPlayer.marker} goes first`);
  }
  return { start }
})();

game.start()

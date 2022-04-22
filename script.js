const gameboard = (() => {
  let remainingPiecePlaces = 9;
  const blankGrid = () => [["", "", ""], ["", "", ""], ["", "", ""]];
  let grid = blankGrid();
  const returnGrid = () => grid;
  function displayBoard(){console.table(grid)};
  function clearGrid() { 
    grid = blankGrid(); 
    remainingPiecePlaces = 9; 
    writeToPage();
    document.querySelectorAll(".block").forEach((block)=>block.classList.remove("winner"));
  }
  const squareBlank = (row, col) => grid[row][col] === "";
  function placePiece(player, row, col) {
    grid[row][col] = player;
    remainingPiecePlaces--;
  }

  function writeToPage() {
    for (let rowNum = 0; rowNum < 3; rowNum++) {
      for (let colNum = 0; colNum < 3; colNum++) {
        document.getElementById(`${rowNum}${colNum}`).textContent = grid[rowNum][colNum];
      }
    }
  };
  function checkForWinner() {
    for (let index = 0; index < 3; index++) {
      if (allSame(grid[index])&& grid[index][1] !== "") {
        return [grid[index][0], [index+"0",index+"1",index+"2"]]
      }
      if (allSame([grid[0][index], grid[1][index], grid[2][index]])&& grid[1][index] !== "") {
        return [grid[0][index], ["0"+index,"1"+index, "2"+index]]
      }
    }
    if (allSame([grid[0][0], grid[1][1], grid[2][2]])&& grid[1][1] !== "") {
      return [grid[1][1], ["00","11","22"]]
    }
    if (allSame([grid[2][0], grid[1][1], grid[0][2]])&& grid[1][1] !== ""){
      return [grid[1][1], ["20", "11", "02"]]
    }
    if (remainingPiecePlaces=== 0){
      return ["tie",[]]
    }
    return ["",[]]
  }
  function colorWinners(){
    checkForWinner()[1].forEach(id=>document.getElementById(id).classList.add("winner"));    
  }

  const allSame = array => array.every(v => v === array[0])
  return {returnGrid, clearGrid, placePiece, squareBlank, writeToPage, checkForWinner,displayBoard, colorWinners }
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
    if (gameboard.checkForWinner()[0] !== "") {
      if (gameboard.checkForWinner()[0] == "tie"){
        displayStatus("The game ended in a tie!"); 
      } else {
        winner = gameboard.checkForWinner()[0] === player1.marker ? player1 : player2;
        displayStatus(`${winner.name} won the game`);
        gameboard.colorWinners();
      }
      document.querySelectorAll(".block").forEach((block) => block.removeEventListener("click", processClick))
      return
    }
    switchPlayers();
    displayStatus(`${currentPlayer.name}'s turn`);

  }

  function watchForStart(e){
    e.preventDefault()
    reset()
    let formData = new FormData(document.getElementById("playerEntryForm"));
    player1.marker = formData.get("player1Marker");
    player1.name = formData.get("player1Name");
    player2.marker = formData.get("player2Marker");
    player2.name = formData.get("player2Name");
    document.getElementById("startGameButton").setAttribute("value", "Restart Game");
    start()

  }
  function start() {
    document.querySelectorAll(".block").forEach((block) => block.addEventListener("click", processClick))
    currentPlayer = Math.random() > .5 ? player1 : player2;
    displayStatus(`${currentPlayer.name} goes first`);
  }
  function reset() {
    gameboard.clearGrid();
  }

  return { start, reset, watchForStart }
})();
document.getElementById("playerEntryForm").onsubmit = (e) => game.watchForStart(e)

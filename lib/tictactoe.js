class TicTacToe {
  constructor(playerX, playerO) {
    this.board = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
    ];
    this.playerX = playerX;
    this.playerO = playerO;
    this.currentTurn = playerX;
    this.winner = null;
    this.moves = 0;
  }

  getBoard() {
    return this.board.map(row => row.join(' | ')).join('\n---------\n');
  }

  isValidMove(position) {
    for (let row of this.board) {
      if (row.includes(position)) return true;
    }
    return false;
  }

  makeMove(position, player) {
    if (player !== this.currentTurn || !this.isValidMove(position)) return false;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[i][j] === position) {
          this.board[i][j] = (player === this.playerX) ? '❌' : '⭕';
          this.moves++;
          this.checkWin();
          this.currentTurn = (this.currentTurn === this.playerX) ? this.playerO : this.playerX;
          return true;
        }
      }
    }
    return false;
  }

  checkWin() {
    const b = this.board;
    const winPatterns = [
      // Rows
      [b[0][0], b[0][1], b[0][2]],
      [b[1][0], b[1][1], b[1][2]],
      [b[2][0], b[2][1], b[2][2]],
      // Columns
      [b[0][0], b[1][0], b[2][0]],
      [b[0][1], b[1][1], b[2][1]],
      [b[0][2], b[1][2], b[2][2]],
      // Diagonals
      [b[0][0], b[1][1], b[2][2]],
      [b[0][2], b[1][1], b[2][0]]
    ];

    for (let pattern of winPatterns) {
      if (pattern.every(cell => cell === '❌')) {
        this.winner = this.playerX;
        return;
      }
      if (pattern.every(cell => cell === '⭕')) {
        this.winner = this.playerO;
        return;
      }
    }

    if (this.moves >= 9) {
      this.winner = 'draw';
    }
  }

  isGameOver() {
    return this.winner !== null;
  }
}

module.exports = TicTacToe;


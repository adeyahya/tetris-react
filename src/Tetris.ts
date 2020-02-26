import Color from 'color';
import Tetrominoes, {ColorMap} from './tetrominoes';

interface TetrisArgs {
  canvas: HTMLCanvasElement;
  squareSize?: number;
  strokeColor?: string;
  boardColor?: string;
  rowSize?: number;
  columnSize?: number;
}

interface TetrisInterface {
  drawBoard(): void;
  drawSquare(x: number, y: number, color?: string): void;
  randomizeTetromino(): void;
}

class Tetris implements TetrisInterface {
  ctx: CanvasRenderingContext2D;
  squareSize: number;
  strokeColor: string;
  boardColor: string;
  rowSize: number;
  columnSize: number;
  board: string[][];
  activeTetromino: number[][];
  activeTetrominoKey: string;
  activeTetrominoN: number;
  x: number;
  y: number;
  isGameOver: boolean;
  score: number;
  dropStart: number;
  speed: number; // block per second
  constructor(args: TetrisArgs) {
    this.ctx = args.canvas.getContext('2d');
    this.squareSize = args.squareSize || 20;
    this.strokeColor = args.strokeColor || '#e2e2e2';
    this.boardColor = args.boardColor || 'white';
    this.rowSize = args.rowSize || 20;
    this.columnSize = args.columnSize || 10;
    this.activeTetromino = [];
    this.activeTetrominoN = 0;
    this.activeTetrominoKey = 'L';
    this.x = 3;
    this.y = -2;
    this.isGameOver = false;
    this.score = 0;
    this.dropStart = 0;
    this.speed = 1;
    this.board = (() => {
      let board = [];
      for (let row = 0; row < this.rowSize; row++) {
        board[row] = [];
        for(let column = 0; column < this.columnSize; column++){
          board[row][column] = this.boardColor;
        }
      }
      return board;
    })();
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      switch (event.code) {
        case "ArrowDown":
          this.moveDown();
          break;
        case "ArrowRight":
          this.moveRight();
          break;
        case "ArrowLeft":
          this.moveLeft();
          break;
        case "ArrowUp":
          this.rotate();
          break;
        default:
          // do noting
      }
    });
  }

  randomizeTetromino() {
    const tetrominoeKeys = Object.keys(Tetrominoes);
    const n = Math.floor(Math.random() * tetrominoeKeys.length);
    this.activeTetrominoKey = tetrominoeKeys[n];
    this.activeTetromino = Tetrominoes[this.activeTetrominoKey][this.activeTetrominoN];
    this.y = - 2;
    this.x = 3;
  }

  fill(color: string = this.boardColor, lock = false, unDraw = false) {
    if (this.activeTetromino === null) return;
    for(let r = 0; r < this.activeTetromino.length; r++){
      for(let c = 0; c < this.activeTetromino.length; c++){
        if(this.activeTetromino[r][c]){
          this.drawSquare(this.x + c,this.y + r, color, unDraw);
          if (lock) {
            if (this.board[this.y + r] && this.board[this.y + r][this.x + c]) {
              this.board[this.y + r][this.x + c] = color;
            }
          }
        }
      }
    }
  }

  rotate() {
    // tetromino only has 4 variant
    const nextN = (this.activeTetrominoN + 1) % 4;
    const nextPattern = Tetrominoes[this.activeTetrominoKey][nextN]
    let kick = 0;

    if (this.collision(0, 0, nextPattern)) {
      if (this.x > this.columnSize / 2) {
        kick = -1;
      } else {
        kick = 1;
      }
    }

    if (!this.collision(kick, 0, nextPattern)) {
      this.unDraw();
      this.x += kick;
      this.activeTetrominoN = nextN;
      this.activeTetromino = Tetrominoes[this.activeTetrominoKey][nextN];
      this.draw();
    }
  }

  moveRight() {
    if (!this.collision(1,0,this.activeTetromino)) {
      this.unDraw();
      this.x++;
      this.draw();
    }
  }

  moveLeft() {
    if (!this.collision(-1,0,this.activeTetromino)) {
      this.unDraw();
      this.x--;
      this.draw();
    }
  }


  moveDown() {
    if (!this.activeTetromino.length) {
      this.randomizeTetromino();
    }
    
    if(!this.collision(0,1,this.activeTetromino)){
      this.unDraw();
      this.y++;
      this.draw();
    } else {
      this.lock();
      this.randomizeTetromino();
    }
  }

  lock() {
    for (let r = 0; r < this.activeTetromino.length; r++) {
      for (let c = 0; c < this.activeTetromino.length; c++) {
        if (!this.activeTetromino[r][c]) continue;

        if (this.y + r < 0) {
          this.isGameOver = true;
          alert("Game Over");
          break;
        }
      }
    }
    this.fill(ColorMap.get(this.activeTetrominoKey), true);

    for (let r = 0; r < this.rowSize; r++) {
      let isRowFull = true;
      for (let c = 0; c < this.columnSize; c++) {
        isRowFull = isRowFull && (this.board[r][c] !== this.boardColor);
      }

      if (isRowFull) {
        for (let y = r; y > 1; y--) {
          for (let c = 0; c < this.columnSize; c++) {
            this.board[y][c] = this.board[y-1][c];
          }
        }

        for(let c = 0; c < this.columnSize; c++){
          this.board[0][c] = this.boardColor;
        }

        this.score += 10;
        this.speed = (this.score / 100) + 1;
      }
    }

    this.drawBoard();
  }

  collision(x,y,tetromino){
    for (let r = 0; r < tetromino.length; r++){
      for (let c = 0; c < tetromino.length; c++){
        // if the square is empty, we skip it
        if (!tetromino[r][c]){
          continue;
        }
        // coordinates of the tetromino after movement
        let newX = this.x + c + x;
        let newY = this.y + r + y;
        
        // conditions
        if (newX < 0 || newX >= this.columnSize || newY >= this.rowSize){
          return true;
        }
        // skip newY < 0; board[-1] will crush our game
        if (newY < 0){
          continue;
        }
        // check if there is a locked tetromino alrady in place
        if (this.board[newY][newX] !== this.boardColor){
          return true;
        }
      }
    }
    return false;
  }

  draw() {
    this.fill(ColorMap.get(this.activeTetrominoKey));
  }

  unDraw() {
    this.fill(undefined, undefined, true);
  }

  drawBoard() {
    this.board.forEach((row, rowIndex) => {
      for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
        this.drawSquare(columnIndex, rowIndex, row[columnIndex], row[columnIndex] === this.boardColor);
      }
    })
  }

  drawSquare(x, y, color = this.boardColor, unDraw = false) {
    const targetX = x * this.squareSize;
    const targetY = y * this.squareSize;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(targetX, targetY, this.squareSize, this.squareSize);
    const strokeColor = Color(color).lighten(0.3).hex();
    this.ctx.lineWidth = this.squareSize / 15;
    this.ctx.strokeStyle = unDraw ? this.strokeColor : strokeColor;
    this.ctx.strokeRect(targetX, targetY, this.squareSize, this.squareSize);
  }

  drop = () => {
    let now = Date.now();
    let delta = now - this.dropStart;
    if (delta > (1000 / this.speed)) {
      this.moveDown();
      this.dropStart = Date.now();
    }

    if (!this.isGameOver) {
      requestAnimationFrame(this.drop);
    }
  }

  start() {
    this.drawBoard();
    this.dropStart = Date.now();
    this.drop();
  }
}

export default Tetris;

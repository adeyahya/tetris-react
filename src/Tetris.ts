import Tetrominoes from './tetrominoes';

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
  constructor(args: TetrisArgs) {
    this.ctx = args.canvas.getContext('2d');
    this.squareSize = args.squareSize || 20;
    this.strokeColor = args.strokeColor || 'black';
    this.boardColor = args.boardColor || 'white';
    this.rowSize = args.rowSize || 20;
    this.columnSize = args.columnSize || 10;
    this.activeTetromino = [];
    this.activeTetrominoN = 0;
    this.activeTetrominoKey = 'L';
    this.x = 3;
    this.y = -2;
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

  fill(color: string = this.boardColor, lock = false) {
    if (this.activeTetromino === null) return;
    for(let r = 0; r < this.activeTetromino.length; r++){
      for(let c = 0; c < this.activeTetromino.length; c++){
        if(this.activeTetromino[r][c]){
          this.drawSquare(this.x + c,this.y + r, color);
          if (lock) {
            this.board[this.y + r][this.x + c] = color;
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
    this.fill('blue', true);
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
    this.fill('blue');
  }

  unDraw() {
    this.fill();
  }

  drawBoard() {
    this.board.forEach((row, rowIndex) => {
      for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
        this.drawSquare(columnIndex, rowIndex);
      }
    })
  }

  drawSquare(x, y, color = this.boardColor) {
    const targetX = x * this.squareSize;
    const targetY = y * this.squareSize;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(targetX, targetY, this.squareSize, this.squareSize);

    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.strokeRect(targetX, targetY, this.squareSize, this.squareSize);
  }
}

export default Tetris;

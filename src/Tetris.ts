import * as Tetrominoes from './tetrominoes';

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
  activeTetromino: number[][][];
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
  }

  randomizeTetromino() {
    const tetrominoeKeys = Object.keys(Tetrominoes);
    const n = Math.floor(Math.random() * tetrominoeKeys.length);
    this.activeTetromino = Tetrominoes[tetrominoeKeys[n]][0];
  }

  fill(color: string = this.boardColor) {
    if (this.activeTetromino === null) return;
    for(let r = 0; r < this.activeTetromino.length; r++){
      for(let c = 0; c < this.activeTetromino.length; c++){
        if(this.activeTetromino[r][c]){
          this.drawSquare(this.x + c,this.y + r, color);
        }
      }
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
    }
  }

  collision(x,y,tetromino){
    for(let r = 0; r < tetromino.length; r++){
      for(let c = 0; c < tetromino.length; c++){
        // if the square is empty, we skip it
        if(!tetromino[r][c]){
          continue;
        }
        // coordinates of the tetromino after movement
        let newX = this.x + c + x;
        let newY = this.y + r + y;
        
        // conditions
        if(newX < 0 || newX >= this.columnSize || newY >= this.rowSize){
          return true;
        }
        // skip newY < 0; board[-1] will crush our game
        if(newY < 0){
          continue;
        }
        // check if there is a locked tetromino alrady in place
        if( this.board[newY][newX] !== this.boardColor){
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
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x*this.squareSize, y*this.squareSize, this.squareSize, this.squareSize);

    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.strokeRect(x*this.squareSize,y*this.squareSize,this.squareSize,this.squareSize);
  }
}

export default Tetris;

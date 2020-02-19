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
}

class Tetris implements TetrisInterface {
  ctx: CanvasRenderingContext2D;
  squareSize: number;
  strokeColor: string;
  boardColor: string;
  rowSize: number;
  columnSize: number;
  board: string[][];
  constructor(args: TetrisArgs) {
    this.ctx = args.canvas.getContext('2d');
    this.squareSize = args.squareSize || 20;
    this.strokeColor = args.strokeColor || 'black';
    this.boardColor = args.boardColor || 'white';
    this.rowSize = args.rowSize || 20;
    this.columnSize = args.columnSize || 10;
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

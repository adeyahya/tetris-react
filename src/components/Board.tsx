import React, {FunctionComponent, useRef, useEffect} from 'react';

const SQ = 40;
const ROW = 20;
const COL = 10;
// a VACANT (empty) square has a white (#FFF) color
const VACANT = '#FFF';

// now we define the board array.
let board: String[][] = [];

for ( let r = 0; r < ROW; r++){
  board[r] = [];
  // let's create the columns
  for( let c = 0; c < COL; c++){
    board[r][c] = VACANT;
    // when we first draw the board all the square are empty, so every square has the value "#FFF".
  }
}

const Board: FunctionComponent = () => {
  const canvas = useRef(null);

  const drawBoard = (ctx) => {
    board.forEach((item, i) => {
      item.forEach((child, j) => {
        ctx.fillStyle = child;
        ctx.strokeRect(j * SQ, i * SQ, SQ, SQ);
        ctx.fillRect(j * SQ, i * SQ, SQ, SQ);
      })
    })
  }

  useEffect(() => {
    if (canvas.current !== null) {
      const ctx = canvas.current.getContext('2d');
      ctx.strokeStyle = "black";
      drawBoard(ctx);
    }
  }, []);

  return (
    <canvas style={{
      border: 'solid black 4px'
    }} ref={canvas} width={400} height={800} />
  )
}

export default Board;

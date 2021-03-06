import React, {FunctionComponent, useRef, useEffect, useState} from 'react';
import Tetris from '../Tetris';

const Board: FunctionComponent = () => {
  const canvas: React.MutableRefObject<HTMLCanvasElement> = useRef();
  const tetris: React.MutableRefObject<Tetris> = useRef();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (canvas.current) {
      tetris.current = new Tetris({
        canvas: canvas.current,
        squareSize: 40,
        rowSize: 20,
        columnSize: 10,
      });

      tetris.current.start();
      setReady(true);
    }
  }, []);

  return (
    <>
      <canvas ref={canvas} width={400} height={800} />
    </>
  )
}

export default Board;

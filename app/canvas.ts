const CELL_SIZE = 10;

export function buildGrid(
  canvasContext: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  canvasContext.fillStyle = "#000";
  canvasContext.fillRect(0, 0, width, height);
  // const numCols = Math.floor(width / CELL_SIZE);
  // const numRows = Math.floor(height / CELL_SIZE);

  // for (let y = 0; y < numRows; y++) {
  //   for (let x = 0; x < numCols; x++) {
  //     if (y % 2 === 0) {
  //       canvasContext.fillStyle = x % 2 === 0 ? "#fff" : "#ccc";
  //     } else {
  //       canvasContext.fillStyle = x % 2 !== 0 ? "#fff" : "#ccc";
  //     }

  //     canvasContext.fillRect(
  //       x * CELL_SIZE,
  //       y * CELL_SIZE,
  //       CELL_SIZE,
  //       CELL_SIZE
  //     );
  //   }
  // }
}

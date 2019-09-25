import { remote, ipcRenderer } from 'electron';
import { Game } from './engine';

const FPS = 60;
const FRAME_TARGET_TIME = 1000 / FPS;

// import { GAME_HEIGHT, GAME_WIDTH } from "../constants.js";
// import { buildGrid } from "./canvas";
import './styles.scss';
// import { Game } from "./game";

window.addEventListener('load', () => {
  const gameWidth = window.innerWidth;
  const gameHeight = window.innerHeight;

  const root = document.getElementById('game');
  const assetPath = remote.app.getAppPath();

  if (root) {
    const game = new Game(
      root,
      gameWidth,
      gameHeight,
      `${assetPath}/assets/`,
      FRAME_TARGET_TIME,
      () => {
        ipcRenderer.send('quit');
      }
    );

    game.initialize();
    game.start();
  } else {
    throw new Error('cannot find root');
  }
});

// window.addEventListener("load", () => {
//   const canvas = document.getElementById("game-window") as HTMLCanvasElement;

//   // const gameWidth = window.innerWidth;
//   // const gameHeight = window.innerHeight;

//   // canvas.height = gameHeight;
//   // canvas.width = gameWidth;

//   const context = canvas.getContext("2d");

//   if (context) {
//     const game = new Game(context, GAME_WIDTH, GAME_HEIGHT);

//     game.initialize();

//     // const assetPath = remote.app.getAppPath();

//     // fs.readFile(`${assetPath}/assets/images/truck-down.png`, "base64")
//     //   // .then(buffer => buffer.toString("base64"))
//     //   .then(base64String => `data:image/png;base64,${base64String}`)
//     //   .then(url => {
//     //     const image = new Image();
//     //     image.src = url;
//     //     image.addEventListener("load", function() {
//     //       console.log(image.width);
//     //       console.log("loaded image");
//     //       context.drawImage(image, 0, 0);
//     //     });
//     //   });
//     // .then(buffer => {
//     //   return buffer.toString("base64");
//     // })
//     // .then(b64 => `data:image/png;base64,${b64}`)
//     // .then(imgUrl => {
//     //   const img = new Image();
//     //   img.src = imgUrl;
//     //   console.log(imgUrl);
//     //   context.drawImage(img, 0, 0);
//     // });
//   }
// });

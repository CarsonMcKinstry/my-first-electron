import { remote } from "electron";
import { promises as fs } from "fs";
import { Rect } from "./Rect";

const assetPath = remote.app.getAppPath();

export class TextureManager {
  public static loadTexture(fileName: string): Promise<HTMLCanvasElement> {
    return new Promise(async (res, rej) => {
      const image = new Image();

      const file = await fs.readFile(
        `${assetPath}/assets/images/${fileName}`,
        "base64"
      );
      const fileString = `data:image/png;base64,${file}`;

      image.src = fileString;

      image.addEventListener("load", () => {
        const surface = document.createElement("canvas");

        surface.height = image.height;
        surface.width = image.width;

        const imageCanvasContext = surface.getContext("2d");

        if (imageCanvasContext) {
          imageCanvasContext.drawImage(image, 0, 0);
          res(surface);
        } else {
          rej(new Error("error loading image"));
        }
      });
    });
  }

  public static draw(
    texture: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    sourceRect: Rect,
    destinationRect: Rect,
    flip: boolean
  ) {
    context.drawImage(
      texture,
      sourceRect.x,
      sourceRect.y,
      sourceRect.w,
      sourceRect.h,
      destinationRect.x,
      destinationRect.y,
      destinationRect.w,
      destinationRect.h
    );
  }
}

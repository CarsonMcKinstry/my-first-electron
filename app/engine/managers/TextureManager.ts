import { promises as fs } from "fs";
import { Rect } from "../primitives/Rect";

export class TextureManager {
  public static loadTexture(assetPath: string): Promise<HTMLCanvasElement> {
    return new Promise(async (res, rej) => {
      const image = new Image();

      const file = await fs.readFile(assetPath, "base64");

      image.src = `data:image/png;base64,${file}`;

      image.addEventListener("load", () => {
        const surface = document.createElement("canvas");

        surface.width = image.width;
        surface.height = image.height;

        const surfaceContext = surface.getContext("2d");

        if (surfaceContext) {
          surfaceContext.drawImage(image, 0, 0);
          res(surface);
        } else {
          rej(new Error("error loading image"));
        }
      });
    });
  }

  public static draw(
    texture: HTMLCanvasElement,
    buffer: CanvasRenderingContext2D,
    src: Rect,
    dest: Rect
  ): void {
    buffer.drawImage(
      texture,
      src.x,
      src.y,
      src.width,
      src.height,
      dest.x,
      dest.y,
      dest.width,
      dest.height
    );
  }
}

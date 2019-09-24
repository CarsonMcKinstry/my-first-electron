// import { EntityManager } from "./EntityManager";
import { TextureManager } from './TextureManager';

export class AssetManager {
  constructor(private readonly assetBase: string) {}
  private _textures: Map<string, HTMLCanvasElement> = new Map();

  public async addTexture(textureId: string, fileName: string): Promise<void> {
    const texture = await TextureManager.loadTexture(
      `${this.assetBase}/${fileName}`
    );

    this._textures.set(textureId, texture);
  }

  public getTexture(textureId: string): HTMLCanvasElement {
    if (this._textures.has(textureId)) {
      return this._textures.get(textureId) as HTMLCanvasElement;
    } else {
      throw new Error(`Texture with textureId: ${textureId} doesn't exist`);
    }
  }

  public clearTextures() {
    this._textures.clear();
  }
}

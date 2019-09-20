// import { EntityManager } from "./EntityManager";
import { TextureManager } from "./TextureManager";

export class AssetManager {
  // constructor(private manager: EntityManager) {}

  private _textures: Map<string, HTMLCanvasElement> = new Map();

  public async addTexture(textureId: string, assetPath: string): Promise<void> {
    const texture = await TextureManager.loadTexture(assetPath);

    this._textures.set(textureId, texture);
  }

  public getTexture(textureId: string): HTMLCanvasElement {
    // @ts-ignore
    return this._textures.get(textureId);
  }

  public clearTextures() {
    this._textures.clear();
  }
}

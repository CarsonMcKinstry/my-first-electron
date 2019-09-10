import { TextureManager } from "./TextureManager";
import { EntityManager } from "./EntityManager";

export class AssetManager {
  constructor(private manager: EntityManager) {}
  private _textures: Map<string, HTMLCanvasElement> = new Map();

  public async addTexture(textureId: string, fileName: string): Promise<void> {
    const texture = await TextureManager.loadTexture(fileName);

    this._textures.set(textureId, texture);
  }

  public getTexture(textureId: string): HTMLCanvasElement {
    // @ts-ignore
    return this._textures.get(textureId);
  }

  public clearDate() {
    this._textures.clear();
  }
}

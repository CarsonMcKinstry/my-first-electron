import { LayerType } from "./types";
import { AssetManager } from "./managers/AssetManager";
import { Vector } from "./primitives/Vector";
import { TileComponent } from "./components/TileComponent";
import uuid from "uuid/v4";
import { EntityManager } from "./managers/EntityManager";
import { Rect } from "./primitives/Rect";
import { promises as fs } from "fs";

export class GameMap {
  constructor(
    private readonly textureId: string,
    private scale: number,
    private readonly tileSize: number,
    private enitityManager: EntityManager,
    private assetManger: AssetManager,
    private buffer: CanvasRenderingContext2D,
    private camera: Rect
  ) {}

  async loadMap(filePath: string) {
    const texture = this.assetManger.getTexture(this.textureId);

    const mapFile = await fs
      .readFile(filePath)
      .then(buffer => buffer.toString("utf8"))
      .then(map => map.split("\n\n"))
      .then(([map]) => map)
      .then(map => map.split("\n"))
      .then(map => map.map(row => row.split(",")));

    mapFile.forEach((_, y) => {
      _.map((tile, x) => {
        const tilePos = tile.split("").map(Number);

        const source = new Rect(
          tilePos[1] * this.tileSize,
          tilePos[0] * this.tileSize,
          this.tileSize,
          this.tileSize
        );
        const position = new Vector(
          x * this.scale * this.tileSize,
          y * this.scale * this.tileSize
        );

        this.addTile(source, position, texture);
      });
    });
  }

  addTile(source: Rect, position: Vector, texture: HTMLCanvasElement) {
    const newTile = this.enitityManager.addEntity(
      `tile-${uuid()}`,
      LayerType.TILEMAP_LAYER
    );

    newTile.addComponent(
      new TileComponent(
        texture,
        this.buffer,
        source,
        position,
        this.tileSize,
        this.scale,
        this.camera
      )
    );
  }
}

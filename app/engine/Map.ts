import { LayerType, Vector, Rect, Canvas } from './_types';
import { AssetManager } from '../engine/managers/AssetManager';
import { TileComponent } from './components/TileComponent';
import uuid from 'uuid/v4';
import { EntityManager } from './managers/EntityManager';
import { promises as fs } from 'fs';
import { createRect, createVector } from './utils';
export class GameMap {
  constructor(
    private readonly textureId: string,
    private scale: number,
    private readonly tileSize: number,
    private enitityManager: EntityManager,
    private assetManger: AssetManager,
    private buffer: Canvas
  ) {}

  async loadMap(filePath: string) {
    const texture = this.assetManger.getTexture(this.textureId);

    const mapFile = await fs
      .readFile(filePath)
      .then(buffer => buffer.toString('utf8'))
      .then(map => map.split('\n\n'))
      .then(([map]) => map)
      .then(map => map.split('\n'))
      .then(map => map.map(row => row.split(',')));

    mapFile.forEach((_, y) => {
      _.map((tile, x) => {
        const tilePos = tile.split('').map(Number);
        const source = createRect(
          tilePos[1] * this.tileSize,
          tilePos[0] * this.tileSize,
          this.tileSize,
          this.tileSize
        );
        const position = createVector(
          x * this.scale * this.tileSize,
          y * this.scale * this.tileSize
        );

        this.addTile(source, position, texture);
      });
    });
  }

  addTile(source: Rect, position: Vector, texture: HTMLCanvasElement) {
    const newTile = this.enitityManager.create(
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
        this.scale
        // this.camera
      )
    );
  }
}

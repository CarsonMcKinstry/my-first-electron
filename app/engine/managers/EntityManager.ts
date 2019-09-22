import { LayerType } from "./../types";
import { Entity } from "../entities/Entity";

export class EntityManager {
  private _entities: Map<string, Entity> = new Map();

  get hasNoEntities() {
    return this.entityCount === 0;
  }

  get entities() {
    return this._entities;
  }

  get entityCount() {
    return this._entities.size;
  }

  public update(
    deltaTime: number,
    ticks: number,
    gameWidth?: number,
    gameHeight?: number
  ): void {
    this.entities.forEach(entity => {
      entity.update(deltaTime, ticks, gameWidth, gameHeight);
    });
  }

  public render(buffer: CanvasRenderingContext2D): void {
    for (const layer of Object.values(LayerType)) {
      const entities = this.getEntitiesByLayer(layer);

      entities.forEach(entity => {
        entity.render(buffer);
      });
    }
  }

  public addEntity(name: string, layer: LayerType): Entity {
    const entity = new Entity(this, layer, name);

    this._entities.set(name, entity);

    return entity;
  }

  public getEntities(entityId: string) {
    return this._entities.get(entityId);
  }

  public getEntitiesByLayer(layer: LayerType) {
    const entities = [];

    for (const [_, entity] of this._entities) {
      if (entity.layer === layer) {
        entities.push(entity);
      }
    }

    return entities;
  }

  public clearEntities(): void {
    this._entities.clear();
  }
}

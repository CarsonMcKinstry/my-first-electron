import { Canvas, LayerType, Rect } from '../_types';
import { Entity } from '../Entity';

export class EntityManager {
  private _entities: Map<string, Entity> = new Map();

  get hasNoEntites() {
    return this.entityCount === 0;
  }

  get entities() {
    return this._entities;
  }

  get entityCount() {
    return this._entities.size;
  }

  public clearEntities(): void {
    this.entities.clear();
  }

  public create(name: string, layer: LayerType) {
    const entity = new Entity(layer, name);

    this._entities.set(name, entity);

    return entity;
  }

  public getEntity(entityId: string) {
    if (this._entities.has(entityId)) {
      return this._entities.get(entityId);
    } else {
      throw new Error(`Entity with the entityId ${entityId} does not exist`);
    }
  }

  public getEntitiesBylayer(layer: LayerType): Entity[] {
    const entities = [];

    for (const [_, entity] of this.entities) {
      if (entity.layer === layer) {
        entities.push(entity);
      }
    }

    return entities;
  }

  public update(
    deltaTime: number,
    ticks: number,
    gameWidth: number,
    gameHeight: number,
    camera: Rect
  ): void {
    for (const [_, entity] of this.entities) {
      entity.update(deltaTime, ticks, gameWidth, gameHeight, camera);
    }
  }

  public render(buffer: Canvas): void {
    for (const layer of Object.values(LayerType)) {
      const entities = this.getEntitiesBylayer(layer as LayerType);

      for (const entity of entities) {
        entity.render(buffer);
      }
    }
  }
}

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

  public update(deltaTime: number, ticks: number): void {
    this.entities.forEach(entity => {
      entity.update(deltaTime, ticks);
    });
  }

  public render(buffer: CanvasRenderingContext2D): void {
    this.entities.forEach(entity => {
      entity.render(buffer);
    });
  }

  public addEntity(name: string): Entity {
    const entity = new Entity(this, name);

    this._entities.set(name, entity);

    return entity;
  }

  public clearEntities(): void {
    this._entities.clear();
  }
}

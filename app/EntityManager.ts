import { Entity } from "./Entity";

export class EntityManager {
  private _entities: Map<string, Entity> = new Map();

  get hasNoEntities() {
    return this.entityCount === 0;
  }

  get entities() {
    return this._entities;
  }

  get entityCount(): number {
    return this._entities.size;
  }

  public update(deltaTime: number): void {
    for (const entity of this._entities.values()) {
      entity.update(deltaTime);
    }
  }

  public render(context: CanvasRenderingContext2D): void {
    for (const entity of this._entities.values()) {
      entity.render(context);
    }
  }

  public addEntity(name: string): Entity {
    const entity = new Entity(this, name);

    this._entities.set(name, entity);

    return entity;
  }

  public clearData(): void {
    this._entities.clear();
  }
}

import { LayerType, Canvas, Rect } from './_types';
// import { EntityManager } from './managers/EntityManager';
import { Component } from './Component';

export class Entity {
  private _isActive: boolean = true;
  private components: Map<string, Component> = new Map();

  constructor(
    // private owner: EntityManager,
    private _layer: LayerType,
    private readonly _name?: string
  ) {}

  get name() {
    return this._name;
  }

  get layer() {
    return this._layer;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  public destroy(): void {
    this._isActive = false;
  }

  public update(
    deltaTime: number,
    ticks: number,
    gameWidth: number,
    gameHeight: number,
    camera: Rect
  ): void {
    for (const component of this.components.values()) {
      component.update(deltaTime, ticks, gameWidth, gameHeight, camera);
    }
  }

  public render(buffer: Canvas): void {
    for (const component of this.components.values()) {
      component.render(buffer);
    }
  }

  public addComponent<C extends Component>(component: C): C {
    const name = component.constructor.name;

    this.components.set(name, component);

    component.initialize();

    return component;
  }

  public getComponent<C extends Component>(componentId: string): C {
    if (this.hasComponent(componentId)) {
      return this.components.get(componentId) as C;
    } else {
      throw new Error(
        `Unable to find component with id ${componentId}${
          this._name ? ' in enitity ' + this._name : ''
        }.`
      );
    }
  }

  public hasComponent(componentId: string): boolean {
    return this.components.has(componentId);
  }
}

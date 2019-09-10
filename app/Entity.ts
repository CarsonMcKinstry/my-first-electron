import { Component } from "./Component";
import { EntityManager } from "./EntityManager";

export class Entity {
  private _isActive: boolean;
  private components: Map<string, Component> = new Map();

  constructor(private manager: EntityManager, private readonly _name?: string) {
    this._isActive = true;
  }

  get name() {
    return this._name;
  }

  public update(deltaTime: number): void {
    for (const component of this.components.values()) {
      component.update(deltaTime);
    }
  }
  public render(context: CanvasRenderingContext2D): void {
    for (const component of this.components.values()) {
      component.render(context);
    }
  }
  public destroy(): void {
    this._isActive = false;
  }

  public get isActive(): boolean {
    return this._isActive;
  }

  public addComponent<C extends Component>(name: string, component: C): C {
    this.components.set(name, component);

    component.intialize();

    return component;
  }

  public getComponent<C extends Component>(componentId: string): C {
    // @ts-ignore
    return this.components.get(componentId);
  }

  public hasComponent(componentId: string): boolean {
    return this.components.has(componentId);
  }
}

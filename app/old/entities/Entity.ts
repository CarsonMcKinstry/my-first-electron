import { LayerType } from "../types";
import { Component } from "../components/Component";
import { EntityManager } from "../managers/EntityManager";

export class Entity {
  private _isActive: boolean = true;
  private components: Map<string, Component> = new Map();

  constructor(
    private manager: EntityManager,
    public layer: LayerType,
    private readonly _name?: string
  ) {}

  get name() {
    return this._name;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  public update(
    deltaTime: number,
    ticks: number,
    gameWidth?: number,
    gameHeight?: number
  ): void {
    this.components.forEach(component => {
      component.update(deltaTime, ticks, gameWidth, gameHeight);
    });
  }

  public render(buffer: CanvasRenderingContext2D): void {
    this.components.forEach(component => {
      component.render(buffer);
    });
  }

  public destory(): void {
    this._isActive = false;
  }

  public addComponent<C extends Component>(component: C): C {
    const name = component.constructor.name;

    this.components.set(name, component);

    component.initialize();

    return component;
  }

  public getComponent(componentId: string): Component | undefined {
    return this.components.get(componentId);
  }

  public hasComponent(componentId: string): boolean {
    return this.components.has(componentId);
  }
}

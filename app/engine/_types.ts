export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Vector {
  x: number;
  y: number;
}

export interface Canvas {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
}

export enum LayerType {
  TILEMAP_LAYER = 0,
  VEGETATION_LAYER = 1,
  ENEMIES_LAYER = 2,
  PLAYER_LAYER = 3,
  PROJECTILE_LAYER = 4,
  UI_LAYER = 5
}

export interface AnimationOptions {
  numFrames: number;
  animationSpeed: number;
  hasDirections: boolean;
  isFixed: boolean;
  animationNames?: string[];
}

export interface Animation {
  index: number;
  numFrames: number;
  animationSpeed: number;
}

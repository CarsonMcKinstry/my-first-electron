export interface Canvas {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
}

export interface AnimationOptions {
  id: string;
  numFrames: number;
  animationSpeed: number;
  hasDirections: boolean;
  isFixed: boolean;
  animationNames?: string[];
}

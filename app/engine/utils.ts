import { curry } from 'lodash/fp';
import { Canvas, Rect, Vector, Animation } from './_types';

/**
 * Creates a canvas object containing the canvas itself and its context
 * @param width
 * @param height
 */
export const createCanvas = (width: number, height: number): Canvas => {
  const canvas = document.createElement('canvas');

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');

  return {
    canvas,
    context
  } as Canvas;
};

export const createRect = (
  x: number,
  y: number,
  w: number,
  h: number
): Rect => ({ x, y, w, h });
export const createVector = (x: number, y: number): Vector => ({ x, y });

interface OptionalVector {
  x?: number;
  y?: number;
}

export const repositionRect = curry((newPosition: OptionalVector, r: Rect) => {
  const nextRect = {
    ...r
  };
  if (newPosition.x !== undefined) {
    nextRect.x = newPosition.x;
  }
  if (newPosition.y !== undefined) {
    nextRect.y = newPosition.y;
  }
  return nextRect;
});

export const repositionVector = curry(
  (newPosition: OptionalVector, r: Vector) => {
    const nextVector = {
      ...r
    };
    if (newPosition.x !== undefined) {
      nextVector.x = newPosition.x;
    }
    if (newPosition.y !== undefined) {
      nextVector.y = newPosition.y;
    }
    return nextVector;
  }
);

export const scaleRect = curry((s: number | OptionalVector, r: Rect) => {
  if (typeof s === 'number') {
    return {
      ...r,
      w: r.w * s,
      h: r.h * s
    };
  }

  return {
    ...r,
    w: r.w * (s.x ? s.x : 1),
    h: r.h * (s.y ? s.y : 1)
  };
});

export const addVector = curry((v2: OptionalVector, v1: Vector) => {
  return {
    x: v1.x + (v2.x ? v2.x : 0),
    y: v1.y + (v2.y ? v2.y : 0)
  };
});

export const scaleVector = curry((s: number, v1: Vector) => {
  return {
    x: v1.x * s,
    y: v1.y * s
  };
});

export const clamp = (n: number, min: number, max: number) => {
  if (n < min) {
    return min;
  }

  if (n > max) {
    return max;
  }

  return n;
};

export const createAnimation = (
  index: number,
  numFrames: number,
  animationSpeed: number
): Animation => ({
  index,
  numFrames,
  animationSpeed
});

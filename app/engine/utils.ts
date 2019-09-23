import { Canvas } from './_types';

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

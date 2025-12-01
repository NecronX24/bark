import type bark from '@/index';
import { Reactive } from '@/reactive';

export type Color = 'red' | 'blue' | 'green' | 'cyan' | 'yellow' | 'magenta' | 'gray' | 'white' | 'black';

export const options = new Reactive<bark.Options>({
  showTimestamp: true,
});
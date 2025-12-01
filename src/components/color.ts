import pc from 'picocolors';
import { Formatter as PcFormatter } from 'picocolors/types';

import type { Color } from '@/options';

class ColorComponent {
  static #instance: ColorComponent;
  #colors: { [key in Color]: PcFormatter } = {
    'red': pc.red,
    'blue': pc.blue,
    'green': pc.green,
    'cyan': pc.cyan,
    'magenta': pc.magenta,
    'yellow': pc.yellow,
    'gray': pc.gray,
    'white': pc.white,
    'black': pc.black
  };

  private constructor() {}

  public static get instance(): ColorComponent {
    if (!ColorComponent.#instance) {
      ColorComponent.#instance = new ColorComponent();
    }
    return ColorComponent.#instance;
  }

  public format(color: Color | undefined) {
    return color ? this.#colors[color] : pc.white;
  }
}

export const color = ColorComponent.instance;
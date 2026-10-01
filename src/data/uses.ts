/** The /uses page: what I work with. Keep each item short; `note` is optional. */
export interface UsesItem {
  name: string;
  note?: string;
  url?: string;
}

export interface UsesGroup {
  /** Shown as a directory, e.g. `editor`. */
  name: string;
  items: readonly UsesItem[];
}

export const uses: readonly UsesGroup[] = [
  {
    name: 'editor',
    items: [
      { name: '[Editor]', note: '[theme, font, the one setting you would miss]' },
      { name: '[Key extension]', note: '[why it earns its place]' },
    ],
  },
  {
    name: 'terminal',
    items: [
      { name: '[Terminal app]', note: '[shell + prompt]' },
      { name: '[CLI tool]', note: '[what you use it for]' },
      { name: '[CLI tool]', note: '[what you use it for]' },
    ],
  },
  {
    name: 'hardware',
    items: [
      { name: '[Computer]', note: '[spec that matters]' },
      { name: '[Monitor]' },
      { name: '[Keyboard]', note: '[switches / layout]' },
    ],
  },
  {
    name: 'tools',
    items: [
      { name: '[Notes app]' },
      { name: '[Diagramming tool]', note: '[used for the architecture diagrams here]' },
      { name: '[Other tool]' },
    ],
  },
];

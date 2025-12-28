export enum PokemonType {
  Normal = '一般',
  Fire = '火',
  Water = '水',
  Grass = '草',
  Electric = '电',
  Ice = '冰',
  Fighting = '格斗',
  Poison = '毒',
  Ground = '地面',
  Flying = '飞行',
  Psychic = '超能力',
  Bug = '虫',
  Rock = '岩石',
  Ghost = '幽灵',
  Dragon = '龙',
  Steel = '钢',
  Fairy = '妖精',
}

export interface Move {
  name: string;
  type: PokemonType;
  power: number;
  accuracy: number;
  pp: number;
  maxPp: number;
}

export interface Pokemon {
  id: number;
  name: string;
  type: PokemonType[];
  maxHp: number;
  currentHp: number;
  attack: number;
  defense: number;
  speed: number;
  moves: Move[];
  spriteFront: string;
  spriteBack: string;
}

export interface BattleLog {
  message: string;
  turn: number;
}

export enum TurnPhase {
  PlayerInput,
  Processing,
  GameOver,
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  image?: string;
  isThinking?: boolean;
}

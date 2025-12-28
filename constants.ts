import { Pokemon, PokemonType, Move } from './types';

export const TYPE_COLORS: Record<PokemonType, string> = {
  [PokemonType.Normal]: 'bg-gray-400',
  [PokemonType.Fire]: 'bg-red-500',
  [PokemonType.Water]: 'bg-blue-500',
  [PokemonType.Grass]: 'bg-green-500',
  [PokemonType.Electric]: 'bg-yellow-400',
  [PokemonType.Ice]: 'bg-cyan-300',
  [PokemonType.Fighting]: 'bg-orange-700',
  [PokemonType.Poison]: 'bg-purple-500',
  [PokemonType.Ground]: 'bg-yellow-700',
  [PokemonType.Flying]: 'bg-indigo-300',
  [PokemonType.Psychic]: 'bg-pink-500',
  [PokemonType.Bug]: 'bg-lime-500',
  [PokemonType.Rock]: 'bg-yellow-800',
  [PokemonType.Ghost]: 'bg-purple-800',
  [PokemonType.Dragon]: 'bg-indigo-600',
  [PokemonType.Steel]: 'bg-gray-500',
  [PokemonType.Fairy]: 'bg-pink-300',
};

// Simplified type effectiveness chart (1: normal, 2: super effective, 0.5: not very effective, 0: immune)
// Only implementing a few for this demo
export const getTypeEffectiveness = (moveType: PokemonType, targetTypes: PokemonType[]): number => {
  let multiplier = 1;
  
  targetTypes.forEach(targetType => {
    if (moveType === PokemonType.Fire) {
      if (targetType === PokemonType.Grass) multiplier *= 2;
      if (targetType === PokemonType.Water) multiplier *= 0.5;
      if (targetType === PokemonType.Fire) multiplier *= 0.5;
    } else if (moveType === PokemonType.Water) {
      if (targetType === PokemonType.Fire) multiplier *= 2;
      if (targetType === PokemonType.Grass) multiplier *= 0.5;
      if (targetType === PokemonType.Water) multiplier *= 0.5;
    } else if (moveType === PokemonType.Grass) {
      if (targetType === PokemonType.Water) multiplier *= 2;
      if (targetType === PokemonType.Fire) multiplier *= 0.5;
      if (targetType === PokemonType.Grass) multiplier *= 0.5;
    } else if (moveType === PokemonType.Electric) {
      if (targetType === PokemonType.Water) multiplier *= 2;
      if (targetType === PokemonType.Grass) multiplier *= 0.5;
      if (targetType === PokemonType.Ground) multiplier *= 0;
    }
  });

  return multiplier;
};

const createMove = (name: string, type: PokemonType, power: number, accuracy: number): Move => ({
  name, type, power, accuracy, pp: 15, maxPp: 15
});

export const POKEMON_DATA: Pokemon[] = [
  {
    id: 6,
    name: '喷火龙',
    type: [PokemonType.Fire, PokemonType.Flying],
    maxHp: 180,
    currentHp: 180,
    attack: 84,
    defense: 78,
    speed: 100,
    moves: [
      createMove('喷射火焰', PokemonType.Fire, 90, 100),
      createMove('空气斩', PokemonType.Flying, 75, 95),
      createMove('龙爪', PokemonType.Dragon, 80, 100),
      createMove('劈开', PokemonType.Normal, 70, 100),
    ],
    spriteFront: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
    spriteBack: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/6.png',
  },
  {
    id: 9,
    name: '水箭龟',
    type: [PokemonType.Water],
    maxHp: 190,
    currentHp: 190,
    attack: 83,
    defense: 100,
    speed: 78,
    moves: [
      createMove('水炮', PokemonType.Water, 110, 80),
      createMove('咬碎', PokemonType.Ghost, 80, 100), // Typo fix: Bite is Dark, simplified to Ghost for demo or just generic
      createMove('冰冻光束', PokemonType.Ice, 90, 100),
      createMove('高速旋转', PokemonType.Normal, 50, 100),
    ],
    spriteFront: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png',
    spriteBack: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/9.png',
  },
  {
    id: 3,
    name: '妙蛙花',
    type: [PokemonType.Grass, PokemonType.Poison],
    maxHp: 200,
    currentHp: 200,
    attack: 82,
    defense: 83,
    speed: 80,
    moves: [
      createMove('能量球', PokemonType.Grass, 90, 100),
      createMove('污泥炸弹', PokemonType.Poison, 90, 100),
      createMove('地震', PokemonType.Ground, 100, 100),
      createMove('猛撞', PokemonType.Normal, 90, 85),
    ],
    spriteFront: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png',
    spriteBack: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/3.png',
  },
  {
    id: 25,
    name: '皮卡丘',
    type: [PokemonType.Electric],
    maxHp: 150,
    currentHp: 150,
    attack: 90, // Buffed for gameplay
    defense: 50,
    speed: 120,
    moves: [
      createMove('十万伏特', PokemonType.Electric, 90, 100),
      createMove('电光一闪', PokemonType.Normal, 40, 100),
      createMove('打雷', PokemonType.Electric, 110, 70),
      createMove('铁尾', PokemonType.Steel, 100, 75),
    ],
    spriteFront: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    spriteBack: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png',
  }
];

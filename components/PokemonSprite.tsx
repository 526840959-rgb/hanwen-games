import React from 'react';

interface PokemonSpriteProps {
  src: string;
  isBack?: boolean;
  isAttacking?: boolean;
  isHit?: boolean;
}

const PokemonSprite: React.FC<PokemonSpriteProps> = ({ src, isBack, isAttacking, isHit }) => {
  return (
    <div className={`relative w-48 h-48 flex items-end justify-center transition-transform duration-300
      ${isAttacking ? (isBack ? 'translate-y-[-20px] translate-x-[20px]' : 'translate-y-[20px] translate-x-[-20px]') : ''}
    `}>
      <img 
        src={src} 
        alt="Pokemon" 
        className={`w-full h-full object-contain pixelated rendering-pixelated
          ${isHit ? 'animate-pulse opacity-50' : 'animate-bounce-slow'}
        `}
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="absolute bottom-2 w-32 h-8 bg-black/20 rounded-[100%] blur-md -z-10" />
    </div>
  );
};

export default PokemonSprite;
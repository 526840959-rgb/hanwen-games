import React from 'react';
import { Pokemon } from '../types';

interface HealthBarProps {
  pokemon: Pokemon;
}

const HealthBar: React.FC<HealthBarProps> = ({ pokemon }) => {
  const percentage = Math.max(0, Math.min(100, (pokemon.currentHp / pokemon.maxHp) * 100));
  
  let colorClass = 'bg-green-500';
  if (percentage < 50) colorClass = 'bg-yellow-400';
  if (percentage < 20) colorClass = 'bg-red-500';

  return (
    <div className="bg-slate-800/80 p-3 rounded-lg border-2 border-slate-600 shadow-lg w-64">
      <div className="flex justify-between items-baseline mb-1">
        <span className="font-gaming font-bold text-lg tracking-wider">{pokemon.name}</span>
        <span className="text-xs text-gray-300">Lv. 50</span>
      </div>
      <div className="w-full h-4 bg-slate-700 rounded-full overflow-hidden border border-slate-600 relative">
         <div 
          className={`h-full ${colorClass} transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-right text-xs mt-1 text-gray-300 font-mono">
        {Math.ceil(pokemon.currentHp)} / {pokemon.maxHp}
      </div>
    </div>
  );
};

export default HealthBar;
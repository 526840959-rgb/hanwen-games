import React, { useState, useEffect, useCallback } from 'react';
import { Pokemon, Move, TurnPhase, BattleLog, PokemonType } from './types';
import { POKEMON_DATA, getTypeEffectiveness, TYPE_COLORS } from './constants';
import PokemonSprite from './components/PokemonSprite';
import HealthBar from './components/HealthBar';
import ChatWidget from './components/ChatWidget';

// Helper to deep clone pokemon for reset
const clonePokemon = (p: Pokemon): Pokemon => JSON.parse(JSON.stringify(p));

const App: React.FC = () => {
  // Game State
  const [playerPokemon, setPlayerPokemon] = useState<Pokemon>(clonePokemon(POKEMON_DATA[0])); // Charizard
  const [enemyPokemon, setEnemyPokemon] = useState<Pokemon>(clonePokemon(POKEMON_DATA[1])); // Blastoise
  
  const [logs, setLogs] = useState<BattleLog[]>([]);
  const [turn, setTurn] = useState(1);
  const [phase, setPhase] = useState<TurnPhase>(TurnPhase.PlayerInput);
  
  // Animation States
  const [playerAttacking, setPlayerAttacking] = useState(false);
  const [enemyAttacking, setEnemyAttacking] = useState(false);
  const [playerHit, setPlayerHit] = useState(false);
  const [enemyHit, setEnemyHit] = useState(false);

  // Initial setup
  useEffect(() => {
    addLog(`战斗开始！${playerPokemon.name} 对战 ${enemyPokemon.name}！`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, { message, turn }]);
  };

  const handleAttack = async (attacker: Pokemon, defender: Pokemon, move: Move, isPlayer: boolean) => {
    addLog(`${attacker.name} 使用了 ${move.name}！`);

    // Animation trigger
    if (isPlayer) {
      setPlayerAttacking(true);
      setTimeout(() => setPlayerAttacking(false), 500);
    } else {
      setEnemyAttacking(true);
      setTimeout(() => setEnemyAttacking(false), 500);
    }

    // Delay for hit calculation/animation
    await new Promise(r => setTimeout(r, 600));

    // Accuracy check
    const hitChance = Math.random() * 100;
    if (hitChance > move.accuracy) {
      addLog(`但是 ${move.name} 没有命中！`);
      return defender;
    }

    // Damage Calculation (Simplified Gen 1 style formula)
    const level = 50;
    const effectiveness = getTypeEffectiveness(move.type, defender.type);
    
    // STAB (Same Type Attack Bonus)
    const stab = attacker.type.includes(move.type) ? 1.5 : 1;
    
    const random = (Math.floor(Math.random() * 16) + 85) / 100;
    
    // Basic damage formula
    let damage = (((2 * level / 5 + 2) * move.power * attacker.attack / defender.defense) / 50 + 2) * stab * effectiveness * random;
    
    damage = Math.floor(damage);

    // Hit animation
    if (isPlayer) {
      setEnemyHit(true);
      setTimeout(() => setEnemyHit(false), 500);
    } else {
      setPlayerHit(true);
      setTimeout(() => setPlayerHit(false), 500);
    }

    if (effectiveness > 1) addLog("效果绝佳！");
    if (effectiveness < 1 && effectiveness > 0) addLog("效果不理想...");
    if (effectiveness === 0) addLog("似乎没有效果...");
    if (random > 0.98) addLog("击中了要害！");

    const newHp = Math.max(0, defender.currentHp - damage);
    
    const newDefender = { ...defender, currentHp: newHp };
    addLog(`${defender.name} 受到了 ${damage} 点伤害！`);

    return newDefender;
  };

  const executeTurn = async (playerMove: Move) => {
    setPhase(TurnPhase.Processing);
    
    // Determine order based on speed
    const playerFirst = playerPokemon.speed >= enemyPokemon.speed;
    
    let currentP = { ...playerPokemon };
    let currentE = { ...enemyPokemon };
    let gameOver = false;

    // --- Turn Part 1 ---
    if (playerFirst) {
      currentE = await handleAttack(currentP, currentE, playerMove, true) as Pokemon;
      setEnemyPokemon(currentE);
      if (currentE.currentHp <= 0) gameOver = true;
    } else {
      // Enemy logic (Simple Random)
      const enemyMove = currentE.moves[Math.floor(Math.random() * currentE.moves.length)];
      currentP = await handleAttack(currentE, currentP, enemyMove, false) as Pokemon;
      setPlayerPokemon(currentP);
      if (currentP.currentHp <= 0) gameOver = true;
    }

    if (gameOver) {
      endGame(currentP, currentE);
      return;
    }

    await new Promise(r => setTimeout(r, 1000));

    // --- Turn Part 2 ---
    if (playerFirst) {
       // Enemy logic
       const enemyMove = currentE.moves[Math.floor(Math.random() * currentE.moves.length)];
       currentP = await handleAttack(currentE, currentP, enemyMove, false) as Pokemon;
       setPlayerPokemon(currentP);
       if (currentP.currentHp <= 0) gameOver = true;
    } else {
      // Player logic
      currentE = await handleAttack(currentP, currentE, playerMove, true) as Pokemon;
      setEnemyPokemon(currentE);
      if (currentE.currentHp <= 0) gameOver = true;
    }

    if (gameOver) {
      endGame(currentP, currentE);
      return;
    }

    setTurn(t => t + 1);
    setPhase(TurnPhase.PlayerInput);
  };

  const endGame = (p: Pokemon, e: Pokemon) => {
    setPhase(TurnPhase.GameOver);
    if (p.currentHp <= 0) {
      addLog(`${p.name} 倒下了！你输了！`);
    } else {
      addLog(`${e.name} 倒下了！你赢了！`);
    }
  };

  const restartGame = () => {
    const p1 = POKEMON_DATA[Math.floor(Math.random() * POKEMON_DATA.length)];
    let p2 = POKEMON_DATA[Math.floor(Math.random() * POKEMON_DATA.length)];
    while(p2.id === p1.id && POKEMON_DATA.length > 1) {
        p2 = POKEMON_DATA[Math.floor(Math.random() * POKEMON_DATA.length)];
    }

    setPlayerPokemon(clonePokemon(p1));
    setEnemyPokemon(clonePokemon(p2));
    setLogs([]);
    setTurn(1);
    setPhase(TurnPhase.PlayerInput);
    addLog(`新的对战开始！${p1.name} 对战 ${p2.name}！`);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-[100px] transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600 rounded-full blur-[100px] transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-4xl w-full bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 shadow-2xl overflow-hidden relative z-10">
        
        {/* Battle Arena */}
        <div className="h-[400px] md:h-[500px] bg-gradient-to-b from-blue-200/20 to-green-100/10 relative p-6 flex flex-col justify-between"
             style={{
               backgroundImage: 'url("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg")', // Fallback or transparent
               backgroundSize: 'cover',
               backgroundBlendMode: 'overlay'
             }}>
           
           {/* Enemy Area */}
           <div className="flex justify-between items-start">
             <div className="order-2 md:order-1 relative top-8 md:top-12">
               <PokemonSprite 
                  src={enemyPokemon.spriteFront} 
                  isAttacking={enemyAttacking}
                  isHit={enemyHit}
                />
             </div>
             <div className="order-1 md:order-2">
               <HealthBar pokemon={enemyPokemon} />
             </div>
           </div>

           {/* Player Area */}
           <div className="flex justify-between items-end mt-auto">
             <div>
               <HealthBar pokemon={playerPokemon} />
             </div>
             <div className="relative bottom-4 md:bottom-8">
               <PokemonSprite 
                  src={playerPokemon.spriteBack} 
                  isBack={true} 
                  isAttacking={playerAttacking}
                  isHit={playerHit}
               />
             </div>
           </div>
        </div>

        {/* UI Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t-4 border-slate-900">
          
          {/* Logs */}
          <div className="bg-slate-900 p-4 h-48 overflow-y-auto font-mono text-sm space-y-2 border-b md:border-b-0 md:border-r border-slate-700 scrollbar-hide">
            {logs.length === 0 && <div className="text-gray-500">等待战斗指令...</div>}
            {logs.slice().reverse().map((log, i) => (
              <div key={i} className="animate-fade-in-down border-l-2 border-slate-600 pl-2">
                <span className="text-gray-500 mr-2">[Turn {log.turn}]</span>
                <span>{log.message}</span>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="bg-slate-800 p-4 h-48 flex flex-col justify-center">
            {phase === TurnPhase.GameOver ? (
              <div className="text-center">
                 <h2 className="text-2xl font-bold mb-4 font-gaming text-yellow-400">战斗结束</h2>
                 <button 
                  onClick={restartGame}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  再来一局
                 </button>
              </div>
            ) : (
              <div>
                 {phase === TurnPhase.Processing ? (
                   <div className="h-full flex items-center justify-center text-gray-400 text-lg animate-pulse">
                     回合进行中...
                   </div>
                 ) : (
                   <div className="grid grid-cols-2 gap-3 h-full">
                      {playerPokemon.moves.map((move, i) => (
                        <button
                          key={i}
                          onClick={() => executeTurn(move)}
                          className={`${TYPE_COLORS[move.type]} hover:brightness-110 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform active:scale-95 flex flex-col items-center justify-center relative overflow-hidden group`}
                        >
                          <span className="relative z-10 text-lg tracking-wide">{move.name}</span>
                          <span className="relative z-10 text-xs opacity-90">{move.type} | PWR {move.power}</span>
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                        </button>
                      ))}
                   </div>
                 )}
              </div>
            )}
          </div>
        </div>
      </div>

      <ChatWidget />
    </div>
  );
};

export default App;
import React from 'react';
import RetroButton from './RetroButton';
import { GameState, InteractionMode } from '../types';

interface DashboardProps {
  gameState: GameState;
  interactionMode: InteractionMode;
  onAction: (action: string) => void;
  logs: string[];
}

const Dashboard: React.FC<DashboardProps> = ({ gameState, interactionMode, onAction, logs }) => {
  return (
    <div className="w-full bg-[#111] border-t-4 border-[#333] flex flex-col md:flex-row items-center justify-between p-2 md:p-4 z-20 gap-2 md:gap-4 md:h-48 h-auto">
      
      {/* Group 1: Watch & Stats (Top Row on Mobile) */}
      <div className="flex items-center justify-between w-full md:w-auto md:justify-start gap-4 md:gap-6 px-2 md:px-0">
        {/* Watch */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 bg-[#222] rounded-xl border-4 border-[#444] shadow-lg flex items-center justify-center shrink-0">
          <div className="absolute top-1 text-[#666] text-[10px] md:text-xs">CASIO</div>
          <div className="bg-[#9ea792] p-1 md:p-2 rounded w-20 md:w-24 text-center font-mono text-xl md:text-3xl text-black tracking-widest border-inset border-2 border-[#777]">
            {gameState.shiftTime}
          </div>
        </div>

        {/* Stats Notebook */}
        <div className="w-32 h-24 md:w-40 md:h-36 bg-[#f0e6d2] border-l-4 md:border-l-8 border-[#333] relative p-2 text-[#333] shadow-md transform -rotate-1 shrink-0 flex flex-col justify-center">
          <div className="absolute -top-3 left-4 w-4 h-8 bg-[#888] rounded-full hidden md:block"></div>
          <h3 className="uppercase border-b-2 border-[#333] mb-1 font-bold text-sm md:text-base">Relatório</h3>
          <p className="text-sm md:text-xl leading-tight">Meta: {gameState.ticketsIssued}/{gameState.quota}</p>
          <p className="text-sm md:text-xl leading-tight">Pontos: {gameState.score}</p>
        </div>
      </div>

      {/* Group 2: Action Grid (Middle/Bottom on Mobile) */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl px-1 md:px-8 order-3 md:order-2">
        {interactionMode === InteractionMode.IDLE && (
          <div className="bg-[#222] text-green-500 p-3 md:p-4 border-2 border-green-800 rounded animate-pulse text-center w-full text-sm md:text-base">
            AGUARDANDO TRÁFEGO... CLIQUE EM UM CARRO
          </div>
        )}

        {interactionMode !== InteractionMode.IDLE && interactionMode !== InteractionMode.TICKET_WRITING && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 w-full">
            <RetroButton label="Ver Placa" onClick={() => onAction('CHECK_PLATES')} />
            <RetroButton label="Ver Luzes" onClick={() => onAction('CHECK_LIGHTS')} />
            <RetroButton label="Ver Pneus" onClick={() => onAction('CHECK_TIRES')} />
            <RetroButton label="Revistar" onClick={() => onAction('SEARCH_CAR')} />
            <RetroButton label="Conversar" onClick={() => onAction('TALK')} color="blue" />
            <RetroButton label="Multar" onClick={() => onAction('OPEN_TICKET')} color="red" />
             <RetroButton label="Liberar" onClick={() => onAction('LET_GO')} color="green" className="col-span-2 md:col-span-1" />
          </div>
        )}
      </div>

      {/* Group 3: Radio/Log Output (Bottom Row on Mobile) */}
      <div className="w-full md:w-64 h-24 md:h-40 bg-[#1a1a1a] border-4 border-[#333] rounded p-2 flex flex-col relative overflow-hidden shrink-0 order-2 md:order-3">
        <div className="absolute top-0 left-0 w-full h-1 bg-green-500 animate-pulse opacity-50"></div>
        <div className="flex-1 overflow-y-auto font-mono text-xs space-y-1 p-1">
           {logs.map((log, i) => (
             <p key={i} className="text-green-400 break-words leading-tight">> {log}</p>
           ))}
           <div id="log-end"></div>
        </div>
        <div className="h-6 md:h-8 border-t border-[#333] flex items-center justify-between px-2 pt-1">
            <span className="text-green-700 text-[10px] md:text-xs">MOTOROLA</span>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
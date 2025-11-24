import React, { useState, useEffect, useCallback } from 'react';
import StreetScene from './components/StreetScene';
import Dashboard from './components/Dashboard';
import TicketBook from './components/TicketBook';
import { GameState, InteractionMode, GeneratedScenario, ViolationType } from './types';
import { generateTrafficStop } from './services/geminiService';

// Extend Window interface for AI Studio helpers
declare global {
  // We augment the existing AIStudio interface to avoid conflicts with the global declaration
  interface AIStudio {
    hasSelectedApiKey(): Promise<boolean>;
    openSelectKey(): Promise<void>;
  }
}

const App: React.FC = () => {
  // --- API Key / Start Screen State ---
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isCheckingKey, setIsCheckingKey] = useState(true);

  useEffect(() => {
    const checkKey = async () => {
      try {
        if (window.aistudio) {
          const has = await window.aistudio.hasSelectedApiKey();
          setHasApiKey(has);
        } else {
          // If not in AI Studio environment, assume true (or dev mode)
          setHasApiKey(true);
        }
      } catch (e) {
        console.error("Error checking API key:", e);
      } finally {
        setIsCheckingKey(false);
      }
    };
    checkKey();
  }, []);

  const handleStartGame = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume success after closing dialog to handle race condition
      setHasApiKey(true);
    }
  };

  // --- Game State ---
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    quota: 5,
    ticketsIssued: 0,
    shiftTime: "08:00 AM",
    gameOver: false,
  });

  const [interactionMode, setInteractionMode] = useState<InteractionMode>(InteractionMode.IDLE);
  const [logs, setLogs] = useState<string[]>(["SISTEMA INICIANDO...", "CENTRAL ONLINE."]);
  const [currentScenario, setCurrentScenario] = useState<GeneratedScenario | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [showTicketBook, setShowTicketBook] = useState(false);

  // Helper to add logs
  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-4), msg]); // Keep last 5 logs
  };

  // Car clicked handler
  const handleCarClick = async () => {
    if (interactionMode !== InteractionMode.IDLE) return;
    
    setInteractionMode(InteractionMode.STOPPED);
    addLog("VEÍCULO PARADO. AGUARDANDO DADOS...");
    setIsFetching(true);

    try {
      const scenario = await generateTrafficStop();
      setCurrentScenario(scenario);
      setIsFetching(false);
      addLog("DADOS RECEBIDOS. PROSSEGUIR.");
    } catch (e) {
      addLog("ERRO: CENTRAL FORA DO AR.");
      setIsFetching(false);
      setInteractionMode(InteractionMode.IDLE);
    }
  };

  // Dashboard Action Handler
  const handleAction = (action: string) => {
    if (isFetching || !currentScenario) return;

    switch (action) {
      case 'CHECK_PLATES':
        addLog(`PLACA: ${currentScenario.plateNumber}`);
        addLog(`VALIDADE: ${currentScenario.licenseExpiry}`);
        addLog(`STATUS: ${currentScenario.isStolen ? "REGISTRO DE ROUBO" : "LIMPO"}`);
        break;
      case 'CHECK_LIGHTS':
        addLog(currentScenario.brokenLight ? "OBSERVAÇÃO: FAROL TRASEIRO QUEBRADO" : "OBSERVAÇÃO: LUZES FUNCIONAIS");
        break;
      case 'CHECK_TIRES':
        addLog(currentScenario.wornTires ? "OBSERVAÇÃO: PNEUS CARECAS" : "OBSERVAÇÃO: PNEUS EM BOM ESTADO");
        break;
      case 'SEARCH_CAR':
        addLog("REVISTANDO VEÍCULO...");
        setTimeout(() => {
          if (Math.random() > 0.8) addLog("ENCONTRADO: BEBIDA ABERTA");
          else addLog("RESULTADO: NADA ILEGAL ENCONTRADO");
        }, 1000);
        break;
      case 'TALK':
        setInteractionMode(InteractionMode.DIALOGUE);
        break;
      case 'OPEN_TICKET':
        setShowTicketBook(true);
        break;
      case 'LET_GO':
        completeInteraction(ViolationType.NONE);
        break;
    }
  };

  // Issue Ticket Logic
  const handleIssueTicket = (selectedViolation: ViolationType) => {
    if (!currentScenario) return;
    completeInteraction(selectedViolation);
    setShowTicketBook(false);
  };

  const completeInteraction = (userVerdict: ViolationType) => {
    if (!currentScenario) return;

    let points = 0;
    let feedback = "";

    const actual = currentScenario.actualViolation;

    if (userVerdict === actual) {
      if (actual === ViolationType.NONE) {
        points = 5; // Good job letting a clean driver go
        feedback = "BOM TRABALHO. MOTORISTA ESTAVA LIMPO.";
      } else {
        points = 20; // Correct ticket
        feedback = "MULTA APLICADA CORRETAMENTE.";
        setGameState(prev => ({ ...prev, ticketsIssued: prev.ticketsIssued + 1 }));
      }
    } else {
      // Wrong verdict
      if (userVerdict === ViolationType.NONE && actual !== ViolationType.NONE) {
        points = -10;
        feedback = `ERRO: DEIXOU PASSAR: ${getViolationName(actual)}`;
      } else if (userVerdict !== ViolationType.NONE && actual === ViolationType.NONE) {
        points = -20;
        feedback = "ERRO: MOTORISTA ERA INOCENTE.";
      } else {
        points = -5;
        feedback = `MULTA ERRADA. ERA: ${getViolationName(actual)}`;
      }
    }

    setGameState(prev => ({ ...prev, score: prev.score + points }));
    addLog(feedback);
    
    // Reset after delay
    setTimeout(() => {
        setInteractionMode(InteractionMode.IDLE);
        setCurrentScenario(null);
        addLog("PATRULHA RETOMADA...");
        
        // Advance time
        setGameState(prev => {
            const [time, period] = prev.shiftTime.split(' ');
            let [hours, mins] = time.split(':').map(Number);
            mins += 15;
            if (mins >= 60) {
                mins = 0;
                hours += 1;
            }
            return { ...prev, shiftTime: `${hours}:${mins.toString().padStart(2, '0')} ${period}` };
        });

    }, 2000);
  };
  
  const getViolationName = (v: ViolationType) => {
      // Simple helper for logs
       switch (v) {
        case ViolationType.EXPIRED_PLATES: return "PLACA VENCIDA";
        case ViolationType.BROKEN_LIGHT: return "FAROL QUEBRADO";
        case ViolationType.STOLEN_VEHICLE: return "ROUBADO";
        case ViolationType.WORN_TIRES: return "PNEUS RUINS";
        case ViolationType.NO_INSURANCE: return "SEM SEGURO";
        default: return v;
      }
  }

  // --- RENDER ---

  if (isCheckingKey) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center font-mono text-green-500">
        CARREGANDO SISTEMA...
      </div>
    );
  }

  if (!hasApiKey) {
    return (
      <div className="w-full h-[100dvh] bg-black flex flex-col items-center justify-center font-mono p-4 text-center select-none">
        <h1 className="text-4xl md:text-6xl text-white mb-4 animate-pulse" style={{ fontFamily: '"VT323", monospace' }}>
          PATRULHA PIXEL
        </h1>
        <div className="border-4 border-green-700 p-8 bg-[#111] shadow-lg max-w-md w-full">
          <p className="text-green-500 text-lg mb-6 leading-relaxed">
            ACESSO RESTRITO.<br/>
            IDENTIFICAÇÃO NECESSÁRIA PARA INICIAR TURNO.
          </p>
          <button 
            onClick={handleStartGame}
            className="w-full bg-green-700 text-black font-bold text-xl py-4 border-2 border-green-500 hover:bg-green-500 hover:border-white transition-all shadow-[0_0_15px_rgba(0,255,0,0.4)] uppercase"
          >
            INSERIR CREDENCIAIS
          </button>
        </div>
        <p className="text-gray-600 mt-8 text-xs">V 1.0.3 - SISTEMA BETA</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[100dvh] flex flex-col bg-black select-none overflow-hidden">
      
      {/* Street Layer - Takes remaining height */}
      <div className="flex-1 relative w-full min-h-0">
        <StreetScene 
          interactionMode={interactionMode} 
          onCarClick={handleCarClick} 
          carColor={currentScenario?.vehicleColor}
        />

        {/* Speech Bubble Overlay - Positioned relative to street */}
        {interactionMode === InteractionMode.DIALOGUE && currentScenario && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-32 z-40 w-[90%] max-w-md px-4">
               <div className="bg-white border-4 border-black p-4 relative shadow-lg">
                  <p className="font-bold text-lg md:text-xl mb-2 text-black">"{currentScenario.driverDialogue}"</p>
                  <div className="text-right text-xs text-gray-500">- {currentScenario.driverName}</div>
                  {/* Arrow */}
                  <div className="absolute -bottom-4 left-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-t-[15px] border-t-black border-r-[10px] border-r-transparent"></div>
               </div>
               <div className="mt-4 text-center">
                   <button 
                      onClick={() => setInteractionMode(InteractionMode.STOPPED)}
                      className="bg-black text-white px-6 py-3 font-bold hover:bg-gray-800 border-2 border-white shadow-lg active:scale-95 transition-transform"
                   >
                      DISPENSAR
                   </button>
               </div>
          </div>
        )}
      </div>

      {/* Ticket Book Modal */}
      {showTicketBook && (
        <TicketBook onSubmit={handleIssueTicket} onCancel={() => setShowTicketBook(false)} />
      )}

      {/* HUD Layer - Fixed height/auto based on content */}
      <div className="flex-none z-30 w-full">
        <Dashboard 
          gameState={gameState} 
          interactionMode={interactionMode} 
          onAction={handleAction}
          logs={logs}
        />
      </div>
      
      {/* Scanlines Effect */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
    </div>
  );
};

export default App;
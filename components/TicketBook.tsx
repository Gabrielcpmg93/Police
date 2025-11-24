import React from 'react';
import { ViolationType } from '../types';
import RetroButton from './RetroButton';

interface TicketBookProps {
  onSubmit: (violation: ViolationType) => void;
  onCancel: () => void;
}

const getViolationLabel = (violation: ViolationType): string => {
  switch (violation) {
    case ViolationType.EXPIRED_PLATES: return "PLACA VENCIDA";
    case ViolationType.BROKEN_LIGHT: return "FAROL QUEBRADO";
    case ViolationType.STOLEN_VEHICLE: return "VEÍCULO ROUBADO";
    case ViolationType.WORN_TIRES: return "PNEUS CARECAS";
    case ViolationType.NO_INSURANCE: return "SEM SEGURO";
    default: return violation;
  }
};

const TicketBook: React.FC<TicketBookProps> = ({ onSubmit, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#f2f0e4] w-[95%] max-w-sm md:w-96 h-[500px] border-8 border-[#333] rounded shadow-2xl relative p-4 md:p-6 flex flex-col font-mono text-[#333] transform rotate-1">
        
        {/* Header */}
        <div className="border-b-4 border-[#333] pb-2 mb-4 text-center">
          <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest">AUTUAÇÃO</h2>
          <p className="text-xs font-bold">DEPARTAMENTO DE POLÍCIA</p>
        </div>

        {/* Violations List */}
        <div className="flex-1 space-y-2 overflow-y-auto pr-2">
          <p className="text-sm font-bold mb-2 underline">SELECIONE A INFRAÇÃO:</p>
          
          {Object.values(ViolationType).filter(v => v !== ViolationType.NONE).map((v) => (
             <button
               key={v}
               onClick={() => onSubmit(v)}
               className="w-full text-left p-2 border-2 border-transparent hover:border-[#333] hover:bg-[#e0ded0] focus:bg-[#333] focus:text-white transition-colors uppercase text-xs md:text-sm font-bold"
             >
               [ ] {getViolationLabel(v)}
             </button>
          ))}
          
           <button
               onClick={() => onSubmit(ViolationType.NONE)}
               className="w-full text-left p-2 border-2 border-transparent hover:border-[#333] hover:bg-[#e0ded0] focus:bg-[#333] focus:text-white transition-colors uppercase text-xs md:text-sm font-bold text-green-700"
             >
               [ ] TUDO LIMPO (LIBERAR)
             </button>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-4 border-t-4 border-[#333] flex justify-between">
           <RetroButton label="CANCELAR" onClick={onCancel} color="gray" />
        </div>
      </div>
    </div>
  );
};

export default TicketBook;
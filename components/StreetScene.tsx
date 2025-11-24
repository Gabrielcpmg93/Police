import React, { useEffect, useState } from 'react';
import { InteractionMode } from '../types';

interface StreetSceneProps {
  interactionMode: InteractionMode;
  onCarClick: () => void;
  carColor?: string;
}

const StreetScene: React.FC<StreetSceneProps> = ({ interactionMode, onCarClick, carColor = 'red' }) => {
  // Simple parallax/movement simulation
  const [carPosition, setCarPosition] = useState(-200);

  useEffect(() => {
    let animationFrame: number;

    const moveCar = () => {
      if (interactionMode === InteractionMode.IDLE) {
        setCarPosition((prev) => {
          if (prev > window.innerWidth) return -300; // Reset
          return prev + 3; // Speed
        });
      }
      animationFrame = requestAnimationFrame(moveCar);
    };

    animationFrame = requestAnimationFrame(moveCar);
    return () => cancelAnimationFrame(animationFrame);
  }, [interactionMode]);

  const carStyle = interactionMode === InteractionMode.IDLE 
    ? { transform: `translateX(${carPosition}px)` }
    : { transform: `translateX(50vw) translateX(-50%)` }; // Center screen when stopped

  return (
    <div className="relative w-full h-full bg-sky-300 overflow-hidden flex flex-col justify-end">
      
      {/* Background Buildings (Pixel Art Simulation with CSS) */}
      <div className="absolute top-10 left-0 w-full h-full flex items-end opacity-90 pointer-events-none pb-24 md:pb-32">
        {/* Building 1 */}
        <div className="w-32 md:w-48 h-[80%] bg-[#765c48] border-r-4 border-[#553e2e] relative mx-1 md:mx-2 hidden sm:block">
           <div className="w-full h-8 bg-[#3e2b1f] absolute top-0"></div> {/* Roof */}
           <div className="grid grid-cols-2 gap-2 md:gap-4 p-2 md:p-4 mt-8">
              {[...Array(6)].map((_, i) => <div key={i} className="bg-[#2a1d15] w-8 md:w-12 h-12 md:h-16 border-b-4 border-white/20"></div>)}
           </div>
           <div className="absolute bottom-20 left-4 bg-yellow-200 text-black px-2 text-xs font-bold border-2 border-black -rotate-2">
             PIZZARIA
           </div>
        </div>
        {/* Building 2 (Brick) */}
        <div className="flex-1 md:w-64 h-[90%] bg-[#8b4b3d] border-r-4 border-[#5a2e24] relative mx-1 md:mx-2">
          <div className="w-full h-8 md:h-12 bg-[#333] absolute top-0"></div>
          <div className="grid grid-cols-3 gap-2 md:gap-3 p-2 md:p-4 mt-8 md:mt-12">
             {[...Array(9)].map((_, i) => <div key={i} className="bg-[#1a1a1a] w-8 md:w-12 h-8 md:h-12"></div>)}
          </div>
          <div className="absolute bottom-0 w-full h-24 md:h-32 bg-[#2d3436] flex items-center justify-center">
             <div className="w-24 md:w-40 h-16 md:h-20 bg-blue-900 border-4 border-blue-400 opacity-50"></div>
          </div>
          <div className="absolute top-16 -right-2 md:-right-8 bg-black text-red-500 border-4 border-red-500 p-1 md:p-2 text-xs md:text-base font-bold animate-pulse transform rotate-12 z-10">
             QUENTE
          </div>
        </div>
        {/* Building 3 (Gray) */}
        <div className="w-40 md:w-56 h-[70%] bg-[#555] border-r-4 border-[#333] relative mx-1 md:mx-2">
            <div className="grid grid-cols-2 gap-4 md:gap-6 p-4 md:p-6">
                {[...Array(4)].map((_, i) => <div key={i} className="bg-[#222] w-12 md:w-16 h-12 md:h-16 rounded-t-full"></div>)}
            </div>
            <div className="absolute bottom-10 w-full text-center text-2xl md:text-4xl text-pink-500 font-bold tracking-widest" style={{ textShadow: '2px 2px 0px #000' }}>
               MOTEL
            </div>
        </div>
         {/* Filler Buildings */}
         <div className="w-20 md:flex-1 h-[60%] bg-[#4a4a4a] border-t-4 border-black"></div>
      </div>

      {/* Sidewalk */}
      <div className="absolute bottom-24 md:bottom-32 w-full h-12 md:h-16 bg-[#a8a29e] border-t-4 border-[#d6d3d1] z-0">
          {/* Sidewalk lines */}
          <div className="w-full h-full flex justify-around">
              {[...Array(20)].map((_, i) => <div key={i} className="w-1 h-full bg-[#999]"></div>)}
          </div>
      </div>

      {/* Street */}
      <div className="absolute bottom-0 w-full h-24 md:h-32 bg-[#334155] border-t-8 border-[#1e293b] z-10">
        {/* Road Markings */}
        <div className="absolute top-1/2 w-full h-2 flex justify-between px-4">
             {[...Array(10)].map((_, i) => <div key={i} className="w-8 md:w-16 h-full bg-yellow-500"></div>)}
        </div>
      </div>

      {/* The Car */}
      <div 
        className="absolute bottom-4 md:bottom-8 z-20 cursor-pointer transition-transform duration-100 ease-linear"
        style={carStyle}
        onClick={interactionMode === InteractionMode.IDLE ? onCarClick : undefined}
      >
        <div className="relative group scale-75 md:scale-100 origin-bottom">
           {interactionMode === InteractionMode.IDLE && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-1 text-sm border-2 border-black whitespace-nowrap opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-50 shadow-md animate-bounce">
                 TOQUE P/ PARAR
              </div>
           )}
           
           {/* Car Body */}
           <div className={`w-64 h-24 ${getColorClass(carColor)} rounded-t-lg relative shadow-xl`}>
              {/* Roof */}
              <div className={`absolute -top-12 left-8 w-48 h-12 ${getColorClass(carColor)} rounded-t-xl border-t-4 border-l-4 border-r-4 border-white/20`}></div>
              {/* Windows */}
              <div className="absolute -top-10 left-10 w-44 h-10 flex">
                 <div className="w-1/2 h-full bg-[#88ccff] border-r-4 border-black/20"></div>
                 <div className="w-1/2 h-full bg-[#88ccff]"></div>
              </div>
              {/* Stripe */}
              <div className="absolute top-8 w-full h-2 bg-black/10"></div>
              {/* Lights */}
              <div className="absolute top-6 left-0 w-4 h-8 bg-orange-400 border-2 border-orange-600 rounded-r"></div>
              <div className="absolute top-6 right-0 w-4 h-8 bg-red-600 border-2 border-red-800 rounded-l"></div>
              {/* Wheels */}
              <div className="absolute -bottom-4 left-8 w-12 h-12 bg-[#222] rounded-full border-4 border-[#555] flex items-center justify-center animate-spin-slow">
                 <div className="w-4 h-4 bg-[#888] rounded-full"></div>
              </div>
              <div className="absolute -bottom-4 right-8 w-12 h-12 bg-[#222] rounded-full border-4 border-[#555] flex items-center justify-center animate-spin-slow">
                 <div className="w-4 h-4 bg-[#888] rounded-full"></div>
              </div>
           </div>
        </div>
      </div>

      {/* Police Officer (Static for now) */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 z-30 transform -translate-x-[160px] md:-translate-x-[200px] scale-75 md:scale-100 origin-bottom">
          <div className="w-16 h-32 relative">
             {/* Hat */}
             <div className="absolute top-0 w-16 h-6 bg-blue-900 z-10 rounded-t-sm">
                 <div className="absolute bottom-0 w-full h-1 bg-yellow-400"></div>
                 <div className="absolute bottom-0 -left-2 w-20 h-2 bg-black"></div> {/* Visor */}
             </div>
             {/* Head */}
             <div className="absolute top-5 left-3 w-10 h-10 bg-[#eebb99] rounded-sm"></div>
             {/* Body */}
             <div className="absolute top-14 left-1 w-14 h-16 bg-blue-800 rounded-t-lg">
                <div className="w-full h-full flex justify-center pt-2">
                    <div className="w-1 h-12 bg-blue-900"></div> {/* Tie */}
                </div>
                {/* Badge */}
                <div className="absolute top-4 left-2 w-3 h-4 bg-yellow-400 rounded-full border border-yellow-600"></div>
             </div>
             {/* Legs */}
             <div className="absolute bottom-0 left-2 w-4 h-12 bg-blue-900"></div>
             <div className="absolute bottom-0 right-2 w-4 h-12 bg-blue-900"></div>
          </div>
      </div>

    </div>
  );
};

const getColorClass = (color: string) => {
    const map: Record<string, string> = {
        'Red': 'bg-red-600',
        'Blue': 'bg-blue-600',
        'Green': 'bg-green-600',
        'White': 'bg-gray-200',
        'Black': 'bg-gray-800',
        'Yellow': 'bg-yellow-500',
        'Brown': 'bg-amber-800'
    }
    return map[color] || 'bg-blue-500';
}

export default StreetScene;
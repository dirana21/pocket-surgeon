import React, { useState } from 'react';
import { AnesthesiaTechnique } from '../data/anesthesiaData';
import { CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

interface DentalNumbnessMapProps {
  technique: AnesthesiaTechnique;
}

export const DentalNumbnessMap: React.FC<DentalNumbnessMapProps> = ({ technique }) => {
  const [activeSide, setActiveSide] = useState<'right' | 'left'>('right');

  // FDI 2-digit tooth numbering:
  // Upper Right: 18..11, Upper Left: 21..28
  // Lower Right: 48..41, Lower Left: 31..38
  const upperRight = [18, 17, 16, 15, 14, 13, 12, 11];
  const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28];
  const lowerRight = [48, 47, 46, 45, 44, 43, 42, 41];
  const lowerLeft = [31, 32, 33, 34, 35, 36, 37, 38];

  // Map anesthetized teeth based on side
  const getAnesthetizedTeeth = (): number[] => {
    const ids = technique.numbnessZone.teethIds;
    if (activeSide === 'right') {
      return ids;
    }
    // Convert to left side equivalents (quadrant 4 -> 3, quadrant 1 -> 2)
    return ids.map((id) => {
      if (id >= 41 && id <= 48) return id - 10; // 48 -> 38
      if (id >= 11 && id <= 18) return id + 10; // 18 -> 28
      return id;
    });
  };

  const anesthetizedList = getAnesthetizedTeeth();

  const isToothNumb = (toothId: number) => anesthetizedList.includes(toothId);

  return (
    <div className="bg-[#0B1326] border border-slate-800 rounded-2xl p-4 space-y-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Зона сенсорної блокади (оніміння)
          </h3>
          <p className="text-xs text-slate-400">Анатомічна карта вимкненої чутливості</p>
        </div>

        {/* Side Selector (Right vs Left) */}
        <div className="flex bg-[#101B33] p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveSide('right')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeSide === 'right'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Справа (Q1/Q4)
          </button>
          <button
            onClick={() => setActiveSide('left')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeSide === 'left'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Зліва (Q2/Q3)
          </button>
        </div>
      </div>

      {/* Teeth summary alert */}
      <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-2.5">
        <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold text-cyan-300">Зуби: </span>
          <span className="text-slate-200">{technique.numbnessZone.teethSummary}</span>
        </div>
      </div>

      {/* Visual Interactive Odontogram FDI */}
      <div className="p-3 bg-[#070D1B] rounded-xl border border-slate-800/80 space-y-3">
        <div className="text-[11px] font-mono text-slate-400 flex justify-between px-1">
          <span>ВЕРХНЯ ЩЕЛЕПА (MAXILLA)</span>
          <span className="text-cyan-400 font-bold">FDI формула</span>
        </div>

        {/* Upper teeth row */}
        <div className="grid grid-cols-8 gap-1 text-center">
          {upperRight.map((tooth) => {
            const numb = isToothNumb(tooth);
            return (
              <div
                key={tooth}
                className={`py-2 rounded-lg border text-xs font-mono font-bold transition-all ${
                  numb
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm shadow-cyan-500/30 scale-105'
                    : 'bg-[#0E172E] text-slate-500 border-slate-800'
                }`}
              >
                {tooth}
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-8 gap-1 text-center">
          {upperLeft.map((tooth) => {
            const numb = isToothNumb(tooth);
            return (
              <div
                key={tooth}
                className={`py-2 rounded-lg border text-xs font-mono font-bold transition-all ${
                  numb
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm shadow-cyan-500/30 scale-105'
                    : 'bg-[#0E172E] text-slate-500 border-slate-800'
                }`}
              >
                {tooth}
              </div>
            );
          })}
        </div>

        <div className="border-t border-dashed border-slate-800 my-2"></div>

        <div className="text-[11px] font-mono text-slate-400 px-1">
          <span>НИЖНЯ ЩЕЛЕПА (MANDIBULA)</span>
        </div>

        {/* Lower teeth row */}
        <div className="grid grid-cols-8 gap-1 text-center">
          {lowerRight.map((tooth) => {
            const numb = isToothNumb(tooth);
            return (
              <div
                key={tooth}
                className={`py-2 rounded-lg border text-xs font-mono font-bold transition-all ${
                  numb
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm shadow-cyan-500/30 scale-105'
                    : 'bg-[#0E172E] text-slate-500 border-slate-800'
                }`}
              >
                {tooth}
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-8 gap-1 text-center">
          {lowerLeft.map((tooth) => {
            const numb = isToothNumb(tooth);
            return (
              <div
                key={tooth}
                className={`py-2 rounded-lg border text-xs font-mono font-bold transition-all ${
                  numb
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm shadow-cyan-500/30 scale-105'
                    : 'bg-[#0E172E] text-slate-500 border-slate-800'
                }`}
              >
                {tooth}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mucosa and soft tissues details */}
      <div className="grid grid-cols-1 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-[#101B33] border border-slate-800">
          <span className="text-slate-400 font-semibold block mb-0.5">Слизова оболонка та окістя:</span>
          <span className="text-slate-200">{technique.numbnessZone.mucosa}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#101B33] border border-slate-800">
          <span className="text-slate-400 font-semibold block mb-0.5">М’які тканини (язик, губи, підборіддя):</span>
          <span className="text-slate-200">{technique.numbnessZone.softTissues}</span>
        </div>
      </div>

      {/* Clinical nuances bullets */}
      <div className="space-y-1.5 pt-1">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Клінічні особливості зони:</h4>
        <ul className="space-y-1 text-xs text-slate-400">
          {technique.numbnessZone.features.map((feat, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <span className="text-teal-400 font-bold mt-0.5">✓</span>
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { AnesthesiaTechnique } from '../data/anesthesiaData';
import { CheckCircle, Sparkles, LayoutGrid, CircleDot, Info } from 'lucide-react';
import { RealisticToothCard, ToothOcclusal } from './AnatomicalTeeth';

interface DentalNumbnessMapProps {
  technique: AnesthesiaTechnique;
}

export const DentalNumbnessMap: React.FC<DentalNumbnessMapProps> = ({ technique }) => {
  const [activeSide, setActiveSide] = useState<'right' | 'left'>('right');
  const [viewMode, setViewMode] = useState<'cards' | 'arch'>('cards');
  const [selectedToothInfo, setSelectedToothInfo] = useState<number | null>(null);

  // FDI Tooth Numbers:
  // Upper Right (Q1): 18, 17, 16, 15, 14, 13, 12, 11
  // Upper Left  (Q2): 21, 22, 23, 24, 25, 26, 27, 28
  // Lower Right (Q4): 48, 47, 46, 45, 44, 43, 42, 41
  // Lower Left  (Q3): 31, 32, 33, 34, 35, 36, 37, 38

  const upperRight = [18, 17, 16, 15, 14, 13, 12, 11];
  const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28];
  const lowerRight = [48, 47, 46, 45, 44, 43, 42, 41];
  const lowerLeft = [31, 32, 33, 34, 35, 36, 37, 38];

  const getAnesthetizedTeeth = (): number[] => {
    const ids = technique.numbnessZone.teethIds;
    if (activeSide === 'right') {
      return ids;
    }
    // Convert to left side equivalents (quadrant 4 -> 3, quadrant 1 -> 2)
    return ids.map((id) => {
      if (id >= 41 && id <= 48) return id - 10;
      if (id >= 11 && id <= 18) return id + 10;
      return id;
    });
  };

  const anesthetizedList = getAnesthetizedTeeth();
  const isToothNumb = (toothId: number) => anesthetizedList.includes(toothId);

  const getToothName = (toothId: number): string => {
    const lastDigit = toothId % 10;
    const names: Record<number, string> = {
      1: 'Центральний різець',
      2: 'Бічний різець',
      3: 'Ікло',
      4: 'Перший премоляр',
      5: 'Другий премоляр',
      6: 'Перший моляр (шестірка)',
      7: 'Другий моляр (сімка)',
      8: 'Третій моляр (зуб мудрості / вісімка)'
    };
    const jaw = toothId < 30 ? 'верхньої щелепи' : 'нижньої щелепи';
    const side = [1, 4].includes(Math.floor(toothId / 10)) ? 'справа' : 'зліва';
    return `${names[lastDigit]} ${jaw} (${side})`;
  };

  return (
    <div className="bg-[#0B1326] border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl">
      {/* Header with Mode Switches */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Анатомічна карта зубної дуги (Arcus dentalis)
          </h3>
          <p className="text-xs text-slate-400">
            Реалістична візуалізація коронок та коренів зубів
          </p>
        </div>

        {/* View mode & Side selectors */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {/* Side Selector */}
          <div className="flex bg-[#101B33] p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveSide('right')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeSide === 'right'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Справа
            </button>
            <button
              onClick={() => setActiveSide('left')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeSide === 'left'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Зліва
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-[#101B33] p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'cards'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Анатомічні картки зубів"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('arch')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'arch'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Підковоподібна зубна дуга"
            >
              <CircleDot className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Summary status pill */}
      <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5 text-xs">
          <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-cyan-300">Вимкнені зуби: </span>
            <span className="text-slate-200">{technique.numbnessZone.teethSummary}</span>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-900/40 border border-cyan-800 shrink-0">
          {anesthetizedList.length > 0 ? `${anesthetizedList.length} зубів` : 'Лише слизова'}
        </span>
      </div>

      {/* 1. REALISTIC TOOTH CARDS GRID (Вестибулярні анатомічні коронки та корені) */}
      {viewMode === 'cards' && (
        <div className="space-y-4">
          {/* Upper Jaw (Maxilla) */}
          <div className="bg-[#070D1B] p-3 rounded-2xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                ВЕРХНЯ ЩЕЛЕПА (MAXILLA)
              </span>
              <span className="text-slate-500 text-[10px]">18..11 | 21..28</span>
            </div>

            {/* Upper Right & Left teeth scrollable/grid */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {(activeSide === 'right' ? upperRight : upperLeft).map((tooth) => (
                <RealisticToothCard
                  key={tooth}
                  toothNumber={tooth}
                  name={getToothName(tooth)}
                  isNumb={isToothNumb(tooth)}
                  onClick={() => setSelectedToothInfo(tooth)}
                />
              ))}
            </div>
          </div>

          {/* Lower Jaw (Mandibula) */}
          <div className="bg-[#070D1B] p-3 rounded-2xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                НИЖНЯ ЩЕЛЕПА (MANDIBULA)
              </span>
              <span className="text-slate-500 text-[10px]">48..41 | 31..38</span>
            </div>

            {/* Lower Right & Left teeth */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {(activeSide === 'right' ? lowerRight : lowerLeft).map((tooth) => (
                <RealisticToothCard
                  key={tooth}
                  toothNumber={tooth}
                  name={getToothName(tooth)}
                  isNumb={isToothNumb(tooth)}
                  onClick={() => setSelectedToothInfo(tooth)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. REALISTIC PARABOLIC HORSESHOE DENTAL ARCH (Окклюзионный вид дуги) */}
      {viewMode === 'arch' && (
        <div className="bg-[#070D1B] p-4 rounded-2xl border border-slate-800 text-center space-y-3">
          <div className="text-xs font-mono text-slate-400 flex justify-between px-2">
            <span>ОКЛЮЗІЙНИЙ ВИД ЗУБНОЇ ДУГИ</span>
            <span className="text-cyan-400 font-bold">ARCUS DENTALIS</span>
          </div>

          <div className="relative w-full aspect-[4/3] max-h-[300px] mx-auto bg-[#091122] rounded-xl border border-slate-800 flex items-center justify-center p-2">
            <svg viewBox="0 0 100 100" className="w-full h-full max-h-[280px]">
              {/* Dental Arch Alveolar Ridge Path */}
              <path
                d="M 18 85 C 16 40, 28 15, 50 15 C 72 15, 84 40, 82 85"
                fill="none"
                stroke="#1E293B"
                strokeWidth="10"
                strokeLinecap="round"
              />

              {/* Individual Occlusal Teeth along the parabolic arch */}
              {/* Right quadrant lower (48 to 41) */}
              <ToothOcclusal type="molar_2" cx={18} cy={82} rotation={-10} scale={1.2} isNumb={isToothNumb(48)} label="48" />
              <ToothOcclusal type="molar_2" cx={19} cy={70} rotation={-15} scale={1.2} isNumb={isToothNumb(47)} label="47" />
              <ToothOcclusal type="molar_1" cx={21} cy={58} rotation={-20} scale={1.25} isNumb={isToothNumb(46)} label="46" />
              <ToothOcclusal type="premolar" cx={25} cy={46} rotation={-30} scale={1.1} isNumb={isToothNumb(45)} label="45" />
              <ToothOcclusal type="premolar" cx={30} cy={36} rotation={-45} scale={1.1} isNumb={isToothNumb(44)} label="44" />
              <ToothOcclusal type="canine" cx={36} cy={27} rotation={-60} scale={1.1} isNumb={isToothNumb(43)} label="43" />
              <ToothOcclusal type="incisor" cx={42} cy={20} rotation={-75} scale={1.1} isNumb={isToothNumb(42)} label="42" />
              <ToothOcclusal type="incisor" cx={48} cy={17} rotation={-85} scale={1.1} isNumb={isToothNumb(41)} label="41" />

              {/* Left quadrant lower (31 to 38) */}
              <ToothOcclusal type="incisor" cx={52} cy={17} rotation={85} scale={1.1} isNumb={isToothNumb(31)} label="31" />
              <ToothOcclusal type="incisor" cx={58} cy={20} rotation={75} scale={1.1} isNumb={isToothNumb(32)} label="32" />
              <ToothOcclusal type="canine" cx={64} cy={27} rotation={60} scale={1.1} isNumb={isToothNumb(33)} label="33" />
              <ToothOcclusal type="premolar" cx={70} cy={36} rotation={45} scale={1.1} isNumb={isToothNumb(34)} label="34" />
              <ToothOcclusal type="premolar" cx={75} cy={46} rotation={30} scale={1.1} isNumb={isToothNumb(35)} label="35" />
              <ToothOcclusal type="molar_1" cx={79} cy={58} rotation={20} scale={1.25} isNumb={isToothNumb(36)} label="36" />
              <ToothOcclusal type="molar_2" cx={81} cy={70} rotation={15} scale={1.2} isNumb={isToothNumb(37)} label="37" />
              <ToothOcclusal type="molar_2" cx={82} cy={82} rotation={10} scale={1.2} isNumb={isToothNumb(38)} label="38" />

              <text x="50" y="55" textAnchor="middle" fill="#64748B" fontSize="3" fontFamily="monospace">
                ЯЗИК (LINGUA)
              </text>
            </svg>
          </div>
        </div>
      )}

      {/* Selected tooth popup info */}
      {selectedToothInfo && (
        <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between text-xs animate-in fade-in">
          <div>
            <span className="font-bold text-cyan-300 block">
              Зуб #{selectedToothInfo}: {getToothName(selectedToothInfo)}
            </span>
            <span className="text-slate-300">
              Статус: {isToothNumb(selectedToothInfo) ? '✓ Повне знеболення (пульпа + періодонт)' : '○ Чутливий (не блокується цією методикою)'}
            </span>
          </div>
          <button
            onClick={() => setSelectedToothInfo(null)}
            className="text-slate-400 hover:text-slate-200 text-xs font-mono ml-2 p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Mucosa, Gingiva & Soft Tissues */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-[#101B33] border border-slate-800">
          <span className="text-slate-400 font-semibold block mb-0.5">Слизова ясен та окістя:</span>
          <span className="text-slate-200">{technique.numbnessZone.mucosa}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#101B33] border border-slate-800">
          <span className="text-slate-400 font-semibold block mb-0.5">М’які тканини (язик, губи):</span>
          <span className="text-slate-200">{technique.numbnessZone.softTissues}</span>
        </div>
      </div>
    </div>
  );
};

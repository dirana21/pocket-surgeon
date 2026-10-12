import React from 'react';

// Generates anatomically shaped teeth for both Occlusal View and Arch View

interface ToothShapeProps {
  type: 'molar' | 'premolar' | 'canine' | 'incisor';
  isNumb?: boolean;
  toothNumber?: number;
  className?: string;
}

// 1. Occlusal Surface (Жевательная поверхность зуба с бугорками и фиссурами)
export const ToothOcclusal: React.FC<{
  type: 'molar_1' | 'molar_2' | 'premolar' | 'incisor' | 'canine';
  cx: number;
  cy: number;
  scale?: number;
  rotation?: number;
  isNumb?: boolean;
  label?: string;
}> = ({ type, cx, cy, scale = 1, rotation = 0, isNumb = false, label }) => {
  const enamelFill = isNumb ? '#22D3EE' : '#E2E8F0';
  const enamelStroke = isNumb ? '#06B6D4' : '#94A3B8';
  const fissureStroke = isNumb ? '#083344' : '#64748B';
  const cuspShadow = isNumb ? 'rgba(6, 182, 212, 0.4)' : 'rgba(148, 163, 184, 0.35)';

  return (
    <g transform={`translate(${cx}, ${cy}) rotate(${rotation}) scale(${scale})`}>
      {/* GLOW IF NUMB */}
      {isNumb && (
        <circle r="6" fill="#06B6D4" opacity="0.35" filter="blur(2px)" />
      )}

      {/* MOLAR 1 (5 cusps: 3 buccal, 2 lingual - e.g. tooth 46/36) */}
      {type === 'molar_1' && (
        <g>
          {/* Main tooth body with natural rounded pentagonal outline */}
          <path
            d="M -4.2 -3.8 C -2.5 -4.8, 2.5 -4.8, 4.2 -3.8 C 5.2 -2, 5.4 2, 4.2 3.8 C 2.5 4.8, -2.5 4.8, -4.2 3.8 C -5.4 2, -5.2 -2, -4.2 -3.8 Z"
            fill={enamelFill}
            stroke={enamelStroke}
            strokeWidth="0.6"
          />
          {/* Cusps shading */}
          <ellipse cx="-2.2" cy="-2.4" rx="1.4" ry="1.2" fill={cuspShadow} />
          <ellipse cx="2.2" cy="-2.4" rx="1.4" ry="1.2" fill={cuspShadow} />
          <ellipse cx="-2.6" cy="2.2" rx="1.3" ry="1.1" fill={cuspShadow} />
          <ellipse cx="0.2" cy="2.5" rx="1.2" ry="1.1" fill={cuspShadow} />
          <ellipse cx="2.6" cy="2.2" rx="1.3" ry="1.1" fill={cuspShadow} />
          {/* Y-shaped / cruciform fissures (фиссуры) */}
          <path
            d="M -3.2 0 Q 0 0.3 3.2 0 M 0 -3.2 L 0 0.5 M 0 0.5 L -1.5 2.8 M 0 0.5 L 1.5 2.8"
            fill="none"
            stroke={fissureStroke}
            strokeWidth="0.4"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* MOLAR 2 / 3 (4 cusps: 2 buccal, 2 lingual - e.g. tooth 47, 48) */}
      {type === 'molar_2' && (
        <g>
          <rect
            x="-4.2"
            y="-3.8"
            width="8.4"
            height="7.6"
            rx="2.6"
            fill={enamelFill}
            stroke={enamelStroke}
            strokeWidth="0.6"
          />
          {/* 4 distinct cusps */}
          <ellipse cx="-2" cy="-1.8" rx="1.4" ry="1.2" fill={cuspShadow} />
          <ellipse cx="2" cy="-1.8" rx="1.4" ry="1.2" fill={cuspShadow} />
          <ellipse cx="-2" cy="1.8" rx="1.4" ry="1.2" fill={cuspShadow} />
          <ellipse cx="2" cy="1.8" rx="1.4" ry="1.2" fill={cuspShadow} />
          {/* Cross fissure */}
          <path
            d="M -3 0 L 3 0 M 0 -2.6 L 0 2.6"
            fill="none"
            stroke={fissureStroke}
            strokeWidth="0.45"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* PREMOLAR (Oval shape with 2 cusps - buccal and lingual) */}
      {type === 'premolar' && (
        <g>
          <ellipse
            cx="0"
            cy="0"
            rx="3.2"
            ry="3.8"
            fill={enamelFill}
            stroke={enamelStroke}
            strokeWidth="0.6"
          />
          <ellipse cx="0" cy="-1.6" rx="1.8" ry="1.2" fill={cuspShadow} />
          <ellipse cx="0" cy="1.6" rx="1.6" ry="1.1" fill={cuspShadow} />
          {/* Central fissure */}
          <path
            d="M -1.8 0 Q 0 -0.4 1.8 0"
            fill="none"
            stroke={fissureStroke}
            strokeWidth="0.4"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* CANINE (Diamond-ovoid with sharp cusp tip) */}
      {type === 'canine' && (
        <g>
          <path
            d="M 0 -3.6 C 2.5 -2.5, 3 1.5, 0 3.6 C -3 1.5, -2.5 -2.5, 0 -3.6 Z"
            fill={enamelFill}
            stroke={enamelStroke}
            strokeWidth="0.6"
          />
          <circle cx="0" cy="-0.5" r="1.3" fill={cuspShadow} />
        </g>
      )}

      {/* INCISOR (Elongated chisel/wedge edge) */}
      {type === 'incisor' && (
        <g>
          <path
            d="M -3 -1.2 C -2 -2.2, 2 -2.2, 3 -1.2 C 2.8 1.6, -2.8 1.6, -3 -1.2 Z"
            fill={enamelFill}
            stroke={enamelStroke}
            strokeWidth="0.6"
          />
          <line x1="-2.2" y1="0.2" x2="2.2" y2="0.2" stroke={fissureStroke} strokeWidth="0.35" />
        </g>
      )}

      {/* Optional Tooth Number / Label */}
      {label && (
        <text
          x="0"
          y="0.8"
          textAnchor="middle"
          fontSize="2"
          fontFamily="monospace"
          fontWeight="bold"
          fill={isNumb ? '#083344' : '#334155'}
          pointerEvents="none"
        >
          {label}
        </text>
      )}
    </g>
  );
};

// 2. Realistic Vestibular/Crown View for Tooth Chart (Одонтограма)
export const RealisticToothCard: React.FC<{
  toothNumber: number;
  name: string;
  isNumb: boolean;
  onClick?: () => void;
}> = ({ toothNumber, name, isNumb, onClick }) => {
  // Determine tooth anatomy category:
  // Molars: 18, 17, 16, 26, 27, 28, 48, 47, 46, 36, 37, 38
  // Premolars: 15, 14, 24, 25, 45, 44, 34, 35
  // Canines: 13, 23, 43, 33
  // Incisors: 12, 11, 21, 22, 42, 41, 31, 32

  const isMolar = [18, 17, 16, 26, 27, 28, 48, 47, 46, 36, 37, 38].includes(toothNumber);
  const isPremolar = [15, 14, 24, 25, 45, 44, 34, 35].includes(toothNumber);
  const isCanine = [13, 23, 43, 33].includes(toothNumber);
  const isUpper = toothNumber < 30;

  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col items-center p-2 rounded-xl border transition-all duration-300 ${
        isNumb
          ? 'bg-gradient-to-b from-cyan-950/60 to-slate-900 border-cyan-400 shadow-lg shadow-cyan-500/25 scale-[1.03] ring-1 ring-cyan-400/50'
          : 'bg-[#0E172E] border-slate-800 hover:border-slate-700 hover:bg-slate-850 opacity-80'
      }`}
    >
      {/* Tooth number badge */}
      <span
        className={`text-[11px] font-mono font-extrabold px-1.5 py-0.5 rounded-md mb-1.5 transition-colors ${
          isNumb
            ? 'bg-cyan-500 text-slate-950 shadow-sm'
            : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
        }`}
      >
        {toothNumber}
      </span>

      {/* SVG Anatomical Tooth Graphic */}
      <div className="w-10 h-14 flex items-center justify-center relative">
        <svg viewBox="0 0 40 60" className="w-full h-full drop-shadow">
          <defs>
            <linearGradient id={`enamelGrad_${toothNumber}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isNumb ? '#E0F2FE' : '#F8FAFC'} />
              <stop offset="60%" stopColor={isNumb ? '#38BDF8' : '#CBD5E1'} />
              <stop offset="100%" stopColor={isNumb ? '#0284C7' : '#94A3B8'} />
            </linearGradient>
            <linearGradient id={`rootGrad_${toothNumber}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isNumb ? '#38BDF8' : '#CBD5E1'} />
              <stop offset="100%" stopColor={isNumb ? '#0369A1' : '#64748B'} />
            </linearGradient>
          </defs>

          {/* ROOT (Корень зуба) */}
          {isUpper ? (
            // Upper teeth roots pointing up
            isMolar ? (
              // 3 roots for upper molar
              <g stroke={isNumb ? '#0284C7' : '#64748B'} strokeWidth="1" fill={`url(#rootGrad_${toothNumber})`}>
                <path d="M 8 28 C 6 18, 7 8, 10 3 C 13 8, 14 18, 15 28 Z" />
                <path d="M 16 28 C 17 18, 19 6, 21 2 C 23 6, 24 18, 25 28 Z" />
                <path d="M 26 28 C 28 18, 31 8, 33 4 C 34 8, 33 18, 31 28 Z" />
              </g>
            ) : (
              // 1-2 roots
              <path
                d="M 12 28 C 10 16, 14 4, 20 2 C 26 4, 30 16, 28 28 Z"
                fill={`url(#rootGrad_${toothNumber})`}
                stroke={isNumb ? '#0284C7' : '#64748B'}
                strokeWidth="1"
              />
            )
          ) : (
            // Lower teeth roots pointing down
            isMolar ? (
              // 2 bifurcated roots for lower molar
              <g stroke={isNumb ? '#0284C7' : '#64748B'} strokeWidth="1" fill={`url(#rootGrad_${toothNumber})`}>
                <path d="M 8 32 C 6 42, 8 52, 12 58 C 15 52, 16 42, 17 32 Z" />
                <path d="M 23 32 C 24 42, 27 52, 30 58 C 33 52, 34 42, 32 32 Z" />
              </g>
            ) : (
              // 1 tapered root for lower anterior/premolar
              <path
                d="M 13 32 C 11 44, 15 54, 20 58 C 25 54, 29 44, 27 32 Z"
                fill={`url(#rootGrad_${toothNumber})`}
                stroke={isNumb ? '#0284C7' : '#64748B'}
                strokeWidth="1"
              />
            )
          )}

          {/* CROWN (Коронка зуба) */}
          {isMolar && (
            // Molar Crown with realistic cusps
            <g>
              <path
                d={
                  isUpper
                    ? "M 6 28 C 4 36, 6 48, 12 50 C 16 48, 20 51, 24 48 C 28 51, 34 48, 34 28 C 32 26, 8 26, 6 28 Z"
                    : "M 6 32 C 4 24, 6 12, 12 10 C 16 12, 20 9, 24 12 C 28 9, 34 12, 34 32 C 32 34, 8 34, 6 32 Z"
                }
                fill={`url(#enamelGrad_${toothNumber})`}
                stroke={isNumb ? '#38BDF8' : '#CBD5E1'}
                strokeWidth="1.2"
              />
              {/* Enamel grooves on crown */}
              <line
                x1="18"
                y1={isUpper ? "32" : "16"}
                x2="18"
                y2={isUpper ? "44" : "28"}
                stroke={isNumb ? '#0369A1' : '#64748B'}
                strokeWidth="0.8"
                strokeLinecap="round"
              />
              <line
                x1="24"
                y1={isUpper ? "34" : "18"}
                x2="24"
                y2={isUpper ? "42" : "26"}
                stroke={isNumb ? '#0369A1' : '#64748B'}
                strokeWidth="0.8"
                strokeLinecap="round"
              />
            </g>
          )}

          {isPremolar && (
            // Premolar Crown (rounded bicuspid)
            <path
              d={
                isUpper
                  ? "M 10 28 C 7 36, 10 49, 17 50 C 20 48, 23 50, 30 49 C 33 36, 31 28, 10 28 Z"
                  : "M 10 32 C 7 24, 10 11, 17 10 C 20 12, 23 10, 30 11 C 33 24, 31 32, 10 32 Z"
              }
              fill={`url(#enamelGrad_${toothNumber})`}
              stroke={isNumb ? '#38BDF8' : '#CBD5E1'}
              strokeWidth="1.2"
            />
          )}

          {isCanine && (
            // Canine Crown (pointed diamond cusp)
            <path
              d={
                isUpper
                  ? "M 11 28 C 8 36, 12 48, 20 53 C 28 48, 32 36, 29 28 Z"
                  : "M 11 32 C 8 24, 12 12, 20 7 C 28 12, 32 24, 29 32 Z"
              }
              fill={`url(#enamelGrad_${toothNumber})`}
              stroke={isNumb ? '#38BDF8' : '#CBD5E1'}
              strokeWidth="1.2"
            />
          )}

          {!isMolar && !isPremolar && !isCanine && (
            // Incisor Crown (chisel edge)
            <path
              d={
                isUpper
                  ? "M 11 28 C 8 36, 9 49, 13 50 L 27 50 C 31 49, 32 36, 29 28 Z"
                  : "M 11 32 C 8 24, 9 11, 13 10 L 27 10 C 31 11, 32 24, 29 32 Z"
              }
              fill={`url(#enamelGrad_${toothNumber})`}
              stroke={isNumb ? '#38BDF8' : '#CBD5E1'}
              strokeWidth="1.2"
            />
          )}

          {/* Enamel cervical margin collar (шийка зуба) */}
          <path
            d={isUpper ? "M 9 28 Q 20 31 31 28" : "M 9 32 Q 20 29 31 32"}
            fill="none"
            stroke={isNumb ? '#0284C7' : '#94A3B8'}
            strokeWidth="0.8"
          />
        </svg>

        {/* Numb status badge overlay */}
        {isNumb && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
        )}
      </div>

      {/* Short tooth category name */}
      <span
        className={`text-[9px] font-sans text-center mt-1 truncate max-w-full ${
          isNumb ? 'text-cyan-300 font-bold' : 'text-slate-400'
        }`}
      >
        {isMolar ? 'Моляр' : isPremolar ? 'Премоляр' : isCanine ? 'Ікло' : 'Різець'}
      </span>
    </button>
  );
};

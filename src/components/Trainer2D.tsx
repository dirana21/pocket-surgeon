import React, { useState, useRef, useEffect } from 'react';
import { 
  Crosshair, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  HelpCircle, 
  GraduationCap, 
  Syringe, 
  Layers, 
  Info,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ANESTHESIA_TECHNIQUES, AnesthesiaTechnique } from '../data/anesthesiaData';

interface Trainer2DProps {
  currentTechnique: AnesthesiaTechnique;
  onSelectTechnique: (technique: AnesthesiaTechnique) => void;
}

export const Trainer2D: React.FC<Trainer2DProps> = ({
  currentTechnique,
  onSelectTechnique
}) => {
  const [examMode, setExamMode] = useState<boolean>(false);
  // Coordinates as percentages of the canvas (0-100)
  const [needlePos, setNeedlePos] = useState<{ x: number; y: number } | null>(null);
  const [isAspirating, setIsAspirating] = useState<boolean>(false);
  const [aspirationResult, setAspirationResult] = useState<'negative' | 'positive' | null>(null);
  const [examScore, setExamScore] = useState<number | null>(null);
  const [showAnatomyLabels, setShowAnatomyLabels] = useState<boolean>(true);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Set initial target when technique changes
  useEffect(() => {
    // Start with default position close to target for practice
    setNeedlePos({
      x: currentTechnique.targetZoneCoords.x,
      y: currentTechnique.targetZoneCoords.y
    });
    setAspirationResult(null);
    setExamScore(null);
  }, [currentTechnique.id]);

  // Handle click or touch on the SVG arena
  const handlePointerInteraction = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));
    
    setNeedlePos({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
    setAspirationResult(null);
  };

  // Target coordinates
  const targetX = currentTechnique.targetZoneCoords.x;
  const targetY = currentTechnique.targetZoneCoords.y;
  const tolerance = currentTechnique.targetZoneCoords.toleranceRadius;

  // Calculate distance from ideal point
  const currentX = needlePos?.x ?? targetX;
  const currentY = needlePos?.y ?? targetY;
  const distance = Math.hypot(currentX - targetX, currentY - targetY);

  // Determine anatomical result based on needle position
  let status: 'perfect' | 'medial_error' | 'distal_error' | 'lateral_error' | 'high_error' | 'low_error' = 'perfect';
  let statusTitle = '✓ Точне попадання в ціль!';
  let statusDesc = 'Кістковий контакт з Sulcus colli mandibulae. Ідеальна позиція для депонування.';
  let badgeColor = 'bg-teal-500/20 text-teal-300 border-teal-500/40';

  if (distance <= tolerance) {
    status = 'perfect';
    statusTitle = '✓ Точний вкол (Ціль досягнута)';
    statusDesc = 'Кістковий упор у Sulcus colli mandibulae. Вище язичка щелепи (lingula).';
    badgeColor = 'bg-teal-500/20 text-teal-300 border-teal-500/40';
  } else {
    // Analyzing specific mandibular/torusal clinical errors
    if (currentTechnique.id === 'mandibular' || currentTechnique.id === 'torusal') {
      if (currentX < targetX - tolerance) {
        status = 'medial_error';
        statusTitle = '⚠️ Помилка: Занадто медіально від складки';
        statusDesc = 'Голка потрапляє у внутрішній крилоподібний м’яз (m. pterygoideus medialis). Ризик тризму щелепи!';
        badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      } else if (currentX > targetX + tolerance + 3) {
        status = 'lateral_error';
        statusTitle = '⚠️ Помилка: Занадто латерально';
        statusDesc = 'Удар об передній край гілки щелепи або скроневий гребінець. Ризик згину/відлому голки!';
        badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      } else if (currentY < targetY - tolerance) {
        status = 'high_error';
        statusTitle = '⚠️ Помилка: Занадто високо (>15 мм над оклюзією)';
        statusDesc = 'Вкол у вирізку щелепи або вище цільового каналу. Анестезія не подіє або буде слабкою.';
        badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      } else if (currentY > targetY + tolerance) {
        status = 'low_error';
        statusTitle = '⚠️ Помилка: Занадто низько (біля оклюзійної площини)';
        statusDesc = 'Депонування нижче foramen mandibulare. Блокади нижньолуночкового нерва не відбудеться.';
        badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      }
      
      // Distal and deep error
      if (currentX > targetX + 1 && currentY < targetY + 2 && distance > tolerance * 1.5) {
        status = 'distal_error';
        statusTitle = '🚨 КРИТИЧНО: Занадто глибоко в привушну залозу';
        statusDesc = 'Проникнення голки в glandula parotidea. Ризик парезу гілок n. facialis (перекіс міміки обличчя)!';
        badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      }
    } else {
      // Upper jaw techniques
      status = 'medial_error';
      statusTitle = '⚠️ Відхилення від анатомічного орієнтира';
      statusDesc = `Зміщення на ${Math.round(distance)} мм від цільового отвору. Низька ефективність блокади.`;
      badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
  }

  // Handle Aspiration Test
  const triggerAspiration = () => {
    setIsAspirating(true);
    setTimeout(() => {
      setIsAspirating(false);
      // In critical vascular error zone, aspiration is positive (blood!)
      if (status === 'distal_error' || (currentX > 75 && currentY > 40)) {
        setAspirationResult('positive');
      } else {
        setAspirationResult('negative');
        if (status === 'perfect') {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
          });
        }
      }
    }, 700);
  };

  // Evaluate exam
  const handleExamSubmit = () => {
    let score = 5;
    if (distance <= tolerance) {
      score = 5;
      confetti({ particleCount: 100, spread: 80 });
    } else if (distance <= tolerance * 1.6) {
      score = 4;
    } else if (distance <= tolerance * 2.4) {
      score = 3;
    } else {
      score = 2;
    }
    setExamScore(score);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Technique Quick Selector Header */}
      <div className="bg-[#0B1326] border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Crosshair className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                2D Тренажер Топографії Вколу
                <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-800/60">
                  ОНМедУ
                </span>
              </h2>
              <p className="text-xs text-slate-400">Симуляція кута та точки введення голки</p>
            </div>
          </div>

          {/* Exam / Training Mode Switch */}
          <button
            onClick={() => {
              setExamMode(!examMode);
              setExamScore(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              examMode
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm shadow-rose-900/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-cyan-500/40'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            {examMode ? 'Екзамен наосліп' : 'Режим навчання'}
          </button>
        </div>

        {/* Horizontal Technique Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {ANESTHESIA_TECHNIQUES.map((tech) => {
            const isSelected = tech.id === currentTechnique.id;
            return (
              <button
                key={tech.id}
                onClick={() => onSelectTechnique(tech)}
                className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap font-medium transition-all border ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-[#101B33] text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {tech.shortTitle}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive 2D Anatomy Canvas Arena */}
      <div className="relative bg-[#060E20] border border-cyan-900/40 rounded-2xl overflow-hidden shadow-2xl">
        {/* Top telemetry HUD bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#0B1326]/90 border-b border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>HUD 2D • ТОПОГРАФІЯ ВКОЛУ</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>X: <strong className="text-cyan-300">{currentX.toFixed(1)}%</strong></span>
            <span>Y: <strong className="text-cyan-300">{currentY.toFixed(1)}%</strong></span>
            <span>Відхил: <strong className={distance <= tolerance ? 'text-teal-400' : 'text-amber-400'}>{Math.round(distance)} мм</strong></span>
          </div>
        </div>

        {/* SVG Anatomical Canvas */}
        <div className="relative w-full aspect-[4/3] max-h-[380px] bg-[#070D1B] radar-grid select-none touch-none">
          <svg
            ref={svgRef}
            onPointerDown={handlePointerInteraction}
            onPointerMove={(e) => {
              if (e.buttons === 1) handlePointerInteraction(e);
            }}
            viewBox="0 0 100 100"
            className="w-full h-full cursor-crosshair"
          >
            {/* Background Medical Guides */}
            <defs>
              <radialGradient id="targetGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.6" />
                <stop offset="70%" stopColor="#06B6D4" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="dangerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* MANDIBULAR / TORUSAL ANATOMICAL SVG SCHEMATIC */}
            {(currentTechnique.id === 'mandibular' || currentTechnique.id === 'torusal') && (
              <g id="oral-cavity-mandibular">
                {/* Oral Cavity Border / Palatopharyngeal arch */}
                <path
                  d="M 15 15 Q 50 5 85 15 Q 92 50 85 85 Q 50 95 15 85 Q 8 50 15 15 Z"
                  fill="#0E172E"
                  stroke="#1E293B"
                  strokeWidth="0.8"
                />

                {/* Upper Teeth Arch (silhouette) */}
                <path
                  d="M 22 25 Q 50 16 78 25"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Lower Teeth Arch & Molars */}
                <path
                  d="M 22 75 Q 50 84 78 75"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* 3 Lower Molars on right (48, 47, 46) */}
                <rect x="68" y="71" width="4.5" height="4.5" rx="1" fill="#64748B" />
                <rect x="73" y="69" width="4.5" height="4.5" rx="1" fill="#64748B" />
                <rect x="78" y="67" width="4.5" height="4.5" rx="1" fill="#64748B" />

                {/* Tongue (Lingua) */}
                <path
                  d="M 32 60 Q 50 48 68 60 Q 50 78 32 60 Z"
                  fill="#881337"
                  fillOpacity="0.35"
                  stroke="#BE123C"
                  strokeWidth="0.7"
                />
                {!examMode && showAnatomyLabels && (
                  <text x="50" y="64" textAnchor="middle" fill="#FDA4AF" fontSize="2.8" fontFamily="sans-serif">
                    Язик (N. lingualis)
                  </text>
                )}

                {/* Occlusal Plane Level (+10 mm guide line) */}
                {!examMode && (
                  <g>
                    <line
                      x1="18"
                      y1="58"
                      x2="85"
                      y2="58"
                      stroke="#06B6D4"
                      strokeWidth="0.5"
                      strokeDasharray="1.5,1.5"
                      strokeOpacity="0.7"
                    />
                    <text x="84" y="56.5" textAnchor="end" fill="#38BDF8" fontSize="2.4" fontFamily="monospace">
                      +10 мм над жувальною поверхнею
                    </text>
                  </g>
                )}

                {/* Danger Zone: Parotid Gland / Facial Nerve (Distal/Deep) */}
                <path
                  d="M 78 25 Q 92 35 90 60 Q 82 55 78 40 Z"
                  fill="url(#dangerGlow)"
                  stroke="#EF4444"
                  strokeWidth="0.6"
                  strokeDasharray="1,1"
                />
                {!examMode && showAnatomyLabels && (
                  <text x="86" y="38" fill="#F87171" fontSize="2.2" fontFamily="sans-serif" textAnchor="middle">
                    Зона ризику: N. facialis
                  </text>
                )}

                {/* Danger Zone: Medial Pterygoid Muscle (Medial) */}
                <path
                  d="M 50 35 Q 56 45 54 65 Q 46 58 48 40 Z"
                  fill="#B45309"
                  fillOpacity="0.25"
                  stroke="#D97706"
                  strokeWidth="0.6"
                  strokeDasharray="1,1"
                />
                {!examMode && showAnatomyLabels && (
                  <text x="46" y="48" fill="#FBBF24" fontSize="2.2" fontFamily="sans-serif" textAnchor="middle">
                    M. pterygoideus medialis
                  </text>
                )}

                {/* Plica pterygomandibularis (Криловидно-щелепна складка) */}
                <path
                  d="M 58 28 Q 63 45 61 68"
                  fill="none"
                  stroke={examMode ? '#334155' : '#38BDF8'}
                  strokeWidth="1.8"
                  strokeDasharray={examMode ? 'none' : '2,1'}
                />
                {!examMode && showAnatomyLabels && (
                  <text x="58" y="26" fill="#7DD3FC" fontSize="2.6" fontWeight="bold">
                    Plica pterygomandibularis
                  </text>
                )}

                {/* Fovea retromolaris (Позадимолярна ямка) */}
                <ellipse
                  cx="74"
                  cy="62"
                  rx="4.5"
                  ry="3.5"
                  fill="#0284C7"
                  fillOpacity="0.25"
                  stroke="#0284C7"
                  strokeWidth="0.6"
                />
                {!examMode && showAnatomyLabels && (
                  <text x="75" y="66" fill="#38BDF8" fontSize="2.3">
                    Fovea retromolaris
                  </text>
                )}

                {/* Torus mandibulae (для торусальної) */}
                {currentTechnique.id === 'torusal' && (
                  <circle
                    cx="68"
                    cy="35"
                    r="4"
                    fill="#14B8A6"
                    fillOpacity="0.3"
                    stroke="#14B8A6"
                    strokeWidth="0.8"
                  />
                )}
              </g>
            )}

            {/* UPPER JAW TECHNIQUES SVG SCHEMATIC (Tuberal / Infraorbital / Palatine / Incisive) */}
            {currentTechnique.category === 'upper' && (
              <g id="upper-jaw-schematic">
                {/* Maxillary / Palatal Arch */}
                <path
                  d="M 18 80 Q 50 15 82 80"
                  fill="#0E172E"
                  stroke="#1E293B"
                  strokeWidth="1.2"
                />

                {/* Dental arch teeth row */}
                <path
                  d="M 22 76 Q 50 22 78 76"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Midline suture (Sutura palatina mediana) */}
                <line x1="50" y1="26" x2="50" y2="76" stroke="#334155" strokeWidth="0.8" strokeDasharray="1,1" />

                {/* Foramen incisivum (Різцевий отвір) */}
                <ellipse cx="50" cy="52" rx="3.5" ry="2.8" fill="#14B8A6" fillOpacity="0.3" stroke="#14B8A6" strokeWidth="0.7" />
                {!examMode && showAnatomyLabels && (
                  <text x="50" y="47" textAnchor="middle" fill="#5EEAD4" fontSize="2.5">
                    Foramen incisivum
                  </text>
                )}

                {/* Foramen palatinum majus (Великий піднебінний отвір) */}
                <circle cx="70" cy="60" r="3" fill="#06B6D4" fillOpacity="0.3" stroke="#06B6D4" strokeWidth="0.7" />
                <circle cx="30" cy="60" r="3" fill="#06B6D4" fillOpacity="0.3" stroke="#06B6D4" strokeWidth="0.7" />
                {!examMode && showAnatomyLabels && (
                  <text x="70" y="66" fill="#38BDF8" fontSize="2.3" textAnchor="middle">
                    Foramen palatinum majus
                  </text>
                )}

                {/* Tuber Maxillae zone (for Tuberal) */}
                <path d="M 72 70 Q 82 50 78 30" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="1.5,1.5" />
                {!examMode && showAnatomyLabels && (
                  <text x="76" y="24" fill="#FCD34D" fontSize="2.4">
                    Tuber maxillae
                  </text>
                )}
              </g>
            )}

            {/* Target Bullseye Ring (Hidden in Exam Mode) */}
            {!examMode && (
              <g id="target-zone">
                <circle
                  cx={targetX}
                  cy={targetY}
                  r={tolerance}
                  fill="url(#targetGlow)"
                  stroke="#06B6D4"
                  strokeWidth="0.8"
                  strokeDasharray="2,1"
                  className="animate-pulse"
                />
                <circle cx={targetX} cy={targetY} r="1" fill="#22D3EE" />
                <text
                  x={targetX}
                  y={targetY - tolerance - 1.5}
                  fill="#22D3EE"
                  fontSize="2.4"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  ЦІЛЬ (Вкол)
                </text>
              </g>
            )}

            {/* Needle Trajectory Vector from opposite side */}
            <line
              x1={currentTechnique.needleVector.startX}
              y1={currentTechnique.needleVector.startY}
              x2={currentX}
              y2={currentY}
              stroke="#06B6D4"
              strokeWidth="0.9"
              strokeDasharray="2,2"
              strokeOpacity="0.8"
            />
            {/* Syringe barrel icon indicator */}
            <circle
              cx={currentTechnique.needleVector.startX}
              cy={currentTechnique.needleVector.startY}
              r="2"
              fill="#06B6D4"
            />

            {/* User Draggable Crosshair Needle Reticle */}
            <g id="needle-crosshair" transform={`translate(${currentX}, ${currentY})`}>
              {/* Outer glowing target circle */}
              <circle
                r="4.5"
                fill="none"
                stroke={distance <= tolerance ? '#14B8A6' : '#F59E0B'}
                strokeWidth="0.9"
                className="animate-spin-slow"
              />
              <line x1="-6" y1="0" x2="6" y2="0" stroke="#F8FAFC" strokeWidth="0.8" />
              <line x1="0" y1="-6" x2="0" y2="6" stroke="#F8FAFC" strokeWidth="0.8" />
              <circle r="1.2" fill={distance <= tolerance ? '#14B8A6' : '#F43F5E'} />
            </g>
          </svg>

          {/* Floating Instructions Banner */}
          <div className="absolute top-2 left-2 pointer-events-none">
            <span className="bg-slate-900/80 backdrop-blur-md text-[11px] text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700/60 shadow">
              Тапніть або проведіть пальцем для вибору точки
            </span>
          </div>

          {/* Labels Toggle */}
          <button
            onClick={() => setShowAnatomyLabels(!showAnatomyLabels)}
            className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md text-slate-300 hover:text-cyan-400 p-1.5 rounded-lg border border-slate-700/60 transition-colors"
            title="Перемкнути підписи"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>

        {/* Live Status Diagnostic Card */}
        <div className="p-3 bg-[#0B1326] border-t border-slate-800">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${badgeColor}`}>
                  {statusTitle}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {currentTechnique.latinName}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {statusDesc}
              </p>
            </div>

            {/* Quick Reset Button */}
            <button
              onClick={() => {
                setNeedlePos({ x: targetX, y: targetY });
                setAspirationResult(null);
                setExamScore(null);
              }}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
              title="Скинути до ідеалу"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Aspiration result alert */}
          {aspirationResult && (
            <div className={`mt-3 p-2.5 rounded-xl border flex items-center gap-2.5 text-xs transition-all ${
              aspirationResult === 'negative'
                ? 'bg-teal-950/40 border-teal-500/50 text-teal-300'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
            }`}>
              {aspirationResult === 'negative' ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                  <div>
                    <strong>Аспіраційна проба негативна (ЧИСТО):</strong> Крові в карпулі немає. Можна повільно вводити анестетик (1.5 мл).
                  </div>
                </>
              ) : (
                <>
                  <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 animate-bounce" />
                  <div>
                    <strong>Аспірація позитивна (КРОВ У КАРПУЛІ!):</strong> Попадання в судину (a. alveolaris inferior або венозне сплетення). Негайно підтягніть голку назад на 2-3 мм і повторіть пробу!
                  </div>
                </>
              )}
            </div>
          )}

          {/* Exam Score Card */}
          {examScore !== null && (
            <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Award className="w-6 h-6 text-cyan-400" />
                <div>
                  <h4 className="text-xs font-bold text-slate-100">
                    Оцінка кафедри ОНМедУ: <span className="text-cyan-300 text-sm">{examScore} з 5 балів</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {examScore === 5 && 'Бездоганно! Топографічні орієнтири засвоєно на відмінно.'}
                    {examScore === 4 && 'Добре. Похибка 1–2 мм, анестезія настане, але кут варто скоригувати.'}
                    {examScore === 3 && 'Задовільно. Відхилення суттєве, ризик неповного знеболення.'}
                    {examScore === 2 && 'Незадовільно! Попадання в м’яз або залозу. На повторну здачу!'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setExamScore(null)}
                className="text-[11px] text-cyan-400 underline ml-2"
              >
                Спробувати ще
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons Bar */}
        <div className="p-3 bg-[#081024] border-t border-slate-800 flex items-center gap-2">
          <button
            onClick={triggerAspiration}
            disabled={isAspirating}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all shadow-md shadow-cyan-500/20"
          >
            <Syringe className={`w-4 h-4 ${isAspirating ? 'animate-spin' : ''}`} />
            {isAspirating ? 'Проведення проби...' : 'Аспіраційна проба'}
          </button>

          {examMode ? (
            <button
              onClick={handleExamSubmit}
              className="py-2.5 px-4 rounded-xl bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-rose-600 transition-all shadow-md shadow-rose-900/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              Здати тест
            </button>
          ) : (
            <button
              onClick={() => {
                setExamMode(true);
                setNeedlePos({ x: 50, y: 50 });
                setExamScore(null);
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700"
            >
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              Тест наосліп
            </button>
          )}
        </div>
      </div>

      {/* Clinical landmarks summary card */}
      <div className="bg-[#0B1326] border border-slate-800 rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <Info className="w-4 h-4 text-cyan-400" />
          Орієнтири для здачі на кафедрі (ЧЛХ ОНМедУ):
        </h3>
        <ul className="space-y-1.5 text-xs text-slate-300">
          {currentTechnique.landmarks.map((lm, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-cyan-400 font-mono font-bold mt-0.5">•</span>
              <span>{lm}</span>
            </li>
          ))}
        </ul>

        <div className="p-2.5 rounded-xl bg-[#101B33] border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Глибина занурення:</span>
          <span className="font-mono font-bold text-cyan-300">{currentTechnique.parameters.depth}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#101B33] border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Положення циліндра шприца:</span>
          <span className="font-mono font-bold text-teal-300">{currentTechnique.parameters.needleAngle}</span>
        </div>
      </div>
    </div>
  );
};

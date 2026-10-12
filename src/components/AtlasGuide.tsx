import React, { useState } from 'react';
import { 
  BookOpen, 
  Crosshair, 
  AlertTriangle, 
  AlertOctagon, 
  Sparkles, 
  CheckCircle, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { ANESTHESIA_TECHNIQUES, AnesthesiaTechnique } from '../data/anesthesiaData';
import { DentalNumbnessMap } from './DentalNumbnessMap';

interface AtlasGuideProps {
  currentTechnique: AnesthesiaTechnique;
  onSelectTechnique: (tech: AnesthesiaTechnique) => void;
  onOpenTrainer: (tech: AnesthesiaTechnique) => void;
}

export const AtlasGuide: React.FC<AtlasGuideProps> = ({
  currentTechnique,
  onSelectTechnique,
  onOpenTrainer
}) => {
  const [activeTab, setActiveTab] = useState<'protocol' | 'numbness' | 'complications'>('protocol');

  return (
    <div className="space-y-4 pb-20">
      {/* Category Pills Header */}
      <div className="bg-[#0B1326] border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Атлас провідникових анестезій
              </h2>
              <p className="text-xs text-slate-400">
                Клінічна топографія ЧЛД (3 курс стоматології)
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-800/60">
            6 технік
          </span>
        </div>

        {/* Horizontal Technique Filter Buttons */}
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

      {/* Main Technique Card */}
      <div className="bg-[#0B1326] border border-cyan-900/30 rounded-2xl p-4 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block">
              {currentTechnique.category === 'lower' ? 'Нижня щелепа (Mandibula)' : 'Верхня щелепа (Maxilla)'}
            </span>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              {currentTechnique.title}
            </h2>
            <p className="text-xs text-slate-400 italic">
              {currentTechnique.latinName}
            </p>
          </div>

          {/* Quick jump to trainer button */}
          <button
            onClick={() => onOpenTrainer(currentTechnique)}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all shrink-0"
          >
            <Crosshair className="w-4 h-4 text-cyan-400" />
            Відкрити в 2D тренажері
          </button>
        </div>

        {/* Quick parameters grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-2.5 rounded-xl bg-[#070D1B] border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Глибина вколу</span>
            <span className="text-xs font-mono font-bold text-cyan-300">
              {currentTechnique.parameters.depth}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#070D1B] border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Об’єм розчину</span>
            <span className="text-xs font-mono font-bold text-teal-300">
              {currentTechnique.parameters.volume}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#070D1B] border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Час настання</span>
            <span className="text-xs font-mono font-bold text-slate-200">
              {currentTechnique.parameters.onset}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#070D1B] border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Ефективність</span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {currentTechnique.parameters.successRate}
            </span>
          </div>
        </div>

        {/* Nerves Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs text-slate-400 font-semibold mr-1">Цільові нерви:</span>
          {currentTechnique.targetNerves.map((nerve, i) => (
            <span
              key={i}
              className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-cyan-950/60 text-cyan-300 border border-cyan-800/50"
            >
              {nerve}
            </span>
          ))}
        </div>

        {/* Sub-tabs: Protocol vs Numbness vs Complications */}
        <div className="flex bg-[#070D1B] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('protocol')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'protocol'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Орієнтири & Протокол
          </button>
          <button
            onClick={() => setActiveTab('numbness')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'numbness'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Зона оніміння
          </button>
          <button
            onClick={() => setActiveTab('complications')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'complications'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ускладнення ({currentTechnique.complications.length})
          </button>
        </div>

        {/* TAB 1: Protocol & Landmarks */}
        {activeTab === 'protocol' && (
          <div className="space-y-4 pt-1">
            {/* Clinical landmarks */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-cyan-400" />
                Точні анатомічні орієнтири вколу:
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {currentTechnique.landmarks.map((landmark, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#070D1B] border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{landmark}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Position of Syringe */}
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/40 text-xs space-y-1">
              <span className="font-bold text-cyan-300 block">
                🎯 Напрямок шприца та кут введення:
              </span>
              <p className="text-slate-200 leading-relaxed">
                {currentTechnique.parameters.needleAngle}
              </p>
            </div>

            {/* Sequential Steps */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                Покроковий клінічний алгоритм (ОНМедУ):
              </h4>
              <div className="space-y-2">
                {currentTechnique.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#070D1B] border border-slate-800/80 space-y-1"
                  >
                    <span className="text-xs font-bold text-teal-300 block">
                      {step.title}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical Pearl Box */}
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Клінічне правило: </strong>
                {currentTechnique.clinicalPearl}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Numbness Map */}
        {activeTab === 'numbness' && (
          <div className="pt-1">
            <DentalNumbnessMap technique={currentTechnique} />
          </div>
        )}

        {/* TAB 3: Complications */}
        {activeTab === 'complications' && (
          <div className="space-y-3 pt-1">
            <p className="text-xs text-slate-400">
              Типові помилки студентів та лікарські ускладнення при відхиленні голки від орієнтирів:
            </p>

            {currentTechnique.complications.map((comp, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border space-y-2 ${
                  comp.type === 'danger'
                    ? 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                    : 'bg-amber-950/30 border-amber-500/50 text-amber-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {comp.type === 'danger' ? (
                    <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <h4 className="text-xs font-bold text-slate-100">
                    {comp.title}
                  </h4>
                </div>

                <div className="text-xs space-y-1">
                  <div>
                    <strong className="text-slate-400">Причина помилки: </strong>
                    <span className="text-slate-200">{comp.cause}</span>
                  </div>
                  <div>
                    <strong className="text-teal-400">Як запобігти: </strong>
                    <span className="text-teal-200">{comp.prevention}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

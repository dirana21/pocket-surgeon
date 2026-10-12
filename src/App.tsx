import React, { useState } from 'react';
import { 
  Crosshair, 
  BookOpen, 
  Calculator, 
  HelpCircle, 
  HeartHandshake, 
  GraduationCap,
  Sparkles,
  Info,
  X
} from 'lucide-react';
import { ANESTHESIA_TECHNIQUES, AnesthesiaTechnique } from './data/anesthesiaData';
import { Trainer2D } from './components/Trainer2D';
import { AtlasGuide } from './components/AtlasGuide';
import { CarpuleCalculator } from './components/CarpuleCalculator';
import { ClinicalQuiz } from './components/ClinicalQuiz';

type ActiveTab = 'atlas' | 'trainer' | 'calculator' | 'quiz';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('atlas');
  const [currentTechnique, setCurrentTechnique] = useState<AnesthesiaTechnique>(ANESTHESIA_TECHNIQUES[0]);
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);

  const handleOpenTrainer = (tech: AnesthesiaTechnique) => {
    setCurrentTechnique(tech);
    setActiveTab('trainer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#070D1B] text-slate-100 flex flex-col font-sans">
      {/* Top Mobile App Header */}
      <header className="sticky top-0 z-40 bg-[#0B1326]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold text-sm shadow-md shadow-cyan-500/20">
              💉
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-extrabold text-slate-100 tracking-tight">
                  Кишеньковий хірург
                </h1>
                <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-800">
                  ЧЛД PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Провідникові анестезії • ОНМедУ
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAboutModal(true)}
            className="p-2 rounded-xl bg-[#101B33] hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 transition-colors"
            title="Про застосунок"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-md w-full mx-auto px-3 pt-3">
        {activeTab === 'atlas' && (
          <AtlasGuide
            currentTechnique={currentTechnique}
            onSelectTechnique={setCurrentTechnique}
            onOpenTrainer={handleOpenTrainer}
          />
        )}

        {activeTab === 'trainer' && (
          <Trainer2D
            currentTechnique={currentTechnique}
            onSelectTechnique={setCurrentTechnique}
          />
        )}

        {activeTab === 'calculator' && (
          <CarpuleCalculator />
        )}

        {activeTab === 'quiz' && (
          <ClinicalQuiz />
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Dock */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B1326]/95 backdrop-blur-xl border-t border-slate-800/90 py-1.5 px-3">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          <button
            onClick={() => {
              setActiveTab('atlas');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              activeTab === 'atlas'
                ? 'text-cyan-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className={`w-5 h-5 mb-0.5 ${activeTab === 'atlas' ? 'text-cyan-400' : ''}`} />
            <span className="text-[10px]">Атлас</span>
            {activeTab === 'atlas' && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-0.5"></span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('trainer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              activeTab === 'trainer'
                ? 'text-cyan-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Crosshair className={`w-5 h-5 mb-0.5 ${activeTab === 'trainer' ? 'text-cyan-400' : ''}`} />
            <span className="text-[10px]">2D Тренажер</span>
            {activeTab === 'trainer' && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-0.5"></span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('calculator');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              activeTab === 'calculator'
                ? 'text-cyan-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className={`w-5 h-5 mb-0.5 ${activeTab === 'calculator' ? 'text-cyan-400' : ''}`} />
            <span className="text-[10px]">Калькулятор</span>
            {activeTab === 'calculator' && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-0.5"></span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('quiz');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              activeTab === 'quiz'
                ? 'text-cyan-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className={`w-5 h-5 mb-0.5 ${activeTab === 'quiz' ? 'text-cyan-400' : ''}`} />
            <span className="text-[10px]">Задачі ОНМедУ</span>
            {activeTab === 'quiz' && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-0.5"></span>
            )}
          </button>
        </div>
      </nav>

      {/* About / Clinical Reference Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0B1326] border border-cyan-800/40 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowAboutModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xl">
                🦷
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  Кишеньковий хірург ЧЛД
                </h3>
                <p className="text-xs text-cyan-400 font-mono">
                  ОНМедУ • Спеціальний випуск
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Створено спеціально для студентів 3-го курсу стоматологічного факультету ОНМедУ для успішної та впевненої здачі топографії провідникових анестезій на кафедрі хірургічної стоматології.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#101B33] border border-slate-800">
                <strong className="text-cyan-300 block mb-0.5">🎯 2D Тренажер вколу:</strong>
                <span className="text-slate-300">
                  Візуалізація анатомічних орієнтирів та міліметровий контроль помилок (тризм, парез лицьового нерва).
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#101B33] border border-slate-800">
                <strong className="text-teal-300 block mb-0.5">🧪 Калькулятор карпул:</strong>
                <span className="text-slate-300">
                  Точний розрахунок токсичності артикаїну за вагою та ліміту адреналіну (0.04 мг) для кардіологічних пацієнтів.
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Зрозуміло, до практики!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

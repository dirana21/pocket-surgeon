import React, { useState } from 'react';
import { 
  Calculator, 
  Heart, 
  Baby, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Info, 
  Syringe,
  Sparkles
} from 'lucide-react';
import { 
  ANESTHETIC_DRUGS, 
  AnestheticDrug, 
  PatientRiskProfile, 
  calculateCarpuleLimits 
} from '../data/drugsData';

export const CarpuleCalculator: React.FC = () => {
  const [weightKg, setWeightKg] = useState<number>(70);
  const [selectedDrug, setSelectedDrug] = useState<AnestheticDrug>(ANESTHETIC_DRUGS[0]);
  const [risks, setRisks] = useState<PatientRiskProfile>({
    cardiovascular: false,
    pregnancy: false,
    thyrotoxicosis: false,
    sulfiteAllergy: false
  });

  const calculation = calculateCarpuleLimits(weightKg, selectedDrug, risks);

  const toggleRisk = (key: keyof PatientRiskProfile) => {
    setRisks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Generate visual array of carpules (up to 8)
  const maxSafeCount = Math.floor(calculation.finalMaxCarpules);
  const carpuleSlots = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="bg-[#0B1326] border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Calculator className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Калькулятор карпул та адреналіну
              </h2>
              <p className="text-xs text-slate-400">
                Розрахунок безпечної дози за стандартами МОЗ України
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 border border-cyan-800/80 bg-cyan-950/60 px-2 py-0.5 rounded-full">
            ISO / WHO PROTOCOL
          </span>
        </div>
      </div>

      {/* Patient Weight Slider Card */}
      <div className="bg-[#0B1326] border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Вага пацієнта
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWeightKg(Math.max(20, weightKg - 5))}
              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center text-sm"
            >
              −
            </button>
            <span className="text-2xl font-mono font-bold text-cyan-400 min-w-[70px] text-center">
              {weightKg} <span className="text-xs font-normal text-slate-400">кг</span>
            </span>
            <button
              onClick={() => setWeightKg(Math.min(130, weightKg + 5))}
              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center text-sm"
            >
              +
            </button>
          </div>
        </div>

        {/* Range slider */}
        <input
          type="range"
          min="20"
          max="120"
          step="1"
          value={weightKg}
          onChange={(e) => setWeightKg(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />

        {/* Quick weight presets */}
        <div className="flex justify-between text-xs text-slate-500 font-mono">
          <button onClick={() => setWeightKg(45)} className="hover:text-cyan-400">45 кг (підліток)</button>
          <button onClick={() => setWeightKg(60)} className="hover:text-cyan-400">60 кг</button>
          <button onClick={() => setWeightKg(70)} className="hover:text-cyan-400 font-bold text-slate-400">70 кг (стандарт)</button>
          <button onClick={() => setWeightKg(85)} className="hover:text-cyan-400">85 кг</button>
          <button onClick={() => setWeightKg(100)} className="hover:text-cyan-400">100 кг</button>
        </div>
      </div>

      {/* Anesthetic Drug Selector */}
      <div className="bg-[#0B1326] border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Препарат анестетика (карпула 1.7 мл)
          </span>
          <span className="text-[11px] font-mono text-cyan-400">
            {selectedDrug.substance}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ANESTHETIC_DRUGS.map((drug) => {
            const isSelected = drug.id === selectedDrug.id;
            return (
              <button
                key={drug.id}
                onClick={() => setSelectedDrug(drug)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-md shadow-cyan-500/10'
                    : 'bg-[#101B33] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                    {drug.name}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    {drug.concentrationPercent}%
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{drug.epinephrineRatio}</span>
                  <span className="font-mono text-cyan-400/80">{drug.drugMgPerCarpule} мг / карп</span>
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-slate-400 italic bg-[#070D1B] p-2.5 rounded-xl border border-slate-800/80">
          💡 {selectedDrug.notes}
        </p>
      </div>

      {/* Comorbidities & Risk Factors */}
      <div className="bg-[#0B1326] border border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-md">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
          Клінічні фактори ризику та супутні патології:
        </span>

        {/* Cardiovascular risk toggle */}
        <label
          onClick={() => toggleRisk('cardiovascular')}
          className={`flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
            risks.cardiovascular
              ? 'bg-rose-950/40 border-rose-500/60 shadow-sm'
              : 'bg-[#101B33] border-slate-800 hover:border-slate-700'
          }`}
        >
          <input
            type="checkbox"
            checked={risks.cardiovascular}
            onChange={() => {}}
            className="mt-0.5 accent-rose-500 rounded"
          />
          <div>
            <span className={`text-xs font-bold flex items-center gap-1.5 ${risks.cardiovascular ? 'text-rose-300' : 'text-slate-200'}`}>
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              Серцево-судинні захворювання (ІХС, гіпертонія, аритмії)
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Жорсткий ліміт адреналіну: <strong>0.04 мг max</strong> (не більше 2 карпул 1:100к!)
            </p>
          </div>
        </label>

        {/* Pregnancy toggle */}
        <label
          onClick={() => toggleRisk('pregnancy')}
          className={`flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
            risks.pregnancy
              ? 'bg-amber-950/40 border-amber-500/60'
              : 'bg-[#101B33] border-slate-800 hover:border-slate-700'
          }`}
        >
          <input
            type="checkbox"
            checked={risks.pregnancy}
            onChange={() => {}}
            className="mt-0.5 accent-amber-500 rounded"
          />
          <div>
            <span className={`text-xs font-bold flex items-center gap-1.5 ${risks.pregnancy ? 'text-amber-300' : 'text-slate-200'}`}>
              <Baby className="w-3.5 h-3.5 text-amber-400" />
              Вагітність або період лактації
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Уникати 1:100 000. Препарат вибору: Артикаїн 4% з 1:200 000 (Убістезин).
            </p>
          </div>
        </label>

        {/* Thyrotoxicosis toggle */}
        <label
          onClick={() => toggleRisk('thyrotoxicosis')}
          className={`flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
            risks.thyrotoxicosis
              ? 'bg-rose-950/40 border-rose-500/60'
              : 'bg-[#101B33] border-slate-800 hover:border-slate-700'
          }`}
        >
          <input
            type="checkbox"
            checked={risks.thyrotoxicosis}
            onChange={() => {}}
            className="mt-0.5 accent-rose-500 rounded"
          />
          <div>
            <span className={`text-xs font-bold flex items-center gap-1.5 ${risks.thyrotoxicosis ? 'text-rose-300' : 'text-slate-200'}`}>
              <Activity className="w-3.5 h-3.5 text-rose-400" />
              Тиреотоксикоз (Гіпертиреоз)
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Протипоказаний адреналін! Тільки Мепівакаїн 3% без вазоконстриктора.
            </p>
          </div>
        </label>

        {/* Sulfite allergy */}
        <label
          onClick={() => toggleRisk('sulfiteAllergy')}
          className={`flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
            risks.sulfiteAllergy
              ? 'bg-rose-950/40 border-rose-500/60'
              : 'bg-[#101B33] border-slate-800 hover:border-slate-700'
          }`}
        >
          <input
            type="checkbox"
            checked={risks.sulfiteAllergy}
            onChange={() => {}}
            className="mt-0.5 accent-rose-500 rounded"
          />
          <div>
            <span className={`text-xs font-bold flex items-center gap-1.5 ${risks.sulfiteAllergy ? 'text-rose-300' : 'text-slate-200'}`}>
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              Бронхіальна астма / Алергія на сульфіти
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Сульфіти як стабілізатор є в кожній карпулі з адреналіном. Заборонено адреналінові розчини!
            </p>
          </div>
        </label>
      </div>

      {/* Calculation Results Telemetry HUD */}
      <div className="bg-[#0B1326] border border-cyan-800/40 rounded-2xl p-4 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Розрахункова телеметрія дозування:
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-[#070D1B] border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Макс. доза речовини:</span>
            <div className="text-xl font-mono font-bold text-cyan-400">
              {calculation.toxicDoseMg} <span className="text-xs font-normal text-slate-400">мг</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              ({selectedDrug.maxDoseMgPerKg} мг/кг • вага {weightKg} кг)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#070D1B] border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Максимум карпул:</span>
            <div className="text-xl font-mono font-bold text-teal-300">
              {calculation.finalMaxCarpules}{' '}
              <span className="text-xs font-normal text-slate-400">карпул</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              (об’єм {selectedDrug.carpuleVolumeMl} мл / {selectedDrug.drugMgPerCarpule} мг)
            </span>
          </div>
        </div>

        {/* Critical Adrenaline Warning Card */}
        {risks.cardiovascular && !selectedDrug.isVasoconstrictorFree && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/60 space-y-1">
            <div className="flex items-center gap-2 text-rose-300 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              КАРДІОЛОГІЧНИЙ ЛІМІТ ВАЗОКОНСТРИКТОРА!
            </div>
            <p className="text-xs text-rose-200/90 leading-relaxed">
              Адреналін: ліміт <strong>0.04 мг max</strong> на візит для кардіологічних пацієнтів.
              При виборі {selectedDrug.name} дозволено максимум{' '}
              <strong className="underline">{calculation.maxCarpulesByEpinephrine} карпули!</strong>
            </p>
          </div>
        )}

        {/* Visual Graphic Carpule Counter */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">ВІЗУАЛІЗАЦІЯ КАРПУЛ НА ПРИЙОМ:</span>
            <span className="text-cyan-400 font-bold">
              Безпечно: {Math.min(maxSafeCount, 8)} шт.
            </span>
          </div>

          <div className="grid grid-cols-8 gap-1.5">
            {carpuleSlots.map((num) => {
              const isSafe = num <= calculation.finalMaxCarpules;
              const isOverCardiacLimit = risks.cardiovascular && num > (calculation.maxCarpulesByEpinephrine || 99);
              
              return (
                <div
                  key={num}
                  className={`flex flex-col items-center justify-between p-1.5 rounded-lg border h-16 transition-all ${
                    !isSafe || isOverCardiacLimit
                      ? 'bg-rose-950/30 border-rose-800/60 opacity-40'
                      : 'bg-cyan-950/40 border-cyan-400/80 shadow-sm shadow-cyan-500/20'
                  }`}
                >
                  <Syringe className={`w-3.5 h-3.5 ${isSafe && !isOverCardiacLimit ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span className={`text-[10px] font-mono font-bold ${isSafe && !isOverCardiacLimit ? 'text-cyan-300' : 'text-slate-500'}`}>
                    #{num}
                  </span>
                  <div className={`w-full h-1.5 rounded-full ${isSafe && !isOverCardiacLimit ? 'bg-cyan-400' : 'bg-slate-700'}`}></div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span>
              Безпечний ліміт
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
              Перевищення дози
            </span>
          </div>
        </div>

        {/* Warnings list */}
        {calculation.warnings.length > 0 && (
          <div className="space-y-1.5 pt-2">
            {calculation.warnings.map((warn, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{warn}</span>
              </div>
            ))}
          </div>
        )}

        {/* Clinical Recommendations */}
        <div className="p-3 rounded-xl bg-[#070D1B] border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            Клінічна тактика для студента ОНМедУ:
          </div>
          <ul className="space-y-1 text-xs text-slate-400">
            {calculation.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-teal-400">•</span>
                <span>{rec}</span>
              </li>
            ))}
            <li className="flex items-start gap-1.5">
              <span className="text-cyan-400">•</span>
              <span>
                Для стандартної провідникової анестезії (мандибулярна, торусальна) достатньо <strong>1 карпули (1.7 мл)</strong>. Не перевищуйте дозу без клінічної потреби!
              </span>
            </li>
            <li className="flex items-start gap-1.5 text-amber-300 font-semibold">
              <span className="text-amber-400">•</span>
              <span>
                Обов’язкова аспіраційна проба у 2-х площинах перед введенням кожної карпули!
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

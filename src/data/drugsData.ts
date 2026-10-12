export interface AnestheticDrug {
  id: string;
  name: string;
  tradeNames: string;
  substance: string;
  concentrationPercent: number; // e.g. 4 for 4%
  epinephrineRatio: string; // "1:100 000", "1:200 000", "без адреналіну"
  epinephrineMgPerCarpule: number; // mg
  drugMgPerCarpule: number; // mg of active anesthetic per 1.7 ml carpule
  maxDoseMgPerKg: number; // mg/kg
  absoluteMaxDoseMg: number; // ceiling mg
  carpuleVolumeMl: number; // 1.7 ml standard
  isVasoconstrictorFree: boolean;
  notes: string;
}

export const ANESTHETIC_DRUGS: AnestheticDrug[] = [
  {
    id: 'ubistesin_200',
    name: 'Убістезин 1:200 000',
    tradeNames: 'Ubistesin, Артикаїн 4% + Епінефрин 1:200 000',
    substance: 'Артикаїн гідрохлорид',
    concentrationPercent: 4,
    epinephrineRatio: '1:200 000',
    epinephrineMgPerCarpule: 0.0085,
    drugMgPerCarpule: 68,
    maxDoseMgPerKg: 7.0,
    absoluteMaxDoseMg: 500,
    carpuleVolumeMl: 1.7,
    isVasoconstrictorFree: false,
    notes: 'Препарат першого вибору в повсякденній практиці, при вагітності та у пацієнтів літнього віку.'
  },
  {
    id: 'ubistesin_forte_100',
    name: 'Убістезин Форте 1:100 000',
    tradeNames: 'Ubistesin Forte, Артикаїн 4% + Епінефрин 1:100 000',
    substance: 'Артикаїн гідрохлорид',
    concentrationPercent: 4,
    epinephrineRatio: '1:100 000',
    epinephrineMgPerCarpule: 0.017,
    drugMgPerCarpule: 68,
    maxDoseMgPerKg: 7.0,
    absoluteMaxDoseMg: 500,
    carpuleVolumeMl: 1.7,
    isVasoconstrictorFree: false,
    notes: 'Для тривалих та травматичних втручань (депульпування, атипове видалення, операції на кістці).'
  },
  {
    id: 'septanest_100',
    name: 'Септанест 1:100 000',
    tradeNames: 'Septanest з адреналіном 1:100 000',
    substance: 'Артикаїн гідрохлорид',
    concentrationPercent: 4,
    epinephrineRatio: '1:100 000',
    epinephrineMgPerCarpule: 0.017,
    drugMgPerCarpule: 68,
    maxDoseMgPerKg: 7.0,
    absoluteMaxDoseMg: 500,
    carpuleVolumeMl: 1.7,
    isVasoconstrictorFree: false,
    notes: 'Висока знеболювальна дія та потужний гемостаз у зоні втручання.'
  },
  {
    id: 'mepivacaine_3',
    name: 'Скандонест 3% (Мепівакаїн)',
    tradeNames: 'Scandonest, Mepivastesin 3% (без вазоконстриктора)',
    substance: 'Мепівакаїн гідрохлорид',
    concentrationPercent: 3,
    epinephrineRatio: 'Без адреналіну',
    epinephrineMgPerCarpule: 0,
    drugMgPerCarpule: 51,
    maxDoseMgPerKg: 4.4,
    absoluteMaxDoseMg: 300,
    carpuleVolumeMl: 1.7,
    isVasoconstrictorFree: true,
    notes: 'Ідеальний вибір для пацієнтів з тяжкою серцевою патологією, тиреотоксикозом та алергією на сульфіти.'
  },
  {
    id: 'lidocaine_2',
    name: 'Лідокаїн 2% з адреналіном',
    tradeNames: 'Lidocaine 2% + Epinephrine 1:100 000',
    substance: 'Лідокаїн гідрохлорид',
    concentrationPercent: 2,
    epinephrineRatio: '1:100 000',
    epinephrineMgPerCarpule: 0.017,
    drugMgPerCarpule: 34,
    maxDoseMgPerKg: 4.4,
    absoluteMaxDoseMg: 300,
    carpuleVolumeMl: 1.7,
    isVasoconstrictorFree: false,
    notes: 'Класичний амідний анестетик із середньою тривалістю дії.'
  }
];

export interface PatientRiskProfile {
  cardiovascular: boolean; // ІХС, гіпертонія, аритмії
  pregnancy: boolean; // Вагітність / лактація
  thyrotoxicosis: boolean; // Гіпертиреоз
  sulfiteAllergy: boolean; // Алергія на сульфіти / астма
}

export function calculateCarpuleLimits(
  weightKg: number,
  drug: AnestheticDrug,
  risks: PatientRiskProfile
) {
  // 1. Max active anesthetic dose (mg)
  const toxicDoseMg = Math.min(weightKg * drug.maxDoseMgPerKg, drug.absoluteMaxDoseMg);
  
  // 2. Max carpules based on anesthetic toxicity
  const maxCarpulesByAnesthetic = Math.floor((toxicDoseMg / drug.drugMgPerCarpule) * 10) / 10;

  // 3. Epinephrine limit calculation
  const isCardiacRisk = risks.cardiovascular;
  const maxEpiMg = isCardiacRisk ? 0.04 : 0.2; // 0.04 mg for cardiac vs 0.2 mg for healthy
  
  let maxCarpulesByEpinephrine = 999;
  if (!drug.isVasoconstrictorFree && drug.epinephrineMgPerCarpule > 0) {
    maxCarpulesByEpinephrine = Math.floor((maxEpiMg / drug.epinephrineMgPerCarpule) * 10) / 10;
  }

  // Final safe limit is the minimum of toxicity vs epinephrine limit
  const finalMaxCarpules = Math.min(maxCarpulesByAnesthetic, maxCarpulesByEpinephrine);
  const limitingFactor = maxCarpulesByEpinephrine < maxCarpulesByAnesthetic ? 'epinephrine' : 'anesthetic';

  // Warnings generation
  const warnings: string[] = [];
  const recommendations: string[] = [];

  if (risks.thyrotoxicosis && !drug.isVasoconstrictorFree) {
    warnings.push('⚠️ КРИТИЧНО: При тиреотоксикозі протипоказані препарати з адреналіном! Ризик тиреотоксичного кризу. Рекомендовано Мепівакаїн 3%.');
  }

  if (risks.sulfiteAllergy && !drug.isVasoconstrictorFree) {
    warnings.push('⚠️ КРИТИЧНО: Розчини з адреналіном містять консервант натрію дисульфіт! Ризик бронхоспазму та анафілаксії. Використовуйте Мепівакаїн без сульфітів.');
  }

  if (risks.cardiovascular) {
    if (drug.epinephrineRatio === '1:100 000') {
      warnings.push('⚠️ УВАГА: Концентрація адреналіну 1:100 000 не рекомендована для пацієнтів з серцево-судинною патологією. Максимальний ліміт — 2 карпули!');
      recommendations.push('Краще обрати Убістезин 1:200 000 або Мепівакаїн 3%.');
    } else if (drug.epinephrineRatio === '1:200 000') {
      recommendations.push('✓ Убістезин 1:200 000 допустимий для кардіологічних хворих (до 4 карпул за візитом).');
    }
  }

  if (risks.pregnancy) {
    if (drug.epinephrineRatio === '1:100 000') {
      warnings.push('При вагітності уникайте високих доз адреналіну (ризик спазму матково-плацентарних судин).');
      recommendations.push('Препарат вибору: Артикаїн 4% з епінефрином 1:200 000 (1-2 карпули цілком достатньо).');
    } else {
      recommendations.push('✓ Артикаїн 1:200 000 — золотий стандарт при вагітності (період напіввиведення 25 хв, мінімальний плацентарний трансфер).');
    }
  }

  return {
    toxicDoseMg: Math.round(toxicDoseMg),
    maxCarpulesByAnesthetic,
    maxCarpulesByEpinephrine: maxCarpulesByEpinephrine === 999 ? null : maxCarpulesByEpinephrine,
    finalMaxCarpules: Math.max(0.5, finalMaxCarpules),
    limitingFactor,
    maxEpiMg,
    warnings,
    recommendations
  };
}

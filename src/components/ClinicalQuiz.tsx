import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Award, 
  AlertTriangle, 
  HeartPulse, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizQuestion {
  id: number;
  question: string;
  context: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const ONMEDU_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Яку анестезію обрати та який додатковий нерв необхідно вимкнути для видалення 4.7 зуба?',
    context: 'Пацієнту 22 роки необхідно провести видалення нижнього другого великого кутнього зуба (4.7).',
    options: [
      'Мандибулярна анестезія + додаткова блокада n. buccalis у перехідній складці біля 4.7',
      'Лише мандибулярна анестезія, додаткові вколи не потрібні',
      'Торусальна анестезія з обов’язковою блокадою n. lingualis',
      'Інфільтраційна анестезія по перехідній складці'
    ],
    correctIndex: 0,
    explanation: 'При класичній мандибулярній анестезії блокуються n. alveolaris inferior та n. lingualis. Слизова ясен з вестибулярного боку в ділянці молярів іннервується n. buccalis, тому для безболісного накладання щипців потрібна додаткова інфільтрація слизової для щічного нерва.'
  },
  {
    id: 2,
    question: 'Після анестезії у пацієнта опустився кут рота і не стуляється повіка. Яка помилка лікаря?',
    context: 'Студент провів мандибулярну анестезію справа. Через 7 хвилин пацієнт скаржиться на перекіс обличчя та неможливість заплющити праве око.',
    options: [
      'Алергічна реакція на артикаїн',
      'Голка введена занадто глибоко (>25 мм) дистальніше гілки щелепи в привушну залозу з блокадою n. facialis',
      'Пошкодження нижньощелепного нерва в овальному отворі',
      'Укол у внутрішній крилоподібний м’яз'
    ],
    correctIndex: 1,
    explanation: 'Це класичний тимчасовий парез мімічної мускулатури (n. facialis). Якщо лікар просунув голку занадто глибоко назад і не отримав кісткового упору, анестетик депонується в glandula parotidea, де проходить стовбур і гілки лицьового нерва.'
  },
  {
    id: 3,
    question: 'Який анестетик обрати для пацієнта з гіпертонією та ІХС?',
    context: 'Пацієнт 64 роки, в анамнезі ІХС та артеріальна гіпертензія ІІ ст. Необхідне знеболення.',
    options: [
      'Артикаїн 4% з адреналіном 1:100 000 (Убістезин Форте)',
      'Артикаїн 4% з адреналіном 1:200 000 (до 2-4 карпул) або Мепівакаїн 3% без вазоконстриктора',
      'Новокаїн 0.5% у великій дозі',
      'Будь-який анестетик, якщо додати спазмолітик'
    ],
    correctIndex: 1,
    explanation: 'Для кардіологічних пацієнтів максимальна доза адреналіну становить 0.04 мг (це максимум 2 карпули 1:100 000 або 4 карпули 1:200 000). Препаратом вибору є Артикаїн 1:200 000 або Мепівакаїн 3% без адреналіну.'
  },
  {
    id: 4,
    question: 'Що робити, якщо на глибині 20 мм при мандибулярній анестезії немає кісткового упору?',
    context: 'Голка занурена на 20 мм, але відчуття упору в кістку (sulcus colli mandibulae) відсутнє.',
    options: [
      'Випустити весь анестетик і чекати',
      'Підтягнути голку назад на 15 мм, перевести шприц ще більше до протилежного кута рота (або різців) і знову шукати кістку',
      'Просунути голку ще глибше на 30 мм',
      'Зігнути голку під кутом 90 градусів'
    ],
    correctIndex: 1,
    explanation: 'Категорично заборонено депонувати розчин без кісткового контакту! Якщо кістки немає, голка йде повз задній край гілки в біляглотковий простір чи привушну залозу. Слід вивести голку майже повністю та скорегувати кут шприца.'
  },
  {
    id: 5,
    question: 'У чому головна перевага торусальної анестезії за Вейсбремом?',
    context: 'Кафедра хірургічної стоматології порівнює методики знеболення нижньої щелепи.',
    options: [
      'Вона не вимагає відкривання рота',
      'Одночасна блокада трьох нервів (n. alveolaris inf., n. lingualis, n. buccalis) без додаткового вколу в щоку',
      'Вона повністю безболісна для пацієнта',
      'Використовується голка менше 5 мм'
    ],
    correctIndex: 1,
    explanation: 'Депонування анестетика біля torus mandibulae вимикає одразу n. alveolaris inferior, n. lingualis та n. buccalis. Це позбавляє необхідності робити окремий вкол у слизову щоки при втручаннях на молярах.'
  }
];

export const ClinicalQuiz: React.FC = () => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const currentQ = ONMEDU_QUESTIONS[currentQuestionIdx];

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(index);
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null) return;
    setIsAnswerSubmitted(true);
    if (selectedAnswer === currentQ.correctIndex) {
      setCorrectAnswersCount(prev => prev + 1);
      confetti({ particleCount: 40, spread: 50 });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < ONMEDU_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
      confetti({ particleCount: 100, spread: 80 });
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setCorrectAnswersCount(0);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="bg-[#0B1326] border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Клінічні ситуаційні задачі ОНМедУ
              </h2>
              <p className="text-xs text-slate-400">
                Перевір готовність до здачі на кафедрі хірургічної стоматології
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800">
            {currentQuestionIdx + 1} / {ONMEDU_QUESTIONS.length}
          </span>
        </div>
      </div>

      {!quizFinished ? (
        <div className="bg-[#0B1326] border border-cyan-900/30 rounded-2xl p-4 space-y-4 shadow-xl">
          {/* Situation Context */}
          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200">
            <span className="font-bold text-cyan-300 block mb-1">📋 Клінічна ситуація:</span>
            {currentQ.context}
          </div>

          {/* Question Text */}
          <h3 className="text-sm font-bold text-slate-100 leading-snug">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-2">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnStyle = 'bg-[#101B33] border-slate-800 text-slate-200 hover:border-slate-700';

              if (isAnswerSubmitted) {
                if (isCorrect) {
                  btnStyle = 'bg-teal-950/50 border-teal-500 text-teal-200 font-bold';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-950/50 border-rose-500 text-rose-200 font-bold';
                } else {
                  btnStyle = 'bg-[#0E172E] border-slate-800/60 text-slate-500 opacity-60';
                }
              } else if (isSelected) {
                btnStyle = 'bg-cyan-950/40 border-cyan-400 text-cyan-200 font-bold shadow-md shadow-cyan-500/10';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 ${btnStyle}`}
                >
                  <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation after submit */}
          {isAnswerSubmitted && (
            <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${
              selectedAnswer === currentQ.correctIndex
                ? 'bg-teal-950/40 border-teal-500/50 text-teal-200'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
            }`}>
              <div className="flex items-center gap-2 font-bold">
                {selectedAnswer === currentQ.correctIndex ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>Правильно! Чудова відповідь!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>Помилка! Запам’ятай правильне обґрунтування:</span>
                  </>
                )}
              </div>
              <p className="leading-relaxed text-slate-200">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Action button */}
          <div className="pt-2">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleConfirmAnswer}
                disabled={selectedAnswer === null}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20"
              >
                Підтвердити відповідь
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:opacity-95 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20"
              >
                {currentQuestionIdx < ONMEDU_QUESTIONS.length - 1 ? 'Наступне питання →' : 'Подивитися результат 🏆'}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Finished Summary */
        <div className="bg-[#0B1326] border border-cyan-800/40 rounded-2xl p-6 text-center space-y-4 shadow-xl">
          <Award className="w-12 h-12 text-cyan-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-100">
            Тестування завершено!
          </h3>
          <div className="text-3xl font-mono font-bold text-cyan-400">
            {correctAnswersCount} / {ONMEDU_QUESTIONS.length}
          </div>
          <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
            {correctAnswersCount === 5 && '🌟 Феноменальний результат! Кафедра хірургічної стоматології ОНМедУ ставить тобі тверду «5»!'}
            {correctAnswersCount === 4 && '👍 Дуже добрий рівень знань. Ти готова до практичного заліку.'}
            {correctAnswersCount < 4 && '📖 Варто ще раз переглянути топографію в Атласі та потренуватися у 2D тренажері.'}
          </p>

          <button
            onClick={handleRestartQuiz}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20"
          >
            <RotateCcw className="w-4 h-4" />
            Пройти ще раз
          </button>
        </div>
      )}

      {/* Emergency Protocol Cheat Sheet */}
      <div className="bg-[#0B1326] border border-rose-900/30 rounded-2xl p-4 space-y-3 shadow-md">
        <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
          <HeartPulse className="w-4 h-4 text-rose-500" />
          Шпора: Невідкладні стани при анестезії (Клінічний протокол)
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <strong className="text-cyan-300 block mb-0.5">1. Запаморочення / Зомління (Вазовагальний колапс):</strong>
            <p className="text-slate-300">
              Опустити головний кінець крісла (положення Тренделенбурга, ноги вище голови), забезпечити доступ свіжого повітря, розстебнути комірець, дати нашатирний спирт на ватці на відстані 5 см.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <strong className="text-amber-300 block mb-0.5">2. Токсична реакція на адреналін (тахікардія, тремор, страх):</strong>
            <p className="text-slate-300">
              Припинити введення анестетика! Заспокоїти пацієнта, глибоке дихання. При гіпертензивному кризі — каптопрес під язик, контроль пульсу та АТ.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <strong className="text-rose-400 block mb-0.5">3. Анафілактичний шок:</strong>
            <p className="text-slate-300">
              Негайно викликати реанімаційну бригаду! Ввести 0.1% розчин адреналіну 0.5 мл в/м у середню третину стегна, гормони (дексаметазон 8-16 мг або преднізолон 90 мг), інгаляція кисню.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

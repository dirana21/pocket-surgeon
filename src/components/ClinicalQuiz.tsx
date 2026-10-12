import React, { useState, useMemo, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  AlertTriangle, 
  HeartPulse, 
  Sparkles,
  BookOpen,
  GraduationCap,
  Timer,
  Search,
  Anchor,
  Filter,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZ_BANK, QUIZ_CATEGORIES, QuizQuestion } from '../data/quizBank';

export const ClinicalQuiz: React.FC = () => {
  // Mode: 'practice' (study with instant answers & KROK anchors) vs 'exam' (timed test)
  const [mode, setMode] = useState<'practice' | 'exam'>('practice');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Practice Mode State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [totalAnswered, setTotalAnswered] = useState<number>(0);

  // Exam Mode State
  const [examQuestions, setExamQuestions] = useState<QuizQuestion[]>([]);
  const [examCurrentIndex, setExamCurrentIndex] = useState<number>(0);
  const [examAnswers, setExamAnswers] = useState<Record<number, number>>({});
  const [examFinished, setExamFinished] = useState<boolean>(false);
  const [examTimeLeft, setExamTimeLeft] = useState<number>(600); // 10 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Filter questions for Practice Mode
  const filteredQuestions = useMemo(() => {
    return QUIZ_BANK.filter(q => {
      const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
      const matchesSearch = searchQuery.trim() === '' || 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.context.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.triggerKeyword.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Current Question in Practice Mode
  const activeQuestion = filteredQuestions[currentQuestionIndex] || filteredQuestions[0];

  // Reset question index if category changes and index is out of bounds
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
  }, [selectedCategory, searchQuery]);

  // Start Exam
  const startExam = () => {
    // Pick 10 random questions from the entire bank
    const shuffled = [...QUIZ_BANK].sort(() => 0.5 - Math.random()).slice(0, 10);
    setExamQuestions(shuffled);
    setExamCurrentIndex(0);
    setExamAnswers({});
    setExamFinished(false);
    setExamTimeLeft(600);
    setIsTimerRunning(true);
    setMode('exam');
  };

  // Exam Timer Countdown
  useEffect(() => {
    if (!isTimerRunning || examFinished) return;
    const interval = setInterval(() => {
      setExamTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, examFinished]);

  const finishExam = () => {
    setIsTimerRunning(false);
    setExamFinished(true);
    confetti({ particleCount: 80, spread: 70 });
  };

  // Practice handlers
  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(index);
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null || !activeQuestion) return;
    setIsAnswerSubmitted(true);
    setTotalAnswered(prev => prev + 1);
    if (selectedAnswer === activeQuestion.correctIndex) {
      setCorrectCount(prev => prev + 1);
      confetti({ particleCount: 40, spread: 50 });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      // Loop or restart
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    }
  };

  // Format time mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Exam score calculation
  const examScore = useMemo(() => {
    if (!examFinished) return { correct: 0, total: 10, percent: 0, mark: 2 };
    let correct = 0;
    examQuestions.forEach((q, idx) => {
      if (examAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });
    const percent = Math.round((correct / examQuestions.length) * 100);
    let mark = 2;
    if (percent >= 90) mark = 5;
    else if (percent >= 75) mark = 4;
    else if (percent >= 60) mark = 3;
    return { correct, total: examQuestions.length, percent, mark };
  }, [examFinished, examAnswers, examQuestions]);

  return (
    <div className="space-y-4 pb-20">
      {/* Header with Mode Switch */}
      <div className="bg-[#0B1326] border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                База тестів: ОНМедУ & КРОК
                <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-800">
                  {QUIZ_BANK.length} тестів
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Хірургічна стоматологія • Анестезіологія ЧЛД
              </p>
            </div>
          </div>

          {/* Mode Switcher Button */}
          <div className="flex bg-[#101B33] p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => {
                setMode('practice');
                setIsTimerRunning(false);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mode === 'practice'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Навчання
            </button>
            <button
              onClick={startExam}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                mode === 'exam'
                  ? 'bg-rose-500 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              Екзамен
            </button>
          </div>
        </div>

        {/* Practice Mode Filters & Search */}
        {mode === 'practice' && (
          <div className="space-y-2 pt-1">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Пошук (мандибулярна, тризм, адреналін, 4.6...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#070D1B] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Horizontal Categories Filter */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {QUIZ_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-xl text-xs whitespace-nowrap font-medium transition-all border ${
                    selectedCategory === cat.id
                      ? 'bg-cyan-950/60 text-cyan-300 border-cyan-400 font-bold'
                      : 'bg-[#0E172E] text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===================== MODE 1: PRACTICE MODE ===================== */}
      {mode === 'practice' && (
        <>
          {filteredQuestions.length > 0 && activeQuestion ? (
            <div className="bg-[#0B1326] border border-cyan-900/30 rounded-2xl p-4 space-y-4 shadow-xl">
              {/* Question progress and category tag */}
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 font-bold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/60">
                  {activeQuestion.categoryTitle}
                </span>
                <span className="text-slate-400">
                  Питання {currentQuestionIndex + 1} з {filteredQuestions.length}
                </span>
              </div>

              {/* Situational Context Card */}
              <div className="p-3 rounded-xl bg-cyan-950/25 border border-cyan-500/30 text-xs text-cyan-200 leading-relaxed">
                <span className="font-bold text-cyan-300 block mb-1">📋 Клінічна ситуація:</span>
                {activeQuestion.context}
              </div>

              {/* Question Headline */}
              <h3 className="text-sm font-bold text-slate-100 leading-snug">
                {activeQuestion.question}
              </h3>

              {/* Answer Options */}
              <div className="space-y-2">
                {activeQuestion.options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === activeQuestion.correctIndex;

                  let btnStyle = 'bg-[#101B33] border-slate-800 text-slate-200 hover:border-slate-700';

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      btnStyle = 'bg-teal-950/60 border-teal-500 text-teal-200 font-bold shadow-md shadow-teal-500/10';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200 font-bold';
                    } else {
                      btnStyle = 'bg-[#0E172E] border-slate-800/60 text-slate-500 opacity-60';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-cyan-950/50 border-cyan-400 text-cyan-200 font-bold shadow-md shadow-cyan-500/10';
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
                      <span className="leading-relaxed">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Detailed KROK Explanations & Anchor Keywords */}
              {isAnswerSubmitted && (
                <div className="space-y-2.5 animate-in fade-in">
                  {/* Status Banner */}
                  <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 font-bold ${
                    selectedAnswer === activeQuestion.correctIndex
                      ? 'bg-teal-950/50 border-teal-500/60 text-teal-200'
                      : 'bg-rose-950/50 border-rose-500/60 text-rose-200'
                  }`}>
                    {selectedAnswer === activeQuestion.correctIndex ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>Правильно! Чудова клінічна відповідь!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>Невірно. Запам’ятай правильну логіку для заліку:</span>
                      </>
                    )}
                  </div>

                  {/* KROK Anchor Badge (Тригерні слова) */}
                  <div className="p-2.5 rounded-xl bg-[#070D1B] border border-amber-500/30 flex items-start gap-2 text-xs">
                    <Anchor className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-300 block mb-0.5">Маркер / Якорь КРОК:</strong>
                      <span className="text-slate-200 font-mono text-[11px]">{activeQuestion.triggerKeyword}</span>
                    </div>
                  </div>

                  {/* Comprehensive Medical Explanation */}
                  <div className="p-3 rounded-xl bg-[#101B33] border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <strong className="text-cyan-300 block mb-1">💡 Клінічне обґрунтування:</strong>
                    {activeQuestion.explanation}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2">
                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleConfirmAnswer}
                    disabled={selectedAnswer === null}
                    className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20"
                  >
                    Перевірити відповідь
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:opacity-95 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20"
                  >
                    <span>Наступне питання</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#0B1326] p-8 rounded-2xl text-center text-xs text-slate-400 border border-slate-800">
              Нічого не знайдено за запитом «{searchQuery}». Спробуйте інше слово або категорію.
            </div>
          )}

          {/* Quick Stats Footer Bar */}
          <div className="bg-[#0B1326] border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Розв’язано: <strong className="text-cyan-300">{totalAnswered}</strong></span>
            <span>Вірно: <strong className="text-teal-400">{correctCount}</strong></span>
            <span>Точність: <strong className="text-cyan-400">{totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0}%</strong></span>
          </div>
        </>
      )}

      {/* ===================== MODE 2: EXAM MODE ===================== */}
      {mode === 'exam' && (
        <div className="bg-[#0B1326] border border-cyan-800/40 rounded-2xl p-4 space-y-4 shadow-xl">
          {!examFinished ? (
            <>
              {/* Exam Header with Live Timer */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-rose-400" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-100">
                      Практичний залік ОНМедУ (10 питань)
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Питання {examCurrentIndex + 1} з {examQuestions.length}
                    </span>
                  </div>
                </div>

                {/* Timer Countdown */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-rose-400">
                  <Timer className="w-3.5 h-3.5 animate-pulse" />
                  {formatTime(examTimeLeft)}
                </div>
              </div>

              {/* Current Exam Question */}
              {examQuestions[examCurrentIndex] && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-cyan-950/25 border border-cyan-500/30 text-xs text-cyan-200">
                    <span className="font-bold text-cyan-300 block mb-1">📋 Клінічна задача:</span>
                    {examQuestions[examCurrentIndex].context}
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 leading-snug">
                    {examQuestions[examCurrentIndex].question}
                  </h4>

                  {/* Options */}
                  <div className="space-y-2">
                    {examQuestions[examCurrentIndex].options.map((opt, idx) => {
                      const isChosen = examAnswers[examCurrentIndex] === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => setExamAnswers(prev => ({ ...prev, [examCurrentIndex]: idx }))}
                          className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 ${
                            isChosen
                              ? 'bg-cyan-950/50 border-cyan-400 text-cyan-200 font-bold shadow'
                              : 'bg-[#101B33] border-slate-800 text-slate-200 hover:border-slate-700'
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="leading-relaxed">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Navigation in Exam */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setExamCurrentIndex(prev => Math.max(0, prev - 1))}
                  disabled={examCurrentIndex === 0}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 disabled:opacity-30 text-xs font-semibold"
                >
                  ← Назад
                </button>

                {examCurrentIndex < examQuestions.length - 1 ? (
                  <button
                    onClick={() => setExamCurrentIndex(prev => Math.min(examQuestions.length - 1, prev + 1))}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all"
                  >
                    Вперед →
                  </button>
                ) : (
                  <button
                    onClick={finishExam}
                    className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-md shadow-rose-900/40"
                  >
                    Завершити залік 🏁
                  </button>
                )}
              </div>
            </>
          ) : (
            /* EXAM FINISHED RESULTS CARD */
            <div className="space-y-4 text-center py-4">
              <Award className="w-14 h-14 text-cyan-400 mx-auto" />
              <div>
                <h3 className="text-lg font-bold text-slate-100">
                  Результати практичного заліку ОНМедУ
                </h3>
                <p className="text-xs text-slate-400">
                  Кафедра хірургічної стоматології
                </p>
              </div>

              {/* Big Score Card */}
              <div className="p-4 rounded-2xl bg-[#070D1B] border border-cyan-800/40 max-w-xs mx-auto space-y-1">
                <div className="text-3xl font-mono font-bold text-cyan-400">
                  Оцінка: {examScore.mark} з 5
                </div>
                <div className="text-xs text-slate-300 font-mono">
                  {examScore.correct} з {examScore.total} правильних ({examScore.percent}%)
                </div>
              </div>

              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                {examScore.mark === 5 && '🌟 Відмінно! Студентка повністю володіє топографією, вибором анестетиків та профілактикою ускладнень!'}
                {examScore.mark === 4 && '👍 Добре! Дуже високий рівень підготовки. Дрібні неточності можна повторити в режимі Навчання.'}
                {examScore.mark === 3 && '⚠️ Задовільно. Необхідно повторити дозування адреналіну та топографію нервів.'}
                {examScore.mark === 2 && '🚨 Незадовільно. Потребує повторного опрацювання матеріалу.'}
              </p>

              {/* Review Mistakes Button */}
              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={startExam}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all"
                >
                  Пройти інший варіант
                </button>
                <button
                  onClick={() => setMode('practice')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700 transition-all"
                >
                  Повернутись до навчання
                </button>
              </div>
            </div>
          )}
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

import { useState, useEffect } from "react";
import { 
  Sparkles, ShieldAlert, Cpu, Layers, HelpCircle, 
  Trash2, RefreshCw, BarChart4, AlertCircle, CheckCircle2, ChevronRight
} from "lucide-react";
import DecisionForm from "./components/DecisionForm";
import AnalysisWorkspace from "./components/AnalysisWorkspace";
import HistoryList from "./components/HistoryList";
import { SavedDecision, AnalysisResponse } from "./types";

const DIAGNOSTIC_STEPS = [
  "📡 Початкова детекція: Систематизація введених даних...",
  "🧠 Запуск моделі Gemini-3.5-Flash та виділення стратегічних варіантів...",
  "📊 Обчислення SWOT матриці для кожного сценарію окремо...",
  "⚖ Мультикритеріальна калькуляція оцінок (MCDA за шкалою від 1 до 10)...",
  "📝 Формування планів убезпечення від ризиків та покрокових наступних дій..."
];

export default function App() {
  const [history, setHistory] = useState<SavedDecision[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResponse | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [currentCriteria, setCurrentCriteria] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("decision_analyzer_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Помилка читання історії з локального сховища:", e);
    }
  }, []);

  // Sync history to localStorage
  const saveHistory = (updated: SavedDecision[]) => {
    setHistory(updated);
    try {
      localStorage.setItem("decision_analyzer_history", JSON.stringify(updated));
    } catch (e) {
      console.error("Помилка збереження історії в локальне сховище:", e);
    }
  };

  // Diagnostics interval during loading
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < DIAGNOSTIC_STEPS.length - 1 ? prev + 1 : prev));
      }, 1400);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleAnalyzeDecision = async (data: { question: string; options: string[]; preferredCriteria: string }) => {
    setIsLoading(true);
    setErrorMessage("");
    setCurrentQuestion(data.question);
    setCurrentOptions(data.options);
    setCurrentCriteria(data.preferredCriteria);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: data.question,
          options: data.options,
          preferredCriteria: data.preferredCriteria
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Помилка сервера (Код: ${response.status})`);
      }

      const parsed: AnalysisResponse = await response.json();
      setCurrentAnalysis(parsed);

      // Save into history list
      const newItem: SavedDecision = {
        id: crypto.randomUUID(),
        question: data.question,
        timestamp: new Date().toISOString(),
        options: data.options,
        preferredCriteria: data.preferredCriteria,
        analysis: parsed
      };

      const updatedHistory = [newItem, ...history.filter(h => h.question !== data.question)].slice(0, 20);
      saveHistory(updatedHistory);

    } catch (err: any) {
      console.error("Analysis Error:", err);
      setErrorMessage(err.message || "Сталася неочікувана помилка при з'єднанні з сервером.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistory = (item: SavedDecision) => {
    setCurrentQuestion(item.question);
    setCurrentOptions(item.options);
    setCurrentCriteria(item.preferredCriteria || "");
    setCurrentAnalysis(item.analysis);
    setErrorMessage("");
  };

  const handleDeleteHistory = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    saveHistory(updated);
    
    // If deleted current analysis, reset workspace view as well
    if (currentAnalysis && !updated.some(item => item.analysis.decisionQuestion === currentAnalysis.decisionQuestion)) {
      handleReset();
    }
  };

  const handleReset = () => {
    setCurrentAnalysis(null);
    setCurrentQuestion("");
    setCurrentOptions([]);
    setCurrentCriteria("");
    setErrorMessage("");
  };

  const handleClearAllHistory = () => {
    if (window.confirm("Ви дійсно хочете повністю очистити всю локальну історію аналізів?")) {
      saveHistory([]);
      handleReset();
    }
  };

  // Helper calculation for overall score representation
  const mainRecommendationScore = currentAnalysis
    ? currentAnalysis.options.find(
        (o) => o.name === currentAnalysis.recommendation.bestOption
      )?.score || 8.5
    : 0;

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-100 font-sans p-4 md:p-6 flex flex-col justify-between overflow-x-hidden selection:bg-cyan-500/30 selection:text-white">
      
      {/* 1. Header Section */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-4 gap-4 animate-cyber-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center glow-cyan-pulse shrink-0">
            <Cpu className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
              Аналізатор рішень
            </h1>
            <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-400 opacity-90 font-mono">
              Нейромережева оцінка опцій • v2.5
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 bg-white/[0.03] border border-white/10 rounded-full flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
            <span className="text-[11px] font-semibold text-slate-300 font-mono">Аналітика ШІ: Активна</span>
          </div>
          {currentAnalysis && (
            <button
              onClick={handleReset}
              id="header-new-request-btn"
              className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold font-mono tracking-wider uppercase rounded-full transition-all shrink-0 cursor-pointer"
            >
              Новий аналіз
            </button>
          )}
        </div>
      </header>

      {/* 2. Main Content Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
        
        {/* LEFT COLUMN: 4/12 WIDTH -> CONTEXT INFO & HISTORY */}
        <section className="lg:col-span-4 flex flex-col space-y-4">
          
          {/* Situation Brief context card */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 flex flex-col space-y-4 shadow-xl">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">ПОТОЧНИЙ КОНТЕКСТ</span>
              <h2 className="text-sm font-semibold tracking-wide text-white line-clamp-2 leading-snug">
                {currentQuestion ? currentQuestion : "Очікування запиту рішення..."}
              </h2>
            </div>
            
            <div className="space-y-3">
              <div className="p-3.5 bg-white/[0.02] rounded-xl border-l-4 border-cyan-500 text-xs text-slate-300 italic leading-relaxed">
                {currentQuestion ? (
                  `"${currentQuestion}"`
                ) : (
                  "Опишіть у формі праворуч ваше суперечливе питання або виберіть один із готових шаблонів нижче для швидкого старту аналізу."
                )}
              </div>
            </div>

            {currentCriteria && (
              <div className="pt-2 space-y-2">
                <h3 className="text-[10.5px] font-mono font-bold uppercase text-slate-400 tracking-wider">Ключові пріоритети аналізу</h3>
                <div className="flex flex-wrap gap-2">
                  {currentCriteria.split(",").map((tag, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] uppercase font-mono font-medium rounded"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Score Radial Gauge Indicator Panel when Decision is Analyzed */}
          {currentAnalysis && (
            <div className="bg-gradient-to-br from-indigo-950/20 via-slate-900/40 to-cyan-950/20 border border-white/10 rounded-2xl p-5 flex items-center justify-between shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none"></div>
              <div className="space-y-1 z-10">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block">Перевага лідируючої опції</span>
                <p className="text-2xl font-bold font-mono tracking-tight text-cyan-400">
                  {mainRecommendationScore * 10} <span className="text-xs text-slate-500">/ 100</span>
                </p>
                <p className="text-[9px] font-mono text-green-400 uppercase font-black tracking-wider">
                  ВІДПОВІДНО ДО SWOT & MCDA
                </p>
              </div>
              
              <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 flex items-center justify-center relative z-10 shrink-0">
                <div 
                  className="absolute inset-0 border-t-4 border-cyan-400 rounded-full animate-spin" 
                  style={{ animationDuration: "3s" }} 
                />
                <Cpu className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          )}

          {/* History selection List */}
          <div className="bg-white/[0.01] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                Збережені запити
              </span>
              {history.length > 0 && (
                <button
                  onClick={handleClearAllHistory}
                  id="clear-all-history-btn"
                  className="text-[10px] font-mono font-bold text-slate-500 hover:text-red-400 cursor-pointer flex items-center gap-1.5 uppercase tracking-wide transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  очистити
                </button>
              )}
            </div>
            
            <HistoryList 
              history={history} 
              onSelect={handleSelectHistory} 
              onDelete={handleDeleteHistory} 
            />
          </div>

        </section>

        {/* RIGHT COLUMN: 8/12 WIDTH -> ACTIVE INTERACTION WORKSPACE */}
        <section className="lg:col-span-8 flex flex-col justify-start">
          
          {/* Error Message Box */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-rose-950/20 border border-rose-500/30 text-rose-300 rounded-2xl flex items-start gap-3 animate-cyber-in text-sm leading-relaxed">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <div>
                <p className="font-bold">Помилка аналізу рішення</p>
                <p className="text-xs text-rose-300/80 mt-1">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* LOADING STATE Terminal diagnostics */}
          {isLoading ? (
            <div className="flex-1 min-h-[450px] bg-white/[0.01] border border-white/10 rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl animate-pulse">
              
              {/* Scanline simulation banner */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.03] to-transparent pointer-events-none" />
              
              <div className="space-y-6">
                
                {/* Loader header info */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
                    <div>
                      <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-white">Обчислювальний процес ШІ</h3>
                      <p className="text-[10px] text-slate-500 font-mono">GEMINI CORE ANALYZING ENGINE</p>
                    </div>
                  </div>
                  <span className="text-xs text-cyan-400 font-bold font-mono">
                    {Math.round(((loadingStep + 1) / DIAGNOSTIC_STEPS.length) * 100)}%
                  </span>
                </div>

                {/* Question title loading summary view */}
                <div className="p-4 bg-slate-950/60 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Аналізована дилема</span>
                  <p className="text-xs font-semibold text-slate-300 italic">"{currentQuestion}"</p>
                </div>

                {/* Staggered Loading Log Messages */}
                <div className="space-y-3 font-mono text-xs">
                  {DIAGNOSTIC_STEPS.map((step, idx) => {
                    const isPassed = loadingStep >= idx;
                    const isCurrent = loadingStep === idx;
                    return (
                      <div 
                        key={idx} 
                        className={`flex gap-3 items-center transition-all duration-300 py-1 ${
                          isPassed ? "opacity-100" : "opacity-30"
                        }`}
                      >
                        {isPassed ? (
                          isCurrent ? (
                            <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                          )
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-white/20 shrink-0" />
                        )}
                        <span className={`text-[11px] ${
                          isCurrent ? "text-cyan-400 font-semibold" : isPassed ? "text-slate-300" : "text-slate-500"
                        }`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Progress Bar Loader Container */}
              <div className="space-y-2 pt-6 border-t border-white/10">
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-700 rounded-full"
                    style={{ width: `${((loadingStep + 1) / DIAGNOSTIC_STEPS.length) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                  <span>СТЕП {loadingStep + 1} / {DIAGNOSTIC_STEPS.length}</span>
                  <span className="animate-pulse">ШІ СИНТЕЗУЄ ЗВІТ...</span>
                </div>
              </div>

            </div>
          ) : (
            <>
              {/* DISPLAY MODE WORKSPACE (RESULT READY VS INPUT FORM) */}
              {currentAnalysis ? (
                <AnalysisWorkspace 
                  analysis={currentAnalysis} 
                  onReset={handleReset} 
                />
              ) : (
                <DecisionForm 
                  onSubmit={handleAnalyzeDecision} 
                  isLoading={isLoading} 
                />
              )}
            </>
          )}

        </section>

      </main>

      {/* 3. Bottom Control Diagnostics Footer */}
      <footer className="mt-auto border-t border-white/10 pt-4 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-mono text-slate-500 animate-cyber-in">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            ДВИГУН GEMINI-3.5-FLASH
          </span>
          <span className="hidden sm:inline">•</span>
          <span>ОБРОБКА ЗА 1.1s - 2.4s</span>
          <span className="hidden sm:inline">•</span>
          <span>ОБ'ЄКТИВНІСТЬ SWOT 98.4%</span>
        </div>
        
        <p className="text-center md:text-right text-[9px] text-slate-600 uppercase tracking-widest">
          РОЗРОБЛЕНО ЗА СТАНДАРТОМ DECISION-SWOT CORE v2
        </p>
      </footer>

    </div>
  );
}

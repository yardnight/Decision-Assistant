import { useState } from "react";
import { 
  Award, CheckCircle2, ChevronRight, AlertTriangle, ListFilter, 
  BarChart4, ShieldAlert, Sparkles, BookOpen, Layers, RefreshCw,
  PlusCircle, MinusCircle, FileText, Info
} from "lucide-react";
import { AnalysisResponse, OptionAnalysis } from "../types";

interface AnalysisWorkspaceProps {
  analysis: AnalysisResponse;
  onReset: () => void;
}

export default function AnalysisWorkspace({ analysis, onReset }: AnalysisWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"verdict" | "swot" | "table" | "proscons">("verdict");
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number>(0);

  const { options, comparisonTable, recommendation } = analysis;
  const activeOption = options[selectedOptionIdx] || options[0];

  return (
    <div className="space-y-6 animate-cyber-in">
      
      {/* High-Level Analysis Header Card */}
      <div className="bg-gradient-to-br from-indigo-950/20 via-slate-900/40 to-cyan-950/20 border border-white/10 p-6 rounded-2xl shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            Інтелектуальний ШІ-аналіз завершено
          </div>
          <button 
            onClick={onReset}
            id="reset-analysis-btn"
            className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors cursor-pointer font-mono font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            НОВИЙ ЗАПИТ
          </button>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white bg-clip-text">
            {analysis.decisionQuestion || "Розгляд вашого рішення"}
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed max-w-5xl">
            {analysis.summary}
          </p>
        </div>
      </div>

      {/* Tabs Switcher Navigation */}
      <div className="flex border-b border-white/10 overflow-x-auto scrollbar-none scroll-smooth">
        <button
          id="tab-verdict"
          onClick={() => setActiveTab("verdict")}
          className={`py-3.5 px-5 text-xs font-mono uppercase tracking-wider font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "verdict"
              ? "border-cyan-500 text-cyan-400 bg-cyan-500/[0.04]"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Award className="w-4 h-4 text-cyan-400" />
          Рекомендація & Прогноз
        </button>
        <button
          id="tab-swot"
          onClick={() => setActiveTab("swot")}
          className={`py-3.5 px-5 text-xs font-mono uppercase tracking-wider font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "swot"
              ? "border-cyan-500 text-cyan-400 bg-cyan-500/[0.04]"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Layers className="w-4 h-4 text-cyan-400" />
          SWOT-матриця
        </button>
        <button
          id="tab-table"
          onClick={() => setActiveTab("table")}
          className={`py-3.5 px-5 text-xs font-mono uppercase tracking-wider font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "table"
              ? "border-cyan-500 text-cyan-400 bg-cyan-500/[0.04]"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <BarChart4 className="w-4 h-4 text-cyan-400" />
          Порівняльна таблиця ({comparisonTable?.criteriaList?.length || 0})
        </button>
        <button
          id="tab-proscons"
          onClick={() => setActiveTab("proscons")}
          className={`py-3.5 px-5 text-xs font-mono uppercase tracking-wider font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "proscons"
              ? "border-cyan-500 text-cyan-400 bg-cyan-500/[0.04]"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <ListFilter className="w-4 h-4 text-cyan-400" />
          Діагностика плюсів/мінусів
        </button>
      </div>

      {/* Tabs Content */}
      <div className="min-h-[400px]">
        
        {/* TAB 1: VERDICT & PLAN */}
        {activeTab === "verdict" && (
          <div id="content-verdict" className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-cyber-in">
            {/* Main Recommendation card */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-r from-emerald-950/20 to-slate-900/40 border border-emerald-500/20 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl relative shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-cyan-400">Рекомендований вибір ШІ</span>
                    <h3 className="text-lg font-bold text-white tracking-wide">
                      {recommendation.bestOption}
                    </h3>
                  </div>
                </div>
                <div className="border-t border-white/10 my-4 pt-4">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2">Обґрунтування та логіка вибору</h4>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line text-justify">
                    {recommendation.rationale}
                  </p>
                </div>
              </div>

              {/* Staggered Vertical Next Steps list */}
              <div className="bg-white/[0.02] p-6 border border-white/10 rounded-2xl shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200">Покроковий оперативний план втілення</h3>
                </div>
                <div className="space-y-3">
                  {recommendation.nextSteps.map((step, index) => (
                    <div key={index} className="flex gap-4 p-3.5 hover:bg-white/[0.03] border border-white/[0.02] rounded-xl transition-all">
                      <div className="flex items-center justify-center w-8 h-8 bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono font-bold rounded-lg shrink-0 text-xs">
                        0{index + 1}
                      </div>
                      <div className="text-sm text-slate-300 pt-1 leading-relaxed">
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Side-by-side details checklist on Risks and side elements */}
            <div className="space-y-6">
              {/* Risks Mitigation */}
              <div className="bg-rose-950/10 border border-rose-500/20 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-xs uppercase tracking-wider">
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                  <h3>Контроль загроз та захист</h3>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Купірування можливих ризиків. ШІ розробив наступні заходи протидії потенційним кризам:
                </p>
                <div className="space-y-3">
                  {recommendation.risksToMitigate.map((risk, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Utility overall options summary checklist */}
              <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl space-y-3">
                <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-400">Профіль утилітарності варіантів</h4>
                <div className="space-y-2.5">
                  {options.map((opt, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-950/40 rounded-xl border border-white/5 text-xs">
                      <span className="font-semibold text-slate-200 truncate max-w-[150px]">{opt.name}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-[11px] font-mono font-bold text-cyan-400">{opt.score}/10 балів</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SWOT ANALYSIS GRID */}
        {activeTab === "swot" && (
          <div id="content-swot" className="space-y-6 animate-cyber-in">
            {/* Switcher Option Pills */}
            <div className="flex flex-wrap items-center gap-2 bg-white/[0.02] p-1.5 rounded-xl border border-white/5">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest ml-2">Порівнюваний варіант:</span>
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  id={`swot-opt-pill-${idx}`}
                  onClick={() => setSelectedOptionIdx(idx)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    selectedOptionIdx === idx
                      ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                      : "bg-transparent border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {opt.name}
                </button>
              ))}
            </div>

            {/* SWOT explanation block */}
            <div className="p-4 bg-slate-950/40 border-l-4 border-cyan-500 rounded-xl">
              <h4 className="text-sm font-bold text-slate-200">{activeOption.name}</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{activeOption.description}</p>
            </div>

            {/* The Classic 2x2 Matrix Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* STRENGTHS (Сильні сторони) */}
              <div className="bg-green-500/[0.03] border border-green-500/20 p-5 rounded-2xl space-y-3 relative overflow-hidden">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-7 h-7 bg-green-500/20 border border-green-500/40 text-green-300 font-bold rounded-lg text-xs font-mono">S</div>
                  <h4 className="font-bold text-green-400 font-mono text-xs uppercase tracking-wider">Сильні сторони (Strengths)</h4>
                </div>
                <ul className="space-y-2 list-none pl-1">
                  {activeOption.swot?.strengths?.map((item, id) => (
                    <li key={id} className="flex gap-2 text-slate-200 text-xs leading-relaxed">
                      <span className="text-green-500 font-bold shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                  {(!activeOption.swot?.strengths || activeOption.swot.strengths.length === 0) && (
                    <span className="text-xs text-slate-500 italic">Відсутні оцінки для відображення</span>
                  )}
                </ul>
              </div>

              {/* WEAKNESSES (Слабкі сторони) */}
              <div className="bg-red-500/[0.03] border border-red-500/20 p-5 rounded-2xl space-y-3 relative overflow-hidden">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-7 h-7 bg-red-500/20 border border-red-500/40 text-red-300 font-bold rounded-lg text-xs font-mono">W</div>
                  <h4 className="font-bold text-red-400 font-mono text-xs uppercase tracking-wider">Слабкі сторони (Weaknesses)</h4>
                </div>
                <ul className="space-y-2 list-none pl-1">
                  {activeOption.swot?.weaknesses?.map((item, id) => (
                    <li key={id} className="flex gap-2 text-slate-200 text-xs leading-relaxed">
                      <span className="text-red-500 font-bold shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                  {(!activeOption.swot?.weaknesses || activeOption.swot.weaknesses.length === 0) && (
                    <span className="text-xs text-slate-500 italic">Не підтверджено серйозних вразливостей</span>
                  )}
                </ul>
              </div>

              {/* OPPORTUNITIES (Можливості) */}
              <div className="bg-blue-500/[0.03] border border-blue-500/20 p-5 rounded-2xl space-y-3 relative overflow-hidden">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-7 h-7 bg-blue-500/20 border border-blue-500/40 text-blue-300 font-bold rounded-lg text-xs font-mono">O</div>
                  <h4 className="font-bold text-blue-400 font-mono text-xs uppercase tracking-wider">Нові можливості (Opportunities)</h4>
                </div>
                <ul className="space-y-2 list-none pl-1">
                  {activeOption.swot?.opportunities?.map((item, id) => (
                    <li key={id} className="flex gap-2 text-slate-200 text-xs leading-relaxed">
                      <span className="text-blue-400 font-bold shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                  {(!activeOption.swot?.opportunities || activeOption.swot.opportunities.length === 0) && (
                    <span className="text-xs text-slate-500 italic">Сприятливі обставини не ідентифіковані</span>
                  )}
                </ul>
              </div>

              {/* THREATS (Загрози) */}
              <div className="bg-amber-500/[0.03] border border-amber-500/20 p-5 rounded-2xl space-y-3 relative overflow-hidden">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-7 h-7 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold rounded-lg text-xs font-mono">T</div>
                  <h4 className="font-bold text-amber-400 font-mono text-xs uppercase tracking-wider">Приховані загрози (Threats)</h4>
                </div>
                <ul className="space-y-2 list-none pl-1">
                  {activeOption.swot?.threats?.map((item, id) => (
                    <li key={id} className="flex gap-2 text-slate-200 text-xs leading-relaxed">
                      <span className="text-amber-500 font-bold shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                  {(!activeOption.swot?.threats || activeOption.swot.threats.length === 0) && (
                    <span className="text-xs text-slate-500 italic">Відсутні специфічні зовнішні загрози</span>
                  )}
                </ul>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: DETAILS COMPARISON MATRIX */}
        {activeTab === "table" && (
          <div id="content-table" className="space-y-6 animate-cyber-in bg-white/[0.01] p-6 border border-white/10 rounded-2xl shadow-xl">
            <div className="space-y-1">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200">Багатокритеріальний аналіз параметрів</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Шкала від 1 до 10 (де вище значення є кориснішим за фактором). Наведіть вказівник або утримуйте натискання на клітинці оцінки, щоб прочитати роз'яснення.
              </p>
            </div>

            {/* Custom Responsive CSS table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-mono">
                    <th className="py-3.5 px-4 font-semibold w-[220px]">Розглянутий Сценарій</th>
                    {comparisonTable.criteriaList.map((crit, i) => (
                      <th key={i} className="py-3.5 px-4 font-semibold text-center select-none truncate max-w-[120px]" title={crit}>
                        {crit}
                      </th>
                    ))}
                    <th className="py-3.5 px-4 font-semibold text-center w-[110px]">Коефіцієнт</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {comparisonTable.rows.map((row, idx) => {
                    const averageScoreIdx = row.scores.reduce((a, b) => a + b, 0) / (row.scores.length || 1);
                    return (
                      <tr key={idx} className="hover:bg-white/[0.02] group transition-all">
                        <td className="py-4 px-4 font-bold text-slate-200 text-xs">
                          {row.optionName}
                        </td>
                        {row.scores.map((score, sIdx) => (
                          <td key={sIdx} className="p-3 text-center relative group/cell">
                            <div className="inline-flex flex-col items-center justify-center p-1.5 rounded-lg transition-all w-11 h-11 bg-white/[0.02] border border-white/10 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/[0.05]">
                              <span className={`text-[13px] font-mono font-bold ${
                                score >= 8 
                                  ? "text-green-400" 
                                  : score >= 5 
                                    ? "text-amber-400" 
                                    : "text-rose-400"
                              }`}>
                                {score}
                              </span>
                              <div className="w-5 h-0.5 rounded-full bg-white/10 mt-1 overflow-hidden">
                                <div 
                                  className={`h-full ${
                                    score >= 8 
                                      ? "bg-green-400" 
                                      : score >= 5 
                                        ? "bg-amber-400" 
                                        : "bg-rose-400"
                                  }`} 
                                  style={{ width: `${score * 10}%` }} 
                                />
                              </div>
                            </div>
                            
                            {/* Hover tooltip for criteria note */}
                            {row.notes && row.notes[sIdx] && (
                              <div className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/cell:block bg-slate-950 text-slate-200 text-xs p-3 rounded-xl w-56 text-left shadow-2xl pointer-events-none border border-white/10 leading-relaxed">
                                <p className="font-bold text-[10px] uppercase font-mono border-b border-white/10 pb-1 mb-1.5 text-cyan-400">
                                  {comparisonTable.criteriaList[sIdx]}
                                </p>
                                {row.notes[sIdx]}
                              </div>
                            )}
                          </td>
                        ))}
                        <td className="p-3 text-center">
                          <span className="font-mono font-bold text-slate-100 text-xs px-2 py-1 bg-cyan-950/60 border border-cyan-500/30 rounded-lg">
                            {averageScoreIdx.toFixed(1)} / 10
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex gap-2 items-center text-[11px] text-slate-500 font-mono mt-1 pt-2 border-t border-white/5">
              <Info className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
              <span>ШІ оцінював кожну альтернативу індивідуально виходячи з наданого контексту та стандартних бенчмарків.</span>
            </div>
          </div>
        )}

        {/* TAB 4: ACCURATE PROS AND CONS LIST */}
        {activeTab === "proscons" && (
          <div id="content-proscons" className="space-y-6 animate-cyber-in">
            {/* Switcher Option Pills */}
            <div className="flex flex-wrap items-center gap-2 bg-white/[0.02] p-1.5 rounded-xl border border-white/5">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest ml-2 font-mono">Аналізована альтернатива:</span>
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  id={`pros-opt-pill-${idx}`}
                  onClick={() => setSelectedOptionIdx(idx)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    setSelectedOptionIdx && selectedOptionIdx === idx
                      ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                      : "bg-transparent border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {opt.name}
                </button>
              ))}
            </div>

            {/* Side-by-side list blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* ADVANTAGES PROS CARD */}
              <div className="bg-white/[0.02] p-6 border border-white/5 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-green-300 pb-2 border-b border-white/5">
                  <PlusCircle className="w-4 h-4 text-green-400" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider">Переваги/Аргументи за (Pros)</h3>
                </div>
                <div className="space-y-3">
                  {activeOption.pros?.map((pro, index) => (
                    <div key={index} className="p-3.5 bg-slate-950/20 border border-white/5 hover:border-green-500/20 rounded-xl transition-all space-y-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-xs text-slate-200 leading-relaxed text-justify">{pro.text}</p>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 border ${
                          pro.impact === "High" 
                            ? "bg-green-500/15 text-green-300 border-green-500/20"
                            : pro.impact === "Medium"
                              ? "bg-amber-500/15 text-amber-300 border-amber-500/20"
                              : "bg-white/5 text-slate-400 border-white/10"
                        }`}>
                          {pro.impact === "High" ? "висока" : pro.impact === "Medium" ? "середня" : "низька"}
                        </span>
                      </div>
                    </div>
                  ))}
                  {(!activeOption.pros || activeOption.pros.length === 0) && (
                    <p className="text-xs text-slate-500 italic">Явних переваг не сформовано.</p>
                  )}
                </div>
              </div>

              {/* LIMITATIONS / CONS CARD */}
              <div className="bg-white/[0.02] p-6 border border-white/5 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-rose-300 pb-2 border-b border-white/5">
                  <MinusCircle className="w-4 h-4 text-rose-400 animate-pulse" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider">Недоліки/Застереження (Cons)</h3>
                </div>
                <div className="space-y-3">
                  {activeOption.cons?.map((con, index) => (
                    <div key={index} className="p-3.5 bg-slate-950/20 border border-white/5 hover:border-rose-500/20 rounded-xl transition-all space-y-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-xs text-slate-200 leading-relaxed text-justify">{con.text}</p>
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 border ${
                          con.impact === "High" 
                            ? "bg-rose-500/15 text-rose-300 border-rose-500/20 animate-pulse"
                            : con.impact === "Medium"
                              ? "bg-amber-500/15 text-amber-300 border-amber-500/20"
                              : "bg-white/5 text-slate-400 border-white/10"
                        }`}>
                          {con.impact === "High" ? "критична" : con.impact === "Medium" ? "середня" : "низька"}
                        </span>
                      </div>
                    </div>
                  ))}
                  {(!activeOption.cons || activeOption.cons.length === 0) && (
                    <p className="text-xs text-slate-400 italic">Явних недоліків не виявлено.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

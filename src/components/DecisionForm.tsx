import React, { useState } from "react";
import { Plus, Trash2, Sliders, Info, Play, RefreshCw, HelpCircle } from "lucide-react";
import TemplateCatalog, { Template } from "./TemplateCatalog";

interface DecisionFormProps {
  onSubmit: (data: { question: string; options: string[]; preferredCriteria: string }) => void;
  isLoading: boolean;
}

export default function DecisionForm({ onSubmit, isLoading }: DecisionFormProps) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [preferredCriteria, setPreferredCriteria] = useState("");
  const [useAIProps, setUseAIProps] = useState(false);

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, ""]);
    }
  };

  const handleRemoveOption = (index: number) => {
    const updated = options.filter((_, i) => i !== index);
    setOptions(updated.length > 0 ? updated : [""]);
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const handleSelectTemplate = (template: Template) => {
    setQuestion(template.question);
    setOptions(template.options);
    setPreferredCriteria(template.criteria);
    setUseAIProps(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    // Filter out blank options
    const cleanedOptions = useAIProps ? [] : options.filter(o => o.trim() !== "");
    onSubmit({
      question: question.trim(),
      options: cleanedOptions,
      preferredCriteria: preferredCriteria.trim()
    });
  };

  return (
    <div className="space-y-8 animate-cyber-in">
      <form onSubmit={handleFormSubmit} className="space-y-6 bg-white/[0.02] backdrop-blur-md p-6 border border-white/10 rounded-2xl shadow-2xl">
        
        {/* Core Question Input */}
        <div className="space-y-2">
          <label htmlFor="question" className="block text-xs font-mono font-bold uppercase tracking-widest text-slate-300">
            Яку дилему або рішення ви розглядаєте? <span className="text-cyan-400">*</span>
          </label>
          <div className="relative">
            <textarea
              id="question"
              required
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Наприклад: Чи варто переходити на нову технологію React/Next.js для нашого веб-порталу, чи залишити поточний SPA-код?"
              className="w-full p-4 pr-10 border border-white/10 rounded-xl font-sans text-sm outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/20 bg-slate-950/40 text-slate-100 placeholder-slate-500 transition-all resize-none"
              disabled={isLoading}
            />
            <div className="absolute right-3 bottom-3 text-slate-500">
              <HelpCircle className="w-5 h-5 opacity-40 animate-pulse" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            Детально опишіть проблему чи запитання, щоб ШІ міг підготувати точніші SWOT-матриці та вагові коефіцієнти.
          </p>
        </div>

        {/* Option Strategy Mode Selector */}
        <div className="space-y-3">
          <label className="block text-xs font-mono font-bold uppercase tracking-widest text-slate-300">
            Варіанти рішень (Альтернативи)
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-white/[0.04] border border-white/5 rounded-xl">
            <button
              type="button"
              id="btn-manual-options"
              onClick={() => setUseAIProps(false)}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                !useAIProps 
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold shadow-inner" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
              disabled={isLoading}
            >
              Вказати вручну
            </button>
            <button
              type="button"
              id="btn-ai-options"
              onClick={() => setUseAIProps(true)}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                useAIProps 
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold shadow-inner" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
              disabled={isLoading}
            >
              ШІ знайде варіанти ✨
            </button>
          </div>
        </div>

        {/* Options Input Block */}
        {!useAIProps ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                Розглядані варіанти ({options.length}/5)
              </span>
              {options.length < 5 && (
                <button
                  type="button"
                  id="add-option-btn"
                  onClick={handleAddOption}
                  className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                  disabled={isLoading}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Додати варіант
                </button>
              )}
            </div>

            <div className="space-y-2">
              {options.map((option, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      required
                      value={option}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Варіант ${idx + 1}`}
                      className="w-full py-2.5 px-4 border border-white/10 rounded-xl text-sm bg-slate-950/30 text-slate-200 focus:border-cyan-500/80 outline-none transition-all placeholder-slate-600"
                      disabled={isLoading}
                    />
                    <span className="absolute right-3 top-3 text-[10px] text-cyan-500/60 font-mono">
                      VAR_0{idx + 1}
                    </span>
                  </div>
                  {options.length > 1 && (
                    <button
                      type="button"
                      id={`remove-option-btn-${idx}`}
                      onClick={() => handleRemoveOption(idx)}
                      className="p-2.5 border border-white/10 hover:border-red-500/50 text-slate-400 hover:text-red-400 rounded-xl transition-all cursor-pointer hover:bg-red-500/5"
                      disabled={isLoading}
                      title="Видалити"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex gap-3 p-4 bg-cyan-950/20 border border-cyan-500/20 rounded-2xl text-slate-300 text-xs leading-relaxed">
            <Info className="w-5 h-5 text-cyan-400 shrink-0 select-none animate-pulse" />
            <div>
              <p className="font-bold text-cyan-300 mb-0.5">ШІ автоматично згенерує найкращі стратегії</p>
              <p className="text-slate-400 text-[11px]">
                Вам не потрібно вигадувати варіанти самостійно. Модель проаналізує дилему, розробить та всебічно розкриє від 2 до 4 найнадійніших шляхів вирішення.
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Criteria / Preferences Details */}
        <div className="space-y-2 border-t border-white/10 pt-5">
          <label htmlFor="criteria" className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-widest text-slate-300">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Додаткові критерії та обмеження <span className="text-[10px] font-normal text-slate-500 lowercase">(необов'язково)</span>
          </label>
          <input
            id="criteria"
            type="text"
            value={preferredCriteria}
            onChange={(e) => setPreferredCriteria(e.target.value)}
            placeholder="Наприклад: Бюджет до $2000, втілення за 2 місяці, легкість підтримки коду"
            className="w-full py-3 px-4 border border-white/10 rounded-xl text-sm bg-slate-950/30 text-slate-200 focus:border-cyan-500/80 outline-none transition-all placeholder-slate-600"
            disabled={isLoading}
          />
          <p className="text-[11px] text-slate-400">
            Вкажіть важливі фактори (дедлайни, фінансові обмеження, тощо), щоб адаптувати оцінювання моделей під ваші потреби.
          </p>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          id="submit-decision-btn"
          disabled={isLoading || !question.trim()}
          className="w-full py-4 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold tracking-wider uppercase text-xs rounded-xl hover:from-cyan-500 hover:to-blue-500 active:scale-[0.99] transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] border border-cyan-400/30"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Аналізуємо альтернативи через SWOT за допомогою ШІ...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Розпочати системний аналіз рішення
            </>
          )}
        </button>
      </form>

      {/* Templates Quick Load block */}
      {!isLoading && <TemplateCatalog onSelect={handleSelectTemplate} />}
    </div>
  );
}

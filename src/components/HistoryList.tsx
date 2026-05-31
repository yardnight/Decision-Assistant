import { Clock, Calendar, Trash2 } from "lucide-react";
import { SavedDecision } from "../types";

interface HistoryListProps {
  history: SavedDecision[];
  onSelect: (decision: SavedDecision) => void;
  onDelete: (id: string) => void;
}

export default function HistoryList({ history, onSelect, onDelete }: HistoryListProps) {
  if (history.length === 0) {
    return (
      <div className="bg-white/[0.01] border border-white/10 p-6 rounded-2xl text-center space-y-2">
        <Clock className="w-8 h-8 text-cyan-500/40 mx-auto opacity-60 animate-pulse" />
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Історія аналізів порожня</h4>
        <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
          Тут з'являтимуться ваші раніше переглянуті оцінки та SWOT-звіти, щоб ви могли повернутися до них у будь-який час.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-[0.15em] pl-1">
        <Clock className="w-3.5 h-3.5" />
        <span>Останні аналізи ({history.length})</span>
      </div>
      <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
        {history.map((item) => {
          const date = new Date(item.timestamp).toLocaleDateString("uk-UA", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
          });
          return (
            <div
              key={item.id}
              className="group flex items-center justify-between p-3.5 bg-white/[0.01] border border-white/5 rounded-xl hover:border-cyan-500/30 hover:bg-cyan-500/[0.02] transition-all gap-3"
            >
              <button
                onClick={() => onSelect(item)}
                className="flex-1 text-left space-y-1 select-none min-w-0"
              >
                <h4 className="text-xs font-semibold text-slate-200 line-clamp-1 group-hover:text-cyan-300 transition-colors">
                  {item.question}
                </h4>
                <div className="flex items-center gap-3 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {date}
                  </span>
                  <span className="font-bold text-cyan-400 truncate max-w-[170px]">
                    ★ {item.analysis.recommendation.bestOption}
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => onDelete(item.id)}
                className="p-2 border border-white/5 hover:border-red-500/30 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/[0.04] transition-all shrink-0 cursor-pointer"
                title="Видалити з історії"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { Sparkles, Briefcase, GraduationCap, Terminal, Home } from "lucide-react";

export interface Template {
  title: string;
  question: string;
  options: string[];
  criteria: string;
  icon: any;
  category: string;
}

export const templates: Template[] = [
  {
    title: "Робота: Наїм чи Фріланс",
    question: "Що обрати для подальшого кар'єрного розвитку: стабільну роботу в IT-компанії (найм) чи повний перехід на фріланс?",
    options: ["Робота в стабільній IT-компанії (найм)", "Перехід на фріланс та власна справа"],
    criteria: "Стабільність доходу, професійне зростання, свобода розпорядку дня, складність пошуку клієнтів",
    icon: Briefcase,
    category: "Кар'єра"
  },
  {
    title: "Оселя: Купівля чи Оренда",
    question: "Чи варто інвестувати у купівлю власної квартири в іпотеку, або краще продовжувати орендувати житло й інвестувати кошти в інші активи?",
    options: ["Купівля квартири в іпотеку", "Оренда житла та вільне інвестування"],
    criteria: "Фінансова вигода на 5 років, гнучкість переїзду, юридичні зобов'язання, відчуття психологічного комфорту",
    icon: Home,
    category: "Життя"
  },
  {
    title: "Навчання: Виш чи Курси",
    question: "Що краще для старту в розробці ПЗ: вступ на 4-річну бакалаврську програму в університет чи проходження інтенсивних 9-місячних курсів із практикою?",
    options: ["Отримання ступеня бакалавра в університеті", "Інтенсивні спеціалізовані курси + самоосвіта"],
    criteria: "Швидкість працевлаштування, фундаментальність знань, корисні знайомства (нетворкінг), вартість навчання",
    icon: GraduationCap,
    category: "Освіта"
  },
  {
    title: "Технології: SPA чи SSR/Next.js",
    question: "Яку архітектуру обрати для нового веб-сервісу з великою кількістю динамічного контенту і потребою в хорошому залученні користувачів?",
    options: ["Клієнтський React SPA (Vite)", "Серверний рендеринг SSR (Next.js / Remix)"],
    criteria: "Швидкість початкового завантаження, SEO-оптимізація, складність розробки, вимоги до серверної інфраструктури",
    icon: Terminal,
    category: "Технології"
  }
];

interface TemplateCatalogProps {
  onSelect: (template: Template) => void;
}

export default function TemplateCatalog({ onSelect }: TemplateCatalogProps) {
  return (
    <div id="templates-section" className="space-y-4">
      <div className="flex items-center gap-2 text-slate-300 font-sans font-medium">
        <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-cyan-400">
          Швидкі шаблони складних рішений
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template, idx) => {
          const Icon = template.icon;
          return (
            <button
              key={idx}
              id={`template-btn-${idx}`}
              onClick={() => onSelect(template)}
              className="flex items-start gap-4 p-4 text-left border border-white/10 rounded-xl hover:border-cyan-500/50 hover:bg-cyan-500/[0.04] active:scale-[0.98] transition-all bg-white/[0.02] backdrop-blur-xs group"
            >
              <div className="p-3 bg-white/5 rounded-lg text-slate-400 transition-all group-hover:bg-cyan-950 group-hover:text-cyan-400">
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-cyan-950/50 border border-cyan-500/30 rounded text-cyan-400">
                    {template.category}
                  </span>
                </div>
                <h4 className="font-semibold text-slate-200 text-sm group-hover:text-white transition-colors">
                  {template.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {template.question}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

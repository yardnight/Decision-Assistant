import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;

// Shared Gemini client utility
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API endpoint for analyzing decisions
app.post("/api/analyze", async (req, res) => {
  try {
    const { question, options, preferredCriteria } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Будь ласка, вкажіть суть рішення або запитання." });
    }

    if (!apiKey) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY не знайдено в системних секретах. Будь ласка, налаштуйте його в Settings > Secrets." 
      });
    }

    let prompt = `Користувач просить допомогти прийняти рішення з такого питання: "${question}".\n`;
    if (options && options.length > 0) {
      prompt += `Він розглядає такі альтернативи/варіанти: ${options.map((o: any) => `"${o}"`).join(", ")}.\n`;
    } else {
      prompt += `Він не вказав конкретних варіантів, тому, будь ласка, самостійно запропонуй від 2 до 4 найбільш логічних та поширених варіантів рішень для цього випадку і проаналізуй їх.\n`;
    }

    if (preferredCriteria) {
      prompt += `Важливі додаткові критерії та обмеження від користувача: "${preferredCriteria}".\n`;
    }

    prompt += `Виконай комплексний аналіз кожного варіанту:
1. Визнач сильні та слабкі сторони, можливості та загрози (SWOT-аналіз) для кожного варіанту окремо.
2. Проаналізуй переваги (pros) та недоліки (cons) з оцінкою їхнього ступеня впливу ("High", "Medium", "Low") для кожного варіанту.
3. Побудуй порівняльну таблицю з оцінками від 1 до 10 за ключовими критеріями (такими як Фінансові витрати/Вартість, Простір у часі або Простір зусиль/Складність, Ризик невдачі, Довгостроковий потенціал тощо).
4. Визнач найкращий варіант у секції рекомендації, детально поясни логіку вибору, пропиши 3-5 конкретних наступних кроків і ключові загрози для цього вибору разом із планом запобігання.

Уся інформація має бути написана українською мовою. Переконайся, що критерії порівняння є практичними та життєвими.`;

    const decisionSchema = {
      type: Type.OBJECT,
      properties: {
        decisionQuestion: {
          type: Type.STRING,
          description: "Refined/polished formulation of the decision in Ukrainian"
        },
        summary: {
          type: Type.STRING,
          description: "High-level summary of the decision situation and overall analysis context in Ukrainian"
        },
        options: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING,
                description: "Name of the option/alternative in Ukrainian"
              },
              description: {
                type: Type.STRING,
                description: "Brief visual outline or profile of this alternative in Ukrainian"
              },
              score: {
                type: Type.INTEGER,
                description: "Overall comprehensive score for this option out of 10"
              },
              pros: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING, description: "A pro or benefit of this choice in Ukrainian" },
                    impact: { type: Type.STRING, description: "Impact: High, Medium, or Low" }
                  },
                  required: ["text", "impact"]
                }
              },
              cons: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING, description: "A con or risk of this choice in Ukrainian" },
                    impact: { type: Type.STRING, description: "Impact: High, Medium, or Low" }
                  },
                  required: ["text", "impact"]
                }
              },
              swot: {
                type: Type.OBJECT,
                properties: {
                  strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Strengths (Сильні сторони) in Ukrainian" },
                  weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Weaknesses (Слабкі сторони) in Ukrainian" },
                  opportunities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Opportunities (Можливості) in Ukrainian" },
                  threats: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Threats (Загрози) in Ukrainian" }
                },
                required: ["strengths", "weaknesses", "opportunities", "threats"]
              }
            },
            required: ["name", "description", "score", "pros", "cons", "swot"]
          }
        },
        comparisonTable: {
          type: Type.OBJECT,
          properties: {
            criteriaList: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Compared criteria in Ukrainian (e.g. ['Вартість', 'Ризики', 'Перспективи', 'Простота втілення'])"
            },
            rows: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  optionName: { type: Type.STRING, description: "Matching name of the option" },
                  scores: { type: Type.ARRAY, items: { type: Type.INTEGER }, description: "Values (1-10) corresponding exactly to the criteriaList" },
                  notes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Short commentary or rationale in Ukrainian corresponding to each criteria index" }
                },
                required: ["optionName", "scores", "notes"]
              }
            }
          },
          required: ["criteriaList", "rows"]
        },
        recommendation: {
          type: Type.OBJECT,
          properties: {
            bestOption: { type: Type.STRING, description: "Name of the winning/recommended option in Ukrainian" },
            rationale: { type: Type.STRING, description: "In-depth explanation why this option stands out in Ukrainian" },
            nextSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable 3-5 immediate steps to execute this decision in Ukrainian" },
            risksToMitigate: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key risks with concrete prevention plan in Ukrainian" }
          },
          required: ["bestOption", "rationale", "nextSteps", "risksToMitigate"]
        }
      },
      required: ["decisionQuestion", "summary", "options", "comparisonTable", "recommendation"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an analytical assistant specializing in strategic decisions, Multi-Criteria Decision Analysis (MCDA), SWOT analysis, and structured risk assessment. Be logical, objective, and detailed. Translate all concepts into clear, articulate Ukrainian. Return formatted JSON matching the provided schema.",
        responseMimeType: "application/json",
        responseSchema: decisionSchema,
        temperature: 0.2
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Немає відповіді від штучного інтелекту.");
    }
    
    const parsedData = JSON.parse(text.trim());
    res.json(parsedData);
  } catch (error: any) {
    console.error("Backend Decision Analysis Error:", error);
    res.status(500).json({ error: error.message || "Сталася помилка під час аналізу рішення." });
  }
});

// Start server in async container to support CommonJS compilation
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
});

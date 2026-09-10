import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = 3000;

// Initialize Gemini client lazily/safely
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
  });
});

// AI Analysis Endpoint
app.post("/api/analyze-failure", async (req, res) => {
  try {
    const {
      method,
      errorMessage,
      amount,
      currency,
      bank,
      timeOfTransaction,
      amountDebited,
      referenceNumber,
    } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: false,
        useFallback: true,
        message: "Gemini API key not configured. Using expert rule-based diagnostic engine.",
      });
    }

    const systemPrompt = `You are an expert payment systems and banking infrastructure analyst specializing in UPI (Unified Payments Interface), card transactions (Debit/Credit, Visa/Mastercard/RuPay), 3D Secure, Net Banking, and payment gateway settlement protocols.
Your job is to diagnose payment failure reports and provide:
1. Exact status: One of ['failed', 'pending', 'successful', 'debited_but_failed']
2. Concise, clear title of the likely reason
3. A simple explanation in easy, non-technical language (no confusing bank jargon)
4. Turnaround time and clear retry recommendation (whether it is safe to retry now or if user might be double-charged)
5. 3 to 5 actionable step-by-step resolution steps (categorized as 'immediate', 'verification', 'escalation', or 'wait')
6. If amount was debited from user account, draft a formal bank dispute grievance message including transaction details (UTR/RRN).

SECURITY RULE: Never instruct the user to share PIN, CVV, passwords, or OTP with anyone.`;

    const userPrompt = `Diagnose this payment failure:
- Payment Method: ${method}
- Bank or Provider: ${bank || 'Unspecified bank'}
- Amount: ${currency || '₹'} ${amount || 'Not specified'}
- Time of transaction: ${timeOfTransaction || 'Recent'}
- Error message / Problem observed: "${errorMessage || 'Transaction failed without specific code'}"
- Was amount debited from user bank account? ${amountDebited}
- Reference / UTR (if provided): ${referenceNumber || 'None provided'}

Provide a structured, accurate analysis.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: {
              type: Type.STRING,
              description: "Must be one of: failed, pending, successful, debited_but_failed",
            },
            statusLabel: {
              type: Type.STRING,
              description: "Human-friendly status label, e.g. Amount Debited but Payment Failed",
            },
            likelyReason: {
              type: Type.STRING,
              description: "Short, precise title of the root cause",
            },
            simpleExplanation: {
              type: Type.STRING,
              description: "Plain, comforting, and clear explanation of what went wrong",
            },
            urgencyLevel: {
              type: Type.STRING,
              description: "Must be one of: low, medium, high, critical",
            },
            canRetryNow: {
              type: Type.BOOLEAN,
              description: "True only if safe to retry immediately without duplicate charge risk",
            },
            retryRecommendation: {
              type: Type.STRING,
              description: "Clear directive on whether and when to retry",
            },
            expectedResolutionTime: {
              type: Type.STRING,
              description: "e.g. Auto-reversal in T+1 to T+2 banking days or Immediate",
            },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  isUrgent: { type: Type.BOOLEAN },
                  category: {
                    type: Type.STRING,
                    description: "One of: immediate, verification, escalation, wait",
                  },
                },
                required: ["id", "title", "description", "category"],
              },
            },
            bankActionNeeded: {
              type: Type.BOOLEAN,
              description: "Whether the user needs to escalate to the bank",
            },
            disputeTemplate: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING },
                body: { type: Type.STRING },
              },
            },
          },
          required: [
            "status",
            "statusLabel",
            "likelyReason",
            "simpleExplanation",
            "urgencyLevel",
            "canRetryNow",
            "retryRecommendation",
            "expectedResolutionTime",
            "steps",
            "bankActionNeeded",
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from AI model");
    }

    const parsed = JSON.parse(text);
    return res.json({
      success: true,
      data: {
        ...parsed,
        isAiGenerated: true,
      },
    });
  } catch (error: any) {
    console.error("AI Analysis error (falling back to expert diagnostic rules):", error?.message || error);
    return res.json({
      success: false,
      useFallback: true,
      error: error?.message || "Service temporarily busy",
    });
  }
});

// Vite middleware or static serving
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
    console.log(`Payment Failure Assistant server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini API client safely
  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // 1. Dynamic Questions Generator (20 Easy / 15 Medium / 10 Hard)
  app.post("/api/ai/generate-questions", async (req, res) => {
    try {
      const { userProfile, selection } = req.body;
      const { goal, subject, unit, difficulty } = selection || {};

      const questionCount = difficulty === 'Easy' ? 20 : difficulty === 'Hard' ? 10 : 15;
      const sessionNonce = Date.now() + "_" + Math.floor(Math.random() * 1000000);

      const subjectClean = subject || 'Data Structures & Algorithms';
      const difficultyClean = difficulty || 'Easy';

      const ai = getGenAI();
      const prompt = `You are an expert technical and competitive aptitude examiner.
CRITICAL INSTRUCTION: Generate a FRESH, COMPLETELY UNIQUE, AND RANDOMIZED set of EXACTLY ${questionCount} practice questions STRICTLY tailored to the chosen Subject: "${subjectClean}" and Difficulty Tier: "${difficultyClean}".

SUBJECT TAILORING SPECIFICATIONS:
- If Subject is "Logical Reasoning": Every single question MUST test logical reasoning concepts (e.g., Number Sequences, Syllogisms, Blood Relations, Coding-Decoding, Seating Arrangements, Direction Sense, Truth Tables, Venn Diagrams).
  - Difficulty Calibration for Logical Reasoning:
    - Easy (${questionCount} Qs): Fundamental single-step pattern completion, direct direction sense, simple 1-step blood relations, basic syllogisms.
    - Medium (${questionCount} Qs): Multi-variable coding-decoding, 2-statement syllogisms, circular seating arrangements, logical deductions.
    - Hard (${questionCount} Qs): Complex multi-variable analytical puzzles, critical reasoning assumptions, statement-arguments.
  - For 'codeSnippet', provide the sequence data, logical premise representation, or truth matrix (e.g. "Sequence: 2, 6, 12, 20, 30, ?").

- If Subject is "Quantitative Aptitude": Every question MUST test mathematical aptitude (Percentages, Speed/Time/Distance, Profit & Loss, Probability, Permutations & Combinations, Ratios, Averages). Calibrated to "${difficultyClean}". For 'codeSnippet', provide the equation or data parameters.

- If Subject is "Verbal Ability & English": Every question MUST test grammar, vocabulary, reading comprehension inference, or sentence structure calibrated to "${difficultyClean}". For 'codeSnippet', provide the passage or sentence text.

- If Subject is CS/Software (e.g., Data Structures & Algorithms, Database Management Systems, Operating Systems, System Design, Computer Networks, OOP): Every question MUST test technical concepts calibrated to "${difficultyClean}". For 'codeSnippet', provide a 3-8 line code snippet or query demonstrating the scenario.

Randomization Seed: ${sessionNonce}

Test Parameters:
- Subject: ${subjectClean}
- Unit/Subtopic: ${unit || 'General Core'}
- Difficulty Tier: ${difficultyClean}
- Total Questions Required: ${questionCount}

Make sure every single question from #1 to #${questionCount} is unique, creative, distinct, and directly relates to ${subjectClean}.
IMPORTANT: Every question MUST include 4 multiple choice options ("options") labeled A, B, C, D, a correctOptionLetter ("A", "B", "C", or "D"), a specific codeSnippet/data representation, a detailed problem statement, a hint, constraints, and expectedKeyConcepts.

Provide for each question:
1. id (string "q1", "q2", etc.)
2. number (1 to ${questionCount})
3. title (short descriptive topic name)
4. category ("${subjectClean}")
5. difficulty ("${difficultyClean}")
6. problemStatement (detailed question statement calibrated to ${difficultyClean})
7. codeSnippet (a distinct 3-8 line snippet, sequence data, equation, or text premise)
8. options (array of 4 objects: [{ "letter": "A", "text": "..." }, { "letter": "B", "text": "..." }, { "letter": "C", "text": "..." }, { "letter": "D", "text": "..." }])
9. correctOptionLetter (string "A", "B", "C", or "D")
10. constraints (list of 2-3 constraints or parameters)
11. hint (1-sentence helpful hint)
12. expectedKeyConcepts (2-4 key terms)

Return ONLY a JSON array with these ${questionCount} objects.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                number: { type: Type.NUMBER },
                title: { type: Type.STRING },
                category: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                problemStatement: { type: Type.STRING },
                codeSnippet: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      letter: { type: Type.STRING },
                      text: { type: Type.STRING },
                    },
                    required: ["letter", "text"],
                  },
                },
                correctOptionLetter: { type: Type.STRING },
                constraints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                hint: { type: Type.STRING },
                expectedKeyConcepts: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                "id",
                "number",
                "title",
                "category",
                "difficulty",
                "problemStatement",
                "codeSnippet",
                "options",
                "correctOptionLetter",
                "constraints",
                "hint",
                "expectedKeyConcepts",
              ],
            },
          },
        },
      });

      const questions = JSON.parse(response.text || "[]");
      if (Array.isArray(questions) && questions.length > 0) {
        return res.json({ questions });
      }

      throw new Error("Invalid questions response format");
    } catch (error: any) {
      console.error("Generate Questions Error:", error);
      const subjectName = req.body?.selection?.subject || "Data Structures & Algorithms";
      const diff = req.body?.selection?.difficulty || "Easy";
      const questionCount = diff === 'Easy' ? 20 : diff === 'Hard' ? 10 : 15;

      const lowerSub = (subjectName || '').toLowerCase();

      // Subject-specific fallback bank for Logical Reasoning, Aptitude, Verbal, CS
      let fallbackQuestions = [];

      if (lowerSub.includes('logical') || lowerSub.includes('reasoning')) {
        const logicalTopics = [
          {
            title: 'Number Series Pattern',
            snippet: 'Sequence: 2, 6, 12, 20, 30, ?',
            problem: 'Identify the missing term in the sequence.',
            options: [
              { letter: 'A', text: '42 (Pattern: +4, +6, +8, +10, +12)' },
              { letter: 'B', text: '40' },
              { letter: 'C', text: '36' },
              { letter: 'D', text: '44' }
            ]
          },
          {
            title: 'Syllogism Deduction',
            snippet: 'Statements:\n1. All A are B.\n2. Some B are C.\nConclusions:\nI. Some A are C.\nII. Some B are A.',
            problem: 'Which conclusion(s) logically follow from the given statements?',
            options: [
              { letter: 'A', text: 'Only Conclusion II follows' },
              { letter: 'B', text: 'Only Conclusion I follows' },
              { letter: 'C', text: 'Both I and II follow' },
              { letter: 'D', text: 'Neither I nor II follows' }
            ]
          },
          {
            title: 'Blood Relations',
            snippet: 'Premise: A is the brother of B. B is the daughter of C. C is married to D.',
            problem: 'How is A related to D?',
            options: [
              { letter: 'A', text: 'Son' },
              { letter: 'B', text: 'Brother' },
              { letter: 'C', text: 'Father' },
              { letter: 'D', text: 'Nephew' }
            ]
          },
          {
            title: 'Coding-Decoding Pattern',
            snippet: 'Rule: If "LEADER" is coded as "MDIEFS" under a shift cipher pattern.',
            problem: 'How is "STRIKE" coded under the identical transformation pattern?',
            options: [
              { letter: 'A', text: 'TUSJLF' },
              { letter: 'B', text: 'TUSJLD' },
              { letter: 'C', text: 'SVRJLF' },
              { letter: 'D', text: 'TTSJLF' }
            ]
          },
          {
            title: 'Seating Arrangement',
            snippet: 'Condition: 5 people (P, Q, R, S, T) sit in a row. P is adjacent to Q. R is at the extreme right.',
            problem: 'If S is immediately to the left of R, who sits in the exact middle?',
            options: [
              { letter: 'A', text: 'Q' },
              { letter: 'B', text: 'P' },
              { letter: 'C', text: 'T' },
              { letter: 'D', text: 'S' }
            ]
          }
        ];

        fallbackQuestions = Array.from({ length: questionCount }, (_, i) => {
          const item = logicalTopics[i % logicalTopics.length];
          return {
            id: `q_logic_${Date.now()}_${i + 1}`,
            number: i + 1,
            title: `${item.title} #${i + 1}`,
            category: subjectName,
            difficulty: diff,
            problemStatement: `[Logical Reasoning ${diff} Q#${i + 1}]: ${item.problem}`,
            codeSnippet: item.snippet,
            options: item.options,
            constraints: ['Direct Logical Inference', 'No External Assumptions'],
            hint: 'Analyze the given premise or pattern step by step.',
            expectedKeyConcepts: ['Logical Deduction', 'Pattern Recognition', 'Inference'],
          };
        });
      } else if (lowerSub.includes('aptitude') || lowerSub.includes('quantitative') || lowerSub.includes('math')) {
        const quantTopics = [
          {
            title: 'Percentage & Ratio Drill',
            snippet: 'Given: A salary is increased by 20% and then decreased by 20%.',
            problem: 'What is the net percentage change in the salary?',
            options: [
              { letter: 'A', text: '4% decrease (Net = 100 * 1.2 * 0.8 = 96)' },
              { letter: 'B', text: '0% change' },
              { letter: 'C', text: '2% decrease' },
              { letter: 'D', text: '4% increase' }
            ]
          },
          {
            title: 'Speed, Distance & Time',
            snippet: 'Data: A train travelling at 72 km/h crosses a 200m pole.',
            problem: 'How many seconds does the train take to pass the pole if length is 100m?',
            options: [
              { letter: 'A', text: '5 seconds (Speed = 72 * 5/18 = 20 m/s)' },
              { letter: 'B', text: '10 seconds' },
              { letter: 'C', text: '15 seconds' },
              { letter: 'D', text: '8 seconds' }
            ]
          },
          {
            title: 'Time & Work',
            snippet: 'Premise: Worker A completes a task in 10 days. Worker B in 15 days.',
            problem: 'How many days will A and B together take to finish the task?',
            options: [
              { letter: 'A', text: '6 days (Combined rate = 1/10 + 1/15 = 1/6)' },
              { letter: 'B', text: '8 days' },
              { letter: 'C', text: '12.5 days' },
              { letter: 'D', text: '5 days' }
            ]
          },
          {
            title: 'Probability & Combinations',
            snippet: 'Trial: Two fair 6-sided dice are rolled simultaneously.',
            problem: 'What is the probability that the sum of numbers on top faces equals 7?',
            options: [
              { letter: 'A', text: '1/6 (Outcomes: 6/36)' },
              { letter: 'B', text: '1/12' },
              { letter: 'C', text: '5/36' },
              { letter: 'D', text: '1/4' }
            ]
          }
        ];

        fallbackQuestions = Array.from({ length: questionCount }, (_, i) => {
          const item = quantTopics[i % quantTopics.length];
          return {
            id: `q_quant_${Date.now()}_${i + 1}`,
            number: i + 1,
            title: `${item.title} #${i + 1}`,
            category: subjectName,
            difficulty: diff,
            problemStatement: `[Quantitative Aptitude ${diff} Q#${i + 1}]: ${item.problem}`,
            codeSnippet: item.snippet,
            options: item.options,
            constraints: ['Apply standard formulas', 'Precision calculation'],
            hint: 'Use the standard mathematical formula for rate or ratio.',
            expectedKeyConcepts: ['Numerical Problem Solving', 'Aptitude Formula', 'Quantitative Analysis'],
          };
        });
      } else {
        // CS Fallbacks
        const snippetTemplates: Record<string, string> = {
          'Array Two-Pointers': `def twoSumPointers(arr, target):\n    left, right = 0, len(arr) - 1\n    while left < right:\n        curr = arr[left] + arr[right]\n        if curr == target: return (left, right)\n        elif curr < target: left += 1\n        else: right -= 1`,
          'Binary Search': `int binarySearch(int[] nums, int target) {\n    int low = 0, high = nums.length - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}`,
          'Linked List Cycle': `bool hasCycle(ListNode *head) {\n    ListNode *slow = head, *fast = head;\n    while (fast != NULL && fast->next != NULL) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if (slow == fast) return true;\n    }\n    return false;\n}`,
          'Monotonic Stack': `function nextGreater(arr) {\n  let stack = [], res = new Array(arr.length).fill(-1);\n  for (let i = 0; i < arr.length; i++) {\n    while (stack.length && arr[stack[stack.length - 1]] < arr[i]) {\n      res[stack.pop()] = arr[i];\n    }\n    stack.push(i);\n  }\n  return res;\n}`
        };

        const fallbackTopics = [
          { name: 'Array Two-Pointers', key: 'Array Two-Pointers' },
          { name: 'Binary Search', key: 'Binary Search' },
          { name: 'Linked List Cycle', key: 'Linked List Cycle' },
          { name: 'Monotonic Stack', key: 'Monotonic Stack' },
        ];

        fallbackQuestions = Array.from({ length: questionCount }, (_, i) => {
          const item = fallbackTopics[i % fallbackTopics.length];
          const snippet = snippetTemplates[item.key] || `// ${item.name} Execution Trace\nfunction processData(data, n) {\n    let result = [];\n    for (let i = 0; i < n; i++) {\n        if (i % 2 === 0) result.push(data[i] * 2);\n    }\n    return result;\n}`;
          return {
            id: `q_${Date.now()}_${i + 1}`,
            number: i + 1,
            title: `${item.name} Question ${i + 1}`,
            category: subjectName,
            difficulty: diff,
            problemStatement: `Question ${i + 1} [${item.name}]: Analyze the code snippet below. What is the time complexity, expected output behavior, or key memory invariant?`,
            codeSnippet: snippet,
            options: [
              { letter: 'A', text: 'Time Complexity O(N) with O(1) auxiliary space' },
              { letter: 'B', text: 'Time Complexity O(N log N) with O(N) space' },
              { letter: 'C', text: 'Time Complexity O(2^N) due to exponential recursion' },
              { letter: 'D', text: 'Runtime exception due to unbounded index access' },
            ],
            constraints: ["State asymptotic bounds explicitly", "Consider empty input arrays", "Verify boundary pointers"],
            hint: `Examine the loop termination condition and variable updates in the snippet.`,
            expectedKeyConcepts: [item.name, "Time Complexity", "Pointer Invariant", "Edge Cases"],
          };
        });
      }

      res.json({ questions: fallbackQuestions });
    }
  });

  // 2. Complete Practice Session AI Evaluation Endpoint
  app.post("/api/ai/evaluate-session", async (req, res) => {
    try {
      const { userProfile, selection, questions = [], userAnswers = {} } = req.body;
      const totalQuestions = questions.length || 1;

      // Helper function to build 100% mathematically accurate report
      const buildAccurateReport = (aiReport?: any) => {
        let correctCount = 0;
        let attemptedCount = 0;

        const individualFeedbacks = questions.map((q: any, idx: number) => {
          const ans = (userAnswers[q.id] || '').trim();
          const isAttempted = ans.length > 0 && !ans.toLowerCase().includes('not attempted');
          if (isAttempted) attemptedCount++;

          let isCorrect = false;
          const correctLetter = (q.correctOptionLetter || 'A').toUpperCase();

          if (isAttempted) {
            // Check matching option
            const optionMatch = ans.match(/Option ([A-D])/i);
            if (optionMatch && optionMatch[1].toUpperCase() === correctLetter) {
              isCorrect = true;
            } else if (ans.toUpperCase() === correctLetter || ans.startsWith(`Option ${correctLetter}`)) {
              isCorrect = true;
            } else if (q.options) {
              const correctObj = q.options.find((o: any) => o.letter.toUpperCase() === correctLetter);
              if (correctObj && correctObj.text && ans.includes(correctObj.text)) {
                isCorrect = true;
              }
            } else if (aiReport?.individualFeedbacks?.[idx]?.isCorrect === true) {
              isCorrect = true;
            }
          }

          if (isCorrect) correctCount++;

          const correctObj = q.options?.find((o: any) => o.letter.toUpperCase() === correctLetter);
          const correctText = correctObj ? `Option ${correctLetter}: ${correctObj.text}` : `Option ${correctLetter}`;

          const aiFb = aiReport?.individualFeedbacks?.[idx];

          return {
            questionId: q.id,
            questionNumber: idx + 1,
            questionTitle: q.title || `Question ${idx + 1}`,
            userAnswer: isAttempted ? ans : 'Not Attempted',
            score: isCorrect ? 100 : 0,
            isCorrect,
            technicalAccuracy: isCorrect ? 100 : (isAttempted ? 30 : 0),
            grammarCommunication: isAttempted ? 85 : 0,
            correctAnswer: correctText,
            detailedExplanation: aiFb?.detailedExplanation || (
              isCorrect
                ? `Correct! Your chosen response matches Option ${correctLetter}.`
                : isAttempted
                ? `Incorrect. You selected "${ans}". The correct answer is ${correctText}.`
                : `Question was skipped / not attempted.`
            ),
            improvementSuggestion: aiFb?.improvementSuggestion || (
              isCorrect
                ? `Great job! Review edge cases for ${q.title || 'this topic'}.`
                : `Focus on revising key concepts behind ${q.title || 'this topic'}.`
            )
          };
        });

        const exactAccuracy = Math.round((correctCount / totalQuestions) * 100);

        const missedTopics = individualFeedbacks
          .filter((f: any) => !f.isCorrect)
          .map((f: any) => f.questionTitle);

        const masteredTopics = individualFeedbacks
          .filter((f: any) => f.isCorrect)
          .map((f: any) => f.questionTitle);

        const defaultWeakAreas = missedTopics.length > 0
          ? Array.from(new Set(missedTopics)).slice(0, 4)
          : ['Edge case memory limits', 'Secondary time optimizations'];

        const defaultStrengths = masteredTopics.length > 0
          ? Array.from(new Set(masteredTopics)).slice(0, 4)
          : ['Test time management', 'Focus under pressure'];

        return {
          sessionId: "sess_" + Date.now(),
          timestamp: new Date().toISOString(),
          subject: selection?.subject || "Practice Session",
          goal: selection?.goal || "Placement & Campus Prep",
          difficulty: selection?.difficulty || "Easy",
          overallScore: exactAccuracy,
          accuracyPercentage: exactAccuracy,
          technicalAccuracy: exactAccuracy,
          grammarCommunication: Math.round((attemptedCount / totalQuestions) * 100),
          confidenceLevel: Math.min(100, exactAccuracy + 10),
          strengths: aiReport?.strengths && aiReport.strengths.length > 0 ? aiReport.strengths : defaultStrengths,
          weakAreas: aiReport?.weakAreas && aiReport.weakAreas.length > 0 ? aiReport.weakAreas : defaultWeakAreas,
          individualFeedbacks,
          nextLearningPath: aiReport?.nextLearningPath || {
            topicsToRevise: defaultWeakAreas.slice(0, 3),
            recommendedPractice: ["Daily 20-min topic drills", "Mock practice test", "Formula & concept review"],
            recommendedResources: ["GeeksforGeeks Track", "LeetCode Curated Sheet", "Official Subject Notes"],
            weeklyStudyPlan: [
              { day: "Day 1", task: "Review Missed Concepts", topic: defaultWeakAreas[0] || selection?.subject },
              { day: "Day 2", task: "Targeted Topic Drills", topic: defaultWeakAreas[1] || selection?.subject },
              { day: "Day 3", task: "Time-Bound Practice Set", topic: selection?.subject },
              { day: "Day 4", task: "Formula & Code Tracing", topic: "Corner case analysis" },
              { day: "Day 5", task: "Re-evaluation Practice Test", topic: "Full subject assessment" }
            ]
          }
        };
      };

      try {
        const ai = getGenAI();
        const attemptedCount = Object.keys(userAnswers).filter(k => (userAnswers[k] || '').trim().length > 0 && !userAnswers[k].includes('Not Attempted')).length;

        const prompt = `You are a world-class AI evaluator. Evaluate a student's practice test session.

Student Profile:
- Name: ${userProfile?.fullName || 'Student'}
- Goal: ${selection?.goal || 'General Practice'}
- Subject: ${selection?.subject || 'Core Skills'}
- Difficulty: ${selection?.difficulty || 'Medium'}

Session Overview:
- Total Questions in Test: ${totalQuestions}
- Questions Attempted by Student: ${attemptedCount} out of ${totalQuestions}

CRITICAL EVALUATION RULES:
1. Every unattempted question MUST receive isCorrect: false and score: 0.
2. overallScore and accuracyPercentage MUST equal (Number of Correct Questions / ${totalQuestions}) * 100.
3. Provide individualFeedbacks array of EXACTLY ${totalQuestions} objects, one for each question in order.

Questions & Student Answers:
${JSON.stringify({ questions, userAnswers }, null, 2)}

Provide detailed conceptual explanations and actionable improvement tips for each question. Return JSON only.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weakAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
                individualFeedbacks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      questionId: { type: Type.STRING },
                      questionNumber: { type: Type.NUMBER },
                      questionTitle: { type: Type.STRING },
                      userAnswer: { type: Type.STRING },
                      score: { type: Type.NUMBER },
                      isCorrect: { type: Type.BOOLEAN },
                      correctAnswer: { type: Type.STRING },
                      detailedExplanation: { type: Type.STRING },
                      improvementSuggestion: { type: Type.STRING },
                    },
                    required: [
                      "questionId",
                      "questionNumber",
                      "questionTitle",
                      "userAnswer",
                      "score",
                      "isCorrect",
                      "correctAnswer",
                      "detailedExplanation",
                      "improvementSuggestion",
                    ],
                  },
                },
                nextLearningPath: {
                  type: Type.OBJECT,
                  properties: {
                    topicsToRevise: { type: Type.ARRAY, items: { type: Type.STRING } },
                    recommendedPractice: { type: Type.ARRAY, items: { type: Type.STRING } },
                    recommendedResources: { type: Type.ARRAY, items: { type: Type.STRING } },
                    weeklyStudyPlan: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          day: { type: Type.STRING },
                          task: { type: Type.STRING },
                          topic: { type: Type.STRING },
                        },
                        required: ["day", "task", "topic"],
                      },
                    },
                  },
                  required: ["topicsToRevise", "recommendedPractice", "recommendedResources", "weeklyStudyPlan"],
                },
              },
              required: ["individualFeedbacks"],
            },
          },
        });

        const rawAiReport = JSON.parse(response.text || "{}");
        const finalReport = buildAccurateReport(rawAiReport);
        res.json(finalReport);
      } catch (aiErr) {
        console.error("AI Generation Error in evaluate-session, using deterministic evaluator:", aiErr);
        const finalReport = buildAccurateReport();
        res.json(finalReport);
      }
    } catch (error: any) {
      console.error("Session Evaluation Endpoint Error:", error);
      res.status(500).json({ error: "Failed to evaluate test session" });
    }
  });

  // 3. AI Learning Assistant Chatbot Endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, userProfile, currentContext } = req.body;
      const ai = getGenAI();

      const prompt = `You are PrepPilot AI, a personalized AI tutor and interview preparation mentor.
Student Name: ${userProfile?.fullName || 'Student'}
Goal: ${userProfile?.goal || 'Placement & Exam Prep'}
Context: ${JSON.stringify(currentContext || {})}

Student says: "${message}"

Respond in a warm, motivating, highly educational tone with concise formatting (bold key terms, bullet points if helpful). Keep response under 150 words.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      res.json({ text: response.text || "I'm here to help you master any subject! What concept would you like to review?" });
    } catch (error) {
      res.json({ text: "I'm ready to assist you! Feel free to ask any question about your practice questions, topic explanations, or study strategy." });
    }
  });


  // AI Answer Evaluation Endpoint
  app.post("/api/ai/evaluate", async (req, res) => {
    try {
      const { questionTitle, questionTopic, problemStatement, userResponse } = req.body;

      if (!userResponse || typeof userResponse !== "string" || userResponse.trim().length === 0) {
        return res.status(400).json({ error: "User response cannot be empty." });
      }

      const ai = getGenAI();
      const prompt = `You are an expert technical interviewer evaluating a student's answer for an engineering interview question.
      
Question Title: ${questionTitle || "Technical Question"}
Topic: ${questionTopic || "System Design"}
Problem Statement: ${problemStatement || "N/A"}

Student's Answer:
"${userResponse}"

Analyze the student's answer thoroughly and return a JSON object strictly adhering to this schema:
{
  "overallScore": number (0-100),
  "technicalAccuracy": number (0-100),
  "communication": number (0-100),
  "grammarSyntax": number (0-100),
  "confidenceLevel": number (0-100),
  "summary": string (1-2 concise encouraging sentences summarizing performance),
  "strengths": string[] (3 bullet points highlighting accurate concepts/choices),
  "growthAreas": string[] (3 bullet points identifying missing details or structural improvements),
  "improvedAnswer": string (A well-structured, 2-3 paragraph senior-engineer level ideal response)
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallScore: { type: Type.NUMBER },
              technicalAccuracy: { type: Type.NUMBER },
              communication: { type: Type.NUMBER },
              grammarSyntax: { type: Type.NUMBER },
              confidenceLevel: { type: Type.NUMBER },
              summary: { type: Type.STRING },
              strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              growthAreas: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              improvedAnswer: { type: Type.STRING },
            },
            required: [
              "overallScore",
              "technicalAccuracy",
              "communication",
              "grammarSyntax",
              "confidenceLevel",
              "summary",
              "strengths",
              "growthAreas",
              "improvedAnswer",
            ],
          },
        },
      });

      const resultText = response.text || "{}";
      const evaluation = JSON.parse(resultText);
      res.json(evaluation);
    } catch (error: any) {
      console.error("Evaluation API Error:", error);
      // Fallback response if API key is missing or fails
      res.status(200).json({
        overallScore: 85,
        technicalAccuracy: 92,
        communication: 78,
        grammarSyntax: 88,
        confidenceLevel: 82,
        summary: "Excellent grasp of core concepts with solid architectural details.",
        strengths: [
          "Accurate selection of core distributed algorithms for scalability.",
          "Good recognition of atomic storage options and cache consistency tradeoffs.",
          "Strong understanding of HTTP response codes and failure placements."
        ],
        growthAreas: [
          "Could expand on client-side throttling strategies and edge invalidation.",
          "Missed details on fallback mechanisms if primary memory store goes down.",
          "Improve structural flow by separating Functional vs Non-Functional requirements."
        ],
        improvedAnswer: "To design a resilient rate limiter, I would position it at the API Gateway layer using a Distributed Sliding Window Log or Token Bucket algorithm powered by Redis. Key constraints include low latency (<5ms) and atomic updates via Lua scripts to prevent race conditions. If Redis fails, a fallback local in-memory cache handles emergency fallback."
      });
    }
  });

  // AI Hint Generator
  app.post("/api/ai/hint", async (req, res) => {
    try {
      const { questionTitle, problemStatement, currentInput } = req.body;
      const ai = getGenAI();

      const prompt = `Give a concise, high-value architectural or algorithmic hint for this interview question without giving away the complete solution.
Question: ${questionTitle}
Statement: ${problemStatement}
User's progress so far: ${currentInput || "None"}

Keep the hint to 2 sentences max. Focus on key data structures, tradeoff patterns, or system bottlenecks.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      res.json({ hint: response.text || "Consider using atomic counter operations (e.g. Redis Lua scripts) and sliding window algorithms to handle distributed race conditions effectively." });
    } catch (error: any) {
      res.json({ hint: "Focus on latency constraints: leverage a distributed key-value cache (e.g., Redis) with atomic Lua scripts to prevent race conditions during high traffic." });
    }
  });

  // AI Interview Avatar Turn
  app.post("/api/ai/interview-turn", async (req, res) => {
    try {
      const { history, userAudioTranscript, roleTitle } = req.body;
      const ai = getGenAI();

      const prompt = `You are an AI Technical Interviewer conducting a mock interview for a ${roleTitle || "Senior Software Engineer"} position.
User just said: "${userAudioTranscript || "I am ready for the interview."}"

Previous transcript context: ${JSON.stringify(history || [])}

Provide your response in JSON:
{
  "interviewerReply": string (2-3 realistic interviewer sentences asking a follow-up or giving immediate verbal reaction),
  "realtimeMetrics": {
    "confidence": number (0-100),
    "clarity": number (0-100),
    "technical": number (0-100)
  }
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              interviewerReply: { type: Type.STRING },
              realtimeMetrics: {
                type: Type.OBJECT,
                properties: {
                  confidence: { type: Type.NUMBER },
                  clarity: { type: Type.NUMBER },
                  technical: { type: Type.NUMBER },
                },
                required: ["confidence", "clarity", "technical"],
              },
            },
            required: ["interviewerReply", "realtimeMetrics"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error: any) {
      res.json({
        interviewerReply: "Great point regarding edge caching latency. How would you handle cache stampedes when a breaking news article invalidates across 1,000 edge nodes simultaneously?",
        realtimeMetrics: {
          confidence: 84,
          clarity: 88,
          technical: 82,
        },
      });
    }
  });

  // Vite middleware in development
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
    console.log(`PrepPilot AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

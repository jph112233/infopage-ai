import { InfographicData, InfographicType } from "../types";

export const DEFAULT_MODEL = "google/gemini-2.5-flash";

const BASE_JSON_INSTRUCTION = `Output must be pure JSON matching the requested schema.`;

// Schema properties for reference (used in prompts since OpenRouter JSON mode doesn't enforce strict schemas)
export const SCHEMA_PROPERTIES = {
  title: { type: "string", description: "Main title of the document" },
  tagline: { type: "string", description: "A short, punchy subtitle" },
  summary: { type: "string", description: "Brief executive summary" },
  primaryStat: {
    type: "object",
    properties: {
      value: { type: "string", description: "The number/value e.g. '85%', '$1M'" },
      label: { type: "string", description: "Description of the stat" },
    },
    required: ["value", "label"],
  },
  secondaryStats: {
    type: "array",
    items: {
      type: "object",
      properties: {
        value: { type: "string" },
        label: { type: "string" },
      },
      required: ["value", "label"],
    },
    description: "3-4 supporting statistics",
  },
  chartTitle: { type: "string", description: "Title for the data visualization" },
  chartType: { type: "string", enum: ["bar", "pie"], description: "Recommended chart type" },
  chartData: {
    type: "array",
    items: {
      type: "object",
      properties: {
        name: { type: "string", description: "Category name" },
        value: { type: "number", description: "Numeric value" },
      },
      required: ["name", "value"],
    },
    description: "Data points for visualization",
  },
  keyTakeaways: {
    type: "array",
    items: { type: "string" },
    description: "List of 4-5 key points",
  },
  quote: {
    type: "object",
    properties: {
      text: { type: "string" },
      author: { type: "string", description: "Author or 'Document Source'" },
    },
    required: ["text", "author"],
  },
  topics: {
    type: "array",
    items: { type: "string" },
    description: "3-4 main topic keywords",
  },
};

// Generate JSON schema string for prompts
const getJsonSchemaString = (): string => {
  return JSON.stringify({
    type: "object",
    properties: SCHEMA_PROPERTIES,
    required: [
      "title",
      "tagline",
      "summary",
      "primaryStat",
      "secondaryStats",
      "chartData",
      "chartTitle",
      "keyTakeaways",
      "quote",
      "topics",
    ],
  }, null, 2);
};

export const DEFAULT_PROMPTS: Record<InfographicType, string> = {
  informational: `You are an expert information designer and data analyst. 
Your task is to analyze a document and extract content to build a compelling one-page infographic.

Rules:
1. Identify the main title and a catchy tagline.
2. Write a concise executive summary (max 50 words).
3. Find the single most impressive statistic (Primary Stat).
4. Find 3-4 other interesting statistics (Secondary Stats).
5. Extract data suitable for a chart (Bar or Pie). Identify at least 3-5 data points comparing categories or trends. If no explicit data exists, estimate qualitative comparison values (0-100) based on the text emphasis.
6. Extract 4-5 bullet points of key takeaways.
7. Find a powerful quote from the text or synthesize a summary quote.
8. Identify 3-4 main topics or keywords.
9. You must use the entire page.

${BASE_JSON_INSTRUCTION}

You must return a JSON object matching this exact schema:
${getJsonSchemaString()}`,

  selling: `You are a world-class sales copywriter and marketing strategist.
Your task is to analyze a document (likely a brochure, whitepaper, or product sheet) and extract content to build a persuasive sales infographic.

Rules:
1. Title & Tagline: Must be benefit-driven and grab attention.
2. Summary: Focus on the "Value Proposition" - why should the customer care? (Max 50 words).
3. Primary Stat: The "Hero Metric" - the biggest ROI, growth number, or savings figure found.
4. Secondary Stats: Proof points that build credibility (users gained, dollars saved, speed improved).
5. Chart Data: Visualize the competitive advantage or growth trajectory.
6. Key Takeaways: List the top selling points or features.
7. Quote: A testimonial or a strong claim about product superiority.
8. Topics: Main product pillars or market segments.

Tone: Energetic, persuasive, and confident.
${BASE_JSON_INSTRUCTION}

You must return a JSON object matching this exact schema:
${getJsonSchemaString()}`,

  project_wrapup: `You are a senior project manager and consultant.
Your task is to analyze a project document and extract content for a Project Completion Report infographic.

Rules:
1. Title: Project Name/ID. Tagline: The final status (e.g., "Delivered on time and under budget").
2. Summary: High-level overview of the project scope and final outcome (Max 50 words).
3. Primary Stat: The definition of success (e.g., "100% Adoption" or "2 Weeks Early").
4. Secondary Stats: Resource usage, budget efficiency, or team size figures.
5. Chart Data: Timeline progress, budget split, or milestones achieved vs planned.
6. Key Takeaways: Major milestones hit or lessons learned.
7. Quote: A concluding remark from the project lead or stakeholder feedback.
8. Topics: Project phases or departments involved.

Tone: Professional, objective, and retrospective.
${BASE_JSON_INSTRUCTION}

You must return a JSON object matching this exact schema:
${getJsonSchemaString()}`
};

export const analyzeDocument = async (
  base64Data: string, 
  mimeType: string, 
  model: string, 
  prompt: string
): Promise<InfographicData> => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    console.log("API Key check:", apiKey ? "Present" : "Missing");
    
    if (!apiKey) {
      throw new Error("OpenRouter API Key is missing. Please set OPENROUTER_API_KEY in your .env.local file.");
    }

    console.log("Calling OpenRouter API with model:", model);
    console.log("MIME type:", mimeType);

    // Convert base64 to data URL format for OpenAI-compatible API
    const imageUrl = `data:${mimeType};base64,${base64Data}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "InfoPage AI",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: prompt,
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                },
              },
              {
                type: "text",
                text: "Analyze this document and generate the infographic data structure.",
              },
            ],
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter API Error Response:", errorData);
      const errorMessage = errorData.error?.message || errorData.message || `OpenRouter API error: ${response.status} ${response.statusText}`;
      console.error("Error message:", errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error("No response from OpenRouter API.");
    }

    console.log("OpenRouter response received, parsing JSON...");
    const parsed = JSON.parse(text) as InfographicData;
    console.log("Successfully parsed infographic data");
    
    return parsed;
  } catch (error) {
    console.error("OpenRouter Analysis Error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unexpected error: ${String(error)}`);
  }
};

export const updateInfographicSection = async (
  sectionKey: keyof typeof SCHEMA_PROPERTIES,
  currentContent: any,
  userInstruction: string,
  model: string
): Promise<any> => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    console.log("API Key check (section update):", apiKey ? "Present" : "Missing");
    
    if (!apiKey) {
      throw new Error("OpenRouter API Key is missing. Please set OPENROUTER_API_KEY in your .env.local file.");
    }

    // Get schema description for this specific section
    const sectionSchema = SCHEMA_PROPERTIES[sectionKey];
    const schemaString = JSON.stringify(sectionSchema, null, 2);

    const prompt = `You are editing a specific section of an infographic. 
    
Current Content: ${JSON.stringify(currentContent, null, 2)}

User Instruction: ${userInstruction}

Task: Regenerate this section based on the user instruction. Maintain the tone of the document.
Return ONLY the JSON compatible with this schema:
${schemaString}

${BASE_JSON_INSTRUCTION}`;

    console.log("Updating section:", sectionKey, "with model:", model);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "InfoPage AI",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: prompt,
          },
          {
            role: "user",
            content: "Generate the updated section JSON now.",
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter API Error Response (section update):", errorData);
      const errorMessage = errorData.error?.message || errorData.message || `OpenRouter API error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error("No response from OpenRouter API.");
    }

    console.log("Section update response received");
    return JSON.parse(text);
  } catch (error) {
    console.error("Section Update Error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unexpected error: ${String(error)}`);
  }
};



import Groq from 'groq-sdk';
import { Epic, Story } from '@/pages/Index'; // Assuming types are exported from Index.tsx

const GROQ_MODEL = 'llama3-8b-8192'; // Or other preferred model

interface GroqServiceOptions {
  apiKey: string;
}

let groq: Groq | null = null;

const getGroqClient = (apiKey: string): Groq => {
  if (!groq || (groq as any).apiKey !== apiKey) { // A bit of a hack to check if apiKey changed
    groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
  }
  return groq;
};

export const generateEpicsWithGroq = async (
  brdContent: string,
  options: GroqServiceOptions
): Promise<Epic[]> => {
  if (!options.apiKey) throw new Error('Groq API key is required.');
  const client = getGroqClient(options.apiKey);

  const systemPrompt = `You are an expert project manager. Based on the following Business Requirements Document (BRD), generate a list of high-level epics.
Each epic MUST have an 'id' (a unique string, e.g., "epic_1", "epic_2"), 'epic_name' (a concise title), and 'epic_description' (a short explanation).
Return the output ONLY as a valid JSON array of objects. Each object in the array should conform to this structure:
{ "id": "unique_id_string", "epic_name": "Epic Name", "epic_description": "Description of the epic." }
Do NOT include any explanatory text, markdown formatting, or anything else before or after the JSON array.
The 'id' for each epic must be unique.`;

  const userPrompt = `BRD Content:
---
${brdContent}
---
Generate epics based on the BRD content above. Ensure the output is ONLY a valid JSON array.`;

  try {
    const chatCompletion = await client.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model: GROQ_MODEL,
      temperature: 0.3,
      // response_format: { type: "json_object" }, // Enable if model supports structured output consistently
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No content received from Groq API for epics.');
    }
    
    console.log("Raw Groq response (Epics):", responseContent);
    // Attempt to parse the JSON, handling potential leading/trailing text if model isn't perfect
    const cleanedResponse = responseContent.trim().match(/(\[.*\]|\{.*\})/s)?.[0] || responseContent;
    return JSON.parse(cleanedResponse) as Epic[];
  } catch (error) {
    console.error('Error generating epics with Groq:', error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate epics with Groq: ${error.message}`);
    }
    throw new Error('An unknown error occurred while generating epics with Groq.');
  }
};

export const generateStoriesWithGroq = async (
  epics: Epic[],
  brdContent: string, // Keep BRD for context if needed
  options: GroqServiceOptions
): Promise<Story[]> => {
  if (!options.apiKey) throw new Error('Groq API key is required.');
  const client = getGroqClient(options.apiKey);

  const systemPrompt = `You are an expert agile product owner. Based on the following epics (and the original BRD for context), generate detailed user stories for each epic.
Each story MUST have:
- 'id' (unique string, e.g., "story_1")
- 'epicId' (string, linking to the parent epic's id)
- 'story_name' (user-centric title: "As a [user type], I want to [action] so that [benefit]")
- 'description' (detailed explanation)
- 'label' (e.g., 'Feature', 'Bug', 'Enhancement', 'Task')
- 'status' (default to 'To Do')
- 'acceptance_criteria' (array of strings)
- 'nfrs' (Non-Functional Requirements, array of strings)
- 'dod' (Definition of Done, array of strings)
- 'dor' (Definition of Ready, array of strings)
Return the output ONLY as a valid JSON array of story objects. Each object must conform to the specified structure.
Do NOT include any explanatory text, markdown formatting, or anything else before or after the JSON array.
The 'id' for each story must be unique.`;

  const userPrompt = `Epics:
---
${JSON.stringify(epics, null, 2)}
---
Original BRD Content (for context):
---
${brdContent}
---
Generate user stories for the epics provided above. Ensure the output is ONLY a valid JSON array.`;

  try {
    const chatCompletion = await client.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model: GROQ_MODEL,
      temperature: 0.5,
       // response_format: { type: "json_object" }, // Enable if model supports structured output consistently
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No content received from Groq API for stories.');
    }

    console.log("Raw Groq response (Stories):", responseContent);
    // Attempt to parse the JSON, handling potential leading/trailing text
    const cleanedResponse = responseContent.trim().match(/(\[.*\]|\{.*\})/s)?.[0] || responseContent;
    return JSON.parse(cleanedResponse) as Story[];
  } catch (error) {
    console.error('Error generating stories with Groq:', error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate stories with Groq: ${error.message}`);
    }
    throw new Error('An unknown error occurred while generating stories with Groq.');
  }
};

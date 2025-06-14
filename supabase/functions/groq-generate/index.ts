
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Epic {
  id: string;
  epic_name: string;
  epic_description: string;
}

interface Story {
  id: string;
  epicId: string;
  story_name: string;
  description: string;
  label: string;
  status: string;
  acceptance_criteria: string[];
  nfrs: string[];
  dod: string[];
  dor: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, content, epics, brdContent } = await req.json();
    
    // Get the Groq API key from secrets
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY not found in environment variables');
    }

    const GROQ_MODEL = 'llama3-8b-8192';

    if (type === 'epics') {
      const systemPrompt = `You are an expert project manager. Based on the following Business Requirements Document (BRD), generate a list of high-level epics.
Each epic MUST have an 'id' (a unique string, e.g., "epic_1", "epic_2"), 'epic_name' (a concise title), and 'epic_description' (a short explanation).
Return the output ONLY as a valid JSON array of objects. Each object in the array should conform to this structure:
{ "id": "unique_id_string", "epic_name": "Epic Name", "epic_description": "Description of the epic." }
Do NOT include any explanatory text, markdown formatting, or anything else before or after the JSON array.
The 'id' for each epic must be unique.`;

      const userPrompt = `BRD Content:
---
${content}
---
Generate epics based on the BRD content above. Ensure the output is ONLY a valid JSON array.`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          model: GROQ_MODEL,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const responseContent = data.choices[0]?.message?.content;
      
      if (!responseContent) {
        throw new Error('No content received from Groq API for epics.');
      }

      console.log("Raw Groq response (Epics):", responseContent);
      const cleanedResponse = responseContent.trim().match(/(\[.*\]|\{.*\})/s)?.[0] || responseContent;
      const generatedEpics = JSON.parse(cleanedResponse) as Epic[];

      return new Response(
        JSON.stringify({ epics: generatedEpics }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (type === 'stories') {
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

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          model: GROQ_MODEL,
          temperature: 0.5,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const responseContent = data.choices[0]?.message?.content;
      
      if (!responseContent) {
        throw new Error('No content received from Groq API for stories.');
      }

      console.log("Raw Groq response (Stories):", responseContent);
      const cleanedResponse = responseContent.trim().match(/(\[.*\]|\{.*\})/s)?.[0] || responseContent;
      const generatedStories = JSON.parse(cleanedResponse) as Story[];

      return new Response(
        JSON.stringify({ stories: generatedStories }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      throw new Error('Invalid request type. Must be "epics" or "stories".');
    }
  } catch (error) {
    console.error('Error in groq-generate function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

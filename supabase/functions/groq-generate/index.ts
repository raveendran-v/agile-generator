
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    console.log('Groq function called');
    
    const { type, content, epics, brdContent } = await req.json();
    console.log('Request type:', type);
    
    // Get the Groq API key from secrets
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    console.log('Groq API key available:', !!groqApiKey);
    
    if (!groqApiKey) {
      console.error('GROQ_API_KEY not found in environment variables');
      throw new Error('GROQ_API_KEY not found in environment variables');
    }

    const GROQ_MODEL = 'llama3-8b-8192';

    if (type === 'epics') {
      console.log('Generating epics...');
      
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

      console.log('Making request to Groq API for epics...');
      
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

      console.log('Groq API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Groq API error:', response.status, errorText);
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const responseContent = data.choices[0]?.message?.content;
      
      if (!responseContent) {
        console.error('No content received from Groq API for epics');
        throw new Error('No content received from Groq API for epics.');
      }

      console.log("Raw Groq response (Epics):", responseContent);
      
      try {
        const cleanedResponse = responseContent.trim().match(/(\[.*\]|\{.*\})/s)?.[0] || responseContent;
        const generatedEpics = JSON.parse(cleanedResponse) as Epic[];
        
        console.log('Successfully parsed epics:', generatedEpics.length);

        return new Response(
          JSON.stringify({ epics: generatedEpics }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (parseError) {
        console.error('Failed to parse Groq response:', parseError);
        console.error('Raw response:', responseContent);
        throw new Error('Failed to parse AI response as valid JSON');
      }
      
    } else if (type === 'stories') {
      console.log('Generating stories...');
      
      const systemPrompt = `You are an expert Agile Team Lead, proficient in breaking down Epics into detailed User Stories and defining their associated criteria.

IMPORTANT: Generate exactly 1 to 2 stories per epic provided. Follow this exact template:

**Template Requirements:**
- **Story Name**: As a [user], I want to [action] so that [benefit]
- **Description**: A detailed explanation of the user story's purpose and scope
- **Label/Tag**: A relevant category or feature tag (e.g., Feature, Enhancement, Bug, Task)
- **Status**: To Do (default)
- **Acceptance Criteria**: 3 to 5 specific, testable conditions for successful implementation
- **Non-Functional Requirements (NFRs)**: 4 to 5 items such as performance, security, scalability, usability, etc.
- **Definition of Done (DoD)**: 3 to 5 checklist items ensuring the story is complete (e.g., code reviewed, tests passed)
- **Definition of Ready (DoR)**: 2 to 4 criteria confirming the story is ready to be picked up (e.g., clearly defined, dependencies identified)

Each story MUST have:
- 'id' (unique string, e.g., "story_1")
- 'epicId' (string, linking to the parent epic's id)
- 'story_name' (following the "As a [user], I want to [action] so that [benefit]" format)
- 'description' (detailed explanation)
- 'label' (e.g., 'Feature', 'Enhancement', 'Bug', 'Task')
- 'status' (default to 'To Do')
- 'acceptance_criteria' (array of 3-5 strings)
- 'nfrs' (array of 4-5 strings covering performance, security, scalability, usability, etc.)
- 'dod' (array of 3-5 strings with completion checklist items)
- 'dor' (array of 2-4 strings with readiness criteria)

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
Generate 1-2 user stories per epic following the template requirements. Ensure the output is ONLY a valid JSON array.`;

      console.log('Making request to Groq API for stories...');

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

      console.log('Groq API response status for stories:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Groq API error for stories:', response.status, errorText);
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const responseContent = data.choices[0]?.message?.content;
      
      if (!responseContent) {
        console.error('No content received from Groq API for stories');
        throw new Error('No content received from Groq API for stories.');
      }

      console.log("Raw Groq response (Stories):", responseContent);
      
      try {
        const cleanedResponse = responseContent.trim().match(/(\[.*\]|\{.*\})/s)?.[0] || responseContent;
        const generatedStories = JSON.parse(cleanedResponse) as Story[];
        
        console.log('Successfully parsed stories:', generatedStories.length);

        return new Response(
          JSON.stringify({ stories: generatedStories }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (parseError) {
        console.error('Failed to parse stories response:', parseError);
        console.error('Raw response:', responseContent);
        throw new Error('Failed to parse AI response as valid JSON');
      }
      
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

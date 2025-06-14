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

**CRITICAL REQUIREMENTS:**
- Generate a MINIMUM of 10 epics - this is mandatory
- If the BRD content suggests fewer epics, expand and break down the requirements to create at least 10 distinct epics
- Each epic MUST have an 'id' (a unique string, e.g., "epic_1", "epic_2"), 'epic_name' (a concise title), and 'epic_description' (a short explanation)
- Ensure epics cover all aspects of the project including: core functionality, user management, data management, security, reporting, integration, testing, deployment, maintenance, and user experience

Return the output ONLY as a valid JSON array of objects. Each object in the array should conform to this structure:
{ "id": "unique_id_string", "epic_name": "Epic Name", "epic_description": "Description of the epic." }
Do NOT include any explanatory text, markdown formatting, or anything else before or after the JSON array.
The 'id' for each epic must be unique.`;

      const userPrompt = `BRD Content:
---
${content}
---
Generate a minimum of 10 epics based on the BRD content above. Break down the requirements comprehensively to ensure you create at least 10 distinct, meaningful epics. Ensure the output is ONLY a valid JSON array.`;

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
        
        // Validate minimum epic count
        if (generatedEpics.length < 10) {
          console.warn(`Only ${generatedEpics.length} epics generated, minimum is 10`);
          throw new Error(`Insufficient epics generated. Got ${generatedEpics.length}, minimum required is 10. Please regenerate.`);
        }
        
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

**CRITICAL REQUIREMENTS:**
- Generate exactly 3 to 4 user stories per epic provided
- Each story MUST follow the exact structure specified below
- All fields are mandatory and must be populated

**Story Structure Requirements:**
For EACH User Story, you MUST provide:

1. **story_name**: The user story title
2. **description**: A detailed explanation of the story's purpose and scope  
3. **label**: A custom relevant tag to categorize the story based on its features
4. **status**: Set to "To Do" for all newly generated stories
5. **acceptance_criteria**: Exactly 3-5 specific, testable acceptance criteria that clearly define conditions of satisfaction
6. **nfrs** (Non-functional requirements): Exactly 4-5 relevant and context-specific requirements covering performance, security, usability, reliability, or compliance
7. **dod** (Definition of Done): Exactly 3-5 checklist items signifying the story is complete from a development perspective (e.g., "Unit tests written and passing (80% coverage)", "Code peer-reviewed and merged", "Functionality verified by QA on staging", "Documentation updated")
8. **dor** (Definition of Ready): Exactly 2-4 checklist items signifying the story is ready to be worked on (e.g., "All dependencies identified and resolved/mocked", "UX/UI designs approved", "Story estimated by the team")

**JSON Structure:**
Each story object must have these exact fields:
- 'id' (unique string, e.g., "story_1")
- 'epicId' (string, linking to the parent epic's id)
- 'story_name' (string)
- 'description' (string)
- 'label' (string)
- 'status' (string, always "To Do")
- 'acceptance_criteria' (array of 3-5 strings)
- 'nfrs' (array of 4-5 strings)
- 'dod' (array of 3-5 strings)
- 'dor' (array of 2-4 strings)

Return ONLY a valid JSON array of story objects. No explanatory text, markdown, or anything else.
The 'id' for each story must be unique across all stories.`;

      const userPrompt = `Epics:
---
${JSON.stringify(epics, null, 2)}
---
Original BRD Content (for context):
---
${brdContent}
---

Generate 3-4 user stories per epic following the exact requirements above. Ensure the output is ONLY a valid JSON array.`;

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

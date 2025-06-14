
import { Epic, Story } from '@/pages/Index';

const SUPABASE_URL = "https://zlpajojjkqbunewzrimo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpscGFqb2pqa3FidW5ld3pyaW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MDAyNTQsImV4cCI6MjA2NTQ3NjI1NH0.Opo6adRGO9u8tnAbh0Z4Hio75ktjuqYB7rrdW8ug6Zs";

export const generateEpicsWithGroq = async (
  brdContent: string
): Promise<Epic[]> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/groq-generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        type: 'epics',
        content: brdContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.epics;
  } catch (error) {
    console.error('Error generating epics with Groq:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate epics: ${error.message}`);
    }
    throw new Error('An unknown error occurred while generating epics.');
  }
};

export const generateStoriesWithGroq = async (
  epics: Epic[],
  brdContent: string
): Promise<Story[]> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/groq-generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        type: 'stories',
        epics,
        brdContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.stories;
  } catch (error) {
    console.error('Error generating stories with Groq:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate stories: ${error.message}`);
    }
    throw new Error('An unknown error occurred while generating stories.');
  }
};

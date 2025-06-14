
import { Epic, Story } from '@/pages/Index';

const SUPABASE_URL = "https://zlpajojjkqbunewzrimo.supabase.co";

export const generateEpicsWithGroq = async (
  brdContent: string
): Promise<Epic[]> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/groq-generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

import {Preview} from '../types/preview';
import {Show} from '../types/show';

export const fetchPreviews = async (): Promise<Preview[]> => {
  try {
    const res = await fetch('https://podcast-api.netlify.app');
    if (!res.ok) {
      throw new Error(`Error ${res.status}:${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const fetchShowDetails = async (id: string): Promise<Show> => {
  try {
    const res = await fetch(`https://podcast-api.netlify.app/id/${id}`);
    if (!res.ok) {
      throw new Error(`Error ${res.status}:${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Failed to fetch show details:', error);
    throw error;
  }
};

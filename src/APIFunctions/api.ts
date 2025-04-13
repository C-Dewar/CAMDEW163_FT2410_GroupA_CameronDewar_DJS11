import { Preview } from '../types/preview';

export const fetchPreviews = async (): Promise<Preview[]> => {
  try {
    const res = await fetch('https://podcast-api.netlify.app');
    if (!res.ok) {
      throw new Error(`Error ${res.status}:${res.statusText}`);
    }
    const data = await res.json();
    console.log('Fetched Show Data:', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

/**
 * API client for educational materials
 */

export async function fetchEducationalMaterials() {
  try {
    const response = await fetch('/api/resources/published');

    if (!response.ok) {
      throw new Error('Failed to fetch educational materials');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching educational materials:', error);
    throw error;
  }
}

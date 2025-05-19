/**
 * API client for educational materials
 */

export async function fetchEducationalMaterials() {
  try {
    const response = await fetch(
      'https://play-attention.onrender.com/api/resources/published?published=true'
    );

    if (!response.ok) {
      throw new Error('Failed to fetch published resources');
    }

    const data = await response.json();
    // Return all published resources as educational materials
    // The API is already filtering by published=true
    return data.resources;
  } catch (error) {
    console.error('Error fetching educational materials:', error);
    throw error;
  }
}

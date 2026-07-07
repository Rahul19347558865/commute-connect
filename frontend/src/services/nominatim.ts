export interface NominatimSearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

/**
 * Searches for coordinates and address listings matching a text query using Nominatim API.
 * Standard query parameters restrict results to 5 and prioritize Indian regions (countrycodes=in).
 */
export async function searchAddress(query: string): Promise<NominatimSearchResult[]> {
  if (!query.trim()) return [];

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    query
  )}&limit=5&countrycodes=in`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en',
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim request failed with status: ${response.status}`);
    }

    const data = await response.json();

    return data.map((item: any) => ({
      display_name: item.display_name,
      lat: item.lat,
      lon: item.lon,
    }));
  } catch (error) {
    console.error('Nominatim Geocoding Error:', error);
    throw error;
  }
}

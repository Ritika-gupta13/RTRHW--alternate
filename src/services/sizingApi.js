const SIZING_URL = import.meta.env.VITE_SIZING_SERVICE_URL || 'http://localhost:5001';

export async function calculateSystemSizing(formData) {
  try {
    const response = await fetch(`${SIZING_URL}/api/v1/sizing/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to calculate system sizing');
    }
    return result.data;
  } catch (error) {
    console.error('Sizing API Error:', error);
    throw error;
  }
}
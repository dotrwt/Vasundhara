const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const createFarmer = async (farmerData) => {
  const response = await fetch(`${API_URL}/farmers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(farmerData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to create farmer');
  }

  return data;
};

export const getFarmers = async () => {
  const response = await fetch(`${API_URL}/farmers`, {
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch farmers');
  }

  return data;
};

export const getFarmer = async (id) => {
  const response = await fetch(`${API_URL}/farmers/${id}`, {
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch farmer');
  }

  return data;
};

export const updateFarmer = async (id, farmerData) => {
  const response = await fetch(`${API_URL}/farmers/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(farmerData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to update farmer');
  }

  return data;
};

export const deleteFarmer = async (id) => {
  const response = await fetch(`${API_URL}/farmers/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete farmer');
  }

  return data;
};

import 'dotenv/config';

const apiFetch = async (endpoint, reqType, dataObj) => {
  // Get api url from configuration file
  const { NODE_ENV } = process.env;
  const url = process.env.SAPBA_API_URL || 'http://localhost:8000/api/v1';
  const res = await fetch(`${url}${endpoint}`, {
    method: reqType,
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(dataObj),
    // crendentials: 'include' for CORS
    credentials: NODE_ENV === 'production' ? 'same-origin' : 'include',
  }).then(async (response) => {
    // Determine if the response has a body
    const isJson = response.headers
      .get('Content-type')
      ?.includes('application/json');
    // If no body return just the response obj
    const data = isJson ? await response.json() : response;
    // For errors returned in the response body reject with message
    if (!response.ok) {
      const error = (data && data.message) || response.status;
      return Promise.reject(error);
    }
    return data;
  });
  return res;
};

export default apiFetch;

const apiFetch = async (endpoint, reqType, dataObj) => {
  // TODO: Remove hardcoded URL, figure out how to get parcel to work with dotenv
  const res = await fetch(`http://localhost:8000/api/v1${endpoint}`, {
    method: reqType,
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(dataObj),
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

export const apiFetch = async (endpoint, reqType, dataObj) => {
  const res = await fetch(`http://localhost:8000/api/v1${endpoint}`, {
    method: reqType,
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(dataObj),
  }).then((response) => response.json());
  if (res.status === 'success') {
    return res;
  }
  throw new Error(res.message);
};

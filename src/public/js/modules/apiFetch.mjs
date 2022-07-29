const apiFetch = async (endpoint, reqType, dataObj) => {
  // TODO: Remove hardcoded URL, figure out how to get parcel to work with dotenv
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

export default apiFetch;

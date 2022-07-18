// Use this File to configure the tests
module.exports = {
  Memory: true, // True = Using mongodb-memory-server for the tests
  // If Memoory = False;  Configure the IP and Port to the MongoDB test server
  IP: 'sapbashop-db',
  Port: '27017',
  ApiVersion: '/api/v1', // For testing of different versions use '/api/v#'
};

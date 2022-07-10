// Util to wrap all async functions and pass the error into next
// for the globalErrorHandling middleware to filter.
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(err => next(err));
  };
};

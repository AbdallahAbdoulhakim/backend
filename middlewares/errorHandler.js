const notFound = (req, res, next) => {
  res.status(404);
  const err = new Error(`Error 404 : Resource not found at ${req.originalUrl}`);
  next(err);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    error: { message: err.message, stack: err.stack },
  });
};

module.exports = { notFound, errorHandler };

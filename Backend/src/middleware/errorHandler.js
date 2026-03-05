export function errorHandler(err, req, res, next) {
  // eslint-disable-line @typescript-eslint/no-unused-vars
  console.error(err);

  const status = err.status || 500;
  const message = err.message || "Internal server error";

  res.status(status).json({
    message,
  });
}


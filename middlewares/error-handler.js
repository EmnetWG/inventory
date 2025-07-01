

const { StatusCodes } = require('http-status-codes');
const { ValidationError, UniqueConstraintError, ForeignKeyConstraintError } = require('sequelize');

const errorHandlerMiddleware = (err, req, res, next) => {
  console.error(err); // You might switch to a logger in production

  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, try again later',
  };

  if (err instanceof ValidationError) {
    customError.msg = err.errors.map(e => e.message).join(', ');
    customError.statusCode = 400;
  }

  if (err instanceof UniqueConstraintError) {
    customError.msg = err.errors.map(e => e.message).join(', ');
    customError.statusCode = 400;
  }

  if (err instanceof ForeignKeyConstraintError) {
    customError.msg = "Invalid reference in one of the related fields.";
    customError.statusCode = 400;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;

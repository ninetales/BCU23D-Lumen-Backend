import ErrorResponse from '../models/ErrorResponseModel.mjs';

export const errorHandler = (err, req, res, next) => {
    let error = { ...err };

    error.message = err.message;

    if (err.name === 'CastError') {
        error = new ErrorResponse(`Resource not found`, 404);
    }

    if (err.code === 11000) {
        error = new ErrorResponse(`Resource already exists`, 400);
    }

    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(`Information missing: ${message}`, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        statusCode: error.statusCode || 500,
        error: error.message || 'Server Error'
    });

}
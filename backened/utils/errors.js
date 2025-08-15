class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
    }
}

class ValidationError extends ApiError {
    constructor(message) {
        super(400, message);
    }
}

class NotFoundError extends ApiError {
    constructor(message) {
        super(404, message);
    }
}

class ServerError extends ApiError {
    constructor(message = 'Internal server error') {
        super(500, message);
    }
}

module.exports = { ApiError, ValidationError, NotFoundError, ServerError };
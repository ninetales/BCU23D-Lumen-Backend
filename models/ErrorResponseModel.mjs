/**
 * @desc This class is used to create an error response object
 * @param {string} message - The error message
 * @param {number} statusCode - The status code of the error
 */
export default class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
};
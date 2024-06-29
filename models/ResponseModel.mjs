/**
 * @desc Represents the response model
 * @param statusCode - contains the HTTP status code to be sent in the response
 * @param data - contains the data to be sent in the response
 * @param error - contains the error message to be sent in the response
 */
export default class ResponseModel {
    constructor(statusCode = 404, data = null) {
        this.success = false;
        this.statusCode = statusCode;

        if (statusCode >= 200 && statusCode <= 299) this.success = true;

        if (data) {
            if (Array.isArray(data)) {
                this.items = data.length;
            } else {
                this.items = 1;
            }
        } else {
            this.items = 0;
        }

        this.data = data;

    }

}